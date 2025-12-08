import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { products, productAssets, ipAssets, gameIps } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface TagSuggestion {
  assetId: string;
  assetName: string;
  confidence: number;
  reason: string;
}

// Auto-tag unmapped products using AI
export async function POST(request: NextRequest) {
  try {
    // Get publisherId from session
    let publisherId: string;

    if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      const session = await getServerSession();
      if (!session?.user?.publisherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      publisherId = session.user.publisherId;
    }

    const body = await request.json();
    const { productIds, limit = 20 } = body as { productIds?: string[]; limit?: number };

    // Get available assets for this publisher
    const publisherGameIps = await db
      .select({
        id: gameIps.id,
        name: gameIps.name,
      })
      .from(gameIps)
      .where(eq(gameIps.publisherId, publisherId));

    if (publisherGameIps.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No game IPs found. Please create a game IP and assets first.',
        tagged: 0,
        total: 0,
      });
    }

    const gameIpIds = publisherGameIps.map(g => g.id);

    const availableAssets = await db
      .select({
        id: ipAssets.id,
        name: ipAssets.name,
        assetType: ipAssets.assetType,
        description: ipAssets.description,
        gameIpId: ipAssets.gameIpId,
      })
      .from(ipAssets)
      .where(inArray(ipAssets.gameIpId, gameIpIds));

    if (availableAssets.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No IP assets found. Please create some character/asset tags first.',
        tagged: 0,
        total: 0,
      });
    }

    // Get products to tag
    let productsToTag;
    if (productIds && productIds.length > 0) {
      productsToTag = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          sku: products.sku,
          category: products.category,
          tags: products.tags,
        })
        .from(products)
        .where(
          and(
            eq(products.publisherId, publisherId),
            inArray(products.id, productIds)
          )
        )
        .limit(limit);
    } else {
      // Get unmapped products
      productsToTag = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          sku: products.sku,
          category: products.category,
          tags: products.tags,
        })
        .from(products)
        .where(
          and(
            eq(products.publisherId, publisherId),
            eq(products.mappingStatus, 'unmapped')
          )
        )
        .limit(limit);
    }

    if (productsToTag.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unmapped products to tag',
        tagged: 0,
        total: 0,
      });
    }

    // Build the batch prompt for Claude
    const productsList = productsToTag
      .map(
        (p, idx) => {
          const tags = Array.isArray(p.tags) ? p.tags : [];
          return `Product ${idx + 1}:\n- ID: ${p.id}\n- Name: ${p.name}\n- Description: ${p.description || 'N/A'}\n- Category: ${p.category || 'N/A'}${tags.length ? `\n- Tags: ${tags.join(', ')}` : ''}`;
        }
      )
      .join('\n\n');

    const assetList = availableAssets
      .map((a, idx) => `${idx + 1}. ID: ${a.id}, Name: ${a.name} (${a.assetType})${a.description ? ` - ${a.description}` : ''}`)
      .join('\n');

    const gameIpContext = publisherGameIps.map(g => g.name).join(', ');

    const prompt = `You are an AI assistant helping to automatically tag gaming merchandise products with the correct IP assets (characters, logos, themes).

Game IP Context: ${gameIpContext}

Available IP Assets:
${assetList}

Products to Tag:
${productsList}

For each product, analyze the name, description, and tags to determine which IP assets this product features. Look for:
1. Direct mentions of character/asset names in product name or description
2. Partial name matches (e.g., "Shadow" matches "Shadow Knight")
3. Thematic connections (dark/shadow themes for villain characters, etc.)
4. Product type hints (plush → cute characters, action figure → heroes)

Respond with a JSON object where keys are product IDs and values are arrays of asset suggestions.
Only include matches with confidence >= 60.
If no assets match, return an empty array for that product.

Response format (JSON only, no explanation):
{
  "product-id-1": [{"assetId": "...", "assetName": "...", "confidence": 85, "reason": "Name contains character name"}],
  "product-id-2": []
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the response
    let batchResults: Record<string, TagSuggestion[]> = {};
    try {
      batchResults = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        batchResults = JSON.parse(jsonMatch[0]);
      }
    }

    // Apply the tags to products
    let taggedCount = 0;
    const results: Array<{ productId: string; assets: string[]; status: string }> = [];

    for (const [productId, suggestions] of Object.entries(batchResults)) {
      const validSuggestions = (suggestions as TagSuggestion[])
        .filter(s => s.confidence >= 60 && availableAssets.some(a => a.id === s.assetId))
        .sort((a, b) => b.confidence - a.confidence);

      if (validSuggestions.length > 0) {
        // Insert product-asset links
        for (const suggestion of validSuggestions) {
          try {
            // Check if link already exists
            const existing = await db
              .select({ productId: productAssets.productId })
              .from(productAssets)
              .where(
                and(
                  eq(productAssets.productId, productId),
                  eq(productAssets.assetId, suggestion.assetId)
                )
              )
              .limit(1);

            if (existing.length === 0) {
              await db.insert(productAssets).values({
                productId,
                assetId: suggestion.assetId,
                isPrimary: validSuggestions.indexOf(suggestion) === 0,
              });
            }
          } catch (err) {
            console.error(`Failed to link asset ${suggestion.assetId} to product ${productId}:`, err);
          }
        }

        // Update product status
        await db
          .update(products)
          .set({
            mappingStatus: 'suggested',
            aiSuggestedAssets: validSuggestions.map(s => ({
              assetId: s.assetId,
              assetName: s.assetName,
              confidence: s.confidence,
              reason: s.reason,
            })),
            updatedAt: new Date(),
          })
          .where(eq(products.id, productId));

        taggedCount++;
        results.push({
          productId,
          assets: validSuggestions.map(s => s.assetName),
          status: 'tagged',
        });
      } else {
        results.push({
          productId,
          assets: [],
          status: 'no_match',
        });
      }
    }

    return NextResponse.json({
      success: true,
      tagged: taggedCount,
      total: productsToTag.length,
      results,
    });
  } catch (error) {
    console.error('Auto-tag error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-tag products' },
      { status: 500 }
    );
  }
}
