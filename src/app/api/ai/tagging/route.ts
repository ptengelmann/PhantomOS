import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession, isDemoMode } from '@/lib/auth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
    // SECURITY: Verify user is authenticated
    if (!isDemoMode()) {
      const session = await getServerSession();
      if (!session?.user?.publisherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
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

    // Build the prompt for Claude
    const assetList = assets
      .map((a, idx) => `${idx + 1}. ${a.name} (${a.type})${a.description ? `: ${a.description}` : ''}`)
      .join('\n');

    const prompt = `You are an AI assistant helping to tag gaming merchandise products with the correct IP assets (characters, logos, themes, etc.).

Game IP Context:
${gameIp ? `- Game: ${gameIp.name}\n- Description: ${gameIp.description || 'N/A'}` : 'No game IP context provided'}

Product to Tag:
- Name: ${product.name}
- Description: ${product.description || 'N/A'}
- SKU: ${product.sku || 'N/A'}
- Category: ${product.category || 'N/A'}
${product.tags?.length ? `- Tags: ${product.tags.join(', ')}` : ''}

Available IP Assets:
${assetList}

Task: Analyze the product name, description, and any other available information to determine which IP assets this product features. Consider:
1. Direct mentions of character/asset names
2. Visual descriptions (colors, symbols, motifs)
3. Thematic elements (dark themes → villain characters, heroic themes → protagonist)
4. Product category context (collectibles often feature specific characters)

Respond with a JSON array of suggested assets, ordered by confidence. For each suggestion include:
- assetId: the asset's ID
- assetName: the asset's name
- confidence: a number from 0-100 representing your confidence
- reason: a brief explanation of why this asset matches

Only suggest assets with confidence >= 50. If no assets match with high confidence, return an empty array.

Response format (JSON only, no explanation):
[
  {"assetId": "...", "assetName": "...", "confidence": 85, "reason": "..."},
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

    // Validate and clean suggestions
    suggestions = suggestions
      .filter(
        (s) =>
          s.assetId &&
          s.assetName &&
          typeof s.confidence === 'number' &&
          s.confidence >= 50
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
        .map((a, idx) => `${idx + 1}. ID: ${a.id}, Name: ${a.name} (${a.type})`)
        .join('\n');

      const prompt = `You are an AI assistant helping to tag gaming merchandise products with the correct IP assets.

Game IP: ${gameIp?.name || 'Unknown'}

Available IP Assets:
${assetList}

Products to Tag:
${productsList}

For each product, analyze and suggest which assets it features. Respond with a JSON object where keys are product IDs and values are arrays of suggestions.

Response format (JSON only):
{
  "product-id-1": [{"assetId": "...", "assetName": "...", "confidence": 85, "reason": "..."}],
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

        for (const [productId, suggestions] of Object.entries(batchResults)) {
          results.push({
            productId,
            suggestions: (suggestions as TagSuggestion[])
              .filter((s) => s.confidence >= 50)
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
