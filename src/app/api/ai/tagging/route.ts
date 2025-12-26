import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { resolvePublisher } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { rateLimit } from '@/lib/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Fetch confirmed mappings to use as few-shot examples
async function getConfirmedMappingExamples(category?: string, limit: number = 15): Promise<string> {
  try {
    // Get confirmed mappings from across all publishers (the network effect!)
    const examples = await db.execute(sql`
      SELECT
        p.name as product_name,
        p.category as product_category,
        ia.name as asset_name,
        ia.asset_type
      FROM product_assets pa
      JOIN products p ON p.id = pa.product_id
      JOIN ip_assets ia ON ia.id = pa.asset_id
      ORDER BY
        CASE WHEN p.category = ${category || ''} THEN 0 ELSE 1 END,
        pa.created_at DESC
      LIMIT ${limit}
    `);

    if (examples.rows.length === 0) {
      return '';
    }

    const exampleList = examples.rows
      .map((ex: any) => `- "${ex.product_name}" → ${ex.asset_name} (${ex.asset_type})`)
      .join('\n');

    return `
LEARNED PATTERNS (from ${examples.rows.length} confirmed mappings):
These are real examples of products that have been correctly tagged. Use these patterns to inform your suggestions:
${exampleList}

`;
  } catch (error) {
    console.error('Failed to fetch mapping examples:', error);
    return '';
  }
}

interface Asset {
  id: string;
  name: string;
  type: string;
  description?: string;
  tags?: string[];
}

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  tags?: string[];
}

interface TagSuggestion {
  assetId: string;
  assetName: string;
  confidence: number;
  reason: string;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit AI endpoints
    const rateLimitResponse = await rateLimit('ai');
    if (rateLimitResponse) return rateLimitResponse;

    // SECURITY: Session-first pattern
    const resolved = await resolvePublisher();
    if (!resolved) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { product, assets, gameIp } = body as {
      product: Product;
      assets: Asset[];
      gameIp?: { name: string; description?: string };
    };

    if (!product || !assets || assets.length === 0) {
      return NextResponse.json(
        { error: 'Product and assets are required' },
        { status: 400 }
      );
    }

    // Fetch few-shot examples from confirmed mappings (the learning part!)
    const learnedExamples = await getConfirmedMappingExamples(product.category);

    // Build the prompt for Claude - IMPORTANT: Include actual UUID so Claude returns it correctly
    const assetList = assets
      .map((a) => `- ID: "${a.id}" | Name: ${a.name} (${a.type})${a.description ? `: ${a.description}` : ''}`)
      .join('\n');

    const prompt = `You are an AI assistant helping to tag gaming merchandise products with the correct IP assets (characters, logos, themes, etc.).

Game IP Context:
${gameIp ? `- Game: ${gameIp.name}\n- Description: ${gameIp.description || 'N/A'}` : 'No game IP context provided'}
${learnedExamples}
Product to Tag:
- Name: ${product.name}
- Description: ${product.description || 'N/A'}
- SKU: ${product.sku || 'N/A'}
- Category: ${product.category || 'N/A'}
${product.tags?.length ? `- Tags: ${product.tags.join(', ')}` : ''}

Available IP Assets:
${assetList}

Task: Analyze the product name, description, and any other available information to determine which IP assets this product features. Use the learned patterns above to guide your suggestions - these are real examples of correct mappings.

Consider:
1. Direct mentions of character/asset names
2. Visual descriptions (colors, symbols, motifs)
3. Thematic elements (dark themes → villain characters, heroic themes → protagonist)
4. Product category context (collectibles often feature specific characters)
5. Patterns from the learned examples above

Respond with a JSON array of suggested assets, ordered by confidence. For each suggestion include:
- assetId: MUST be the exact ID string from the "Available IP Assets" list above (UUID format)
- assetName: the asset's name
- confidence: a number from 0-100 representing your confidence
- reason: a brief explanation of why this asset matches

IMPORTANT: The assetId must be the exact UUID string shown after "ID:" in the asset list, not a number or index.

Only suggest assets with confidence >= 50. If no assets match with high confidence, return an empty array.

Response format (JSON only, no explanation):
[
  {"assetId": "uuid-string-here", "assetName": "...", "confidence": 85, "reason": "..."},
  ...
]`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response
    let suggestions: TagSuggestion[] = [];
    try {
      // Try to parse the entire response as JSON first
      suggestions = JSON.parse(responseText);
    } catch {
      // If that fails, try to extract JSON array from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      }
    }

    // Build set of valid asset IDs for validation
    const validAssetIds = new Set(assets.map(a => a.id));

    // Validate and clean suggestions - MUST have valid UUID from asset list
    suggestions = suggestions
      .filter(
        (s) =>
          s.assetId &&
          s.assetName &&
          typeof s.confidence === 'number' &&
          s.confidence >= 50 &&
          validAssetIds.has(s.assetId) // Only accept IDs that exist in the asset list
      )
      .map((s) => ({
        assetId: s.assetId,
        assetName: s.assetName,
        confidence: Math.min(100, Math.max(0, Math.round(s.confidence))),
        reason: s.reason || 'Pattern match detected',
      }))
      .sort((a, b) => b.confidence - a.confidence);

    return NextResponse.json({
      productId: product.id,
      suggestions,
    });
  } catch (error) {
    console.error('AI tagging error:', error);
    return NextResponse.json(
      { error: 'Failed to generate tagging suggestions' },
      { status: 500 }
    );
  }
}

// Bulk tagging endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { products, assets, gameIp } = body as {
      products: Product[];
      assets: Asset[];
      gameIp?: { name: string; description?: string };
    };

    if (!products || !assets || products.length === 0 || assets.length === 0) {
      return NextResponse.json(
        { error: 'Products and assets are required' },
        { status: 400 }
      );
    }

    // Fetch few-shot examples for bulk tagging (the learning part!)
    const learnedExamples = await getConfirmedMappingExamples(undefined, 20);

    // Process products in batches to avoid rate limiting
    const batchSize = 5;
    const results: Array<{ productId: string; suggestions: TagSuggestion[] }> = [];

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);

      // Build batch prompt
      const productsList = batch
        .map(
          (p, idx) =>
            `Product ${idx + 1}:\n- ID: ${p.id}\n- Name: ${p.name}\n- Description: ${p.description || 'N/A'}\n- Category: ${p.category || 'N/A'}`
        )
        .join('\n\n');

      const assetList = assets
        .map((a) => `- ID: "${a.id}" | Name: ${a.name} (${a.type})`)
        .join('\n');

      const prompt = `You are an AI assistant helping to tag gaming merchandise products with the correct IP assets.

Game IP: ${gameIp?.name || 'Unknown'}
${learnedExamples}
Available IP Assets:
${assetList}

Products to Tag:
${productsList}

For each product, analyze and suggest which assets it features. Use the learned patterns above to guide your suggestions - these are real examples of correct mappings.

IMPORTANT: The assetId must be the exact UUID string shown after "ID:" in the asset list, not a number or index.

Respond with a JSON object where keys are product IDs and values are arrays of suggestions.

Response format (JSON only):
{
  "product-id-1": [{"assetId": "uuid-from-asset-list", "assetName": "...", "confidence": 85, "reason": "..."}],
  "product-id-2": [...]
}`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

      try {
        let batchResults: Record<string, TagSuggestion[]> = {};
        try {
          batchResults = JSON.parse(responseText);
        } catch {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            batchResults = JSON.parse(jsonMatch[0]);
          }
        }

        // Build set of valid asset IDs for validation
        const validAssetIds = new Set(assets.map(a => a.id));

        for (const [productId, suggestions] of Object.entries(batchResults)) {
          results.push({
            productId,
            suggestions: (suggestions as TagSuggestion[])
              .filter((s) => s.confidence >= 50 && validAssetIds.has(s.assetId))
              .sort((a, b) => b.confidence - a.confidence),
          });
        }
      } catch (parseError) {
        console.error('Failed to parse batch results:', parseError);
      }

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < products.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Bulk AI tagging error:', error);
    return NextResponse.json(
      { error: 'Failed to generate bulk tagging suggestions' },
      { status: 500 }
    );
  }
}
