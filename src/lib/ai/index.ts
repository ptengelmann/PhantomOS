import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface AnalysisRequest {
  context: string;
  data: Record<string, unknown>;
  question: string;
}

export interface InsightResult {
  title: string;
  description: string;
  confidence: number;
  recommendations: string[];
  data?: Record<string, unknown>;
}

export async function generateInsights(request: AnalysisRequest): Promise<InsightResult[]> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are an AI analyst for PhantomOS, a gaming merchandise intelligence platform.

Context: ${request.context}

Data:
${JSON.stringify(request.data, null, 2)}

Question: ${request.question}

Analyze this data and provide actionable insights. Return your response as a JSON array of insights with this structure:
[
  {
    "title": "Short insight title",
    "description": "Detailed description of the insight",
    "confidence": 0.85,
    "recommendations": ["Action 1", "Action 2"]
  }
]

Only return valid JSON, no other text.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Strip markdown code blocks if present
  let text = content.text.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*\n?/, '');
    text = text.replace(/\n?```\s*$/, '');
  }

  try {
    const parsed = JSON.parse(text);
    // Validate the response structure
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
      return parsed;
    }
    throw new Error('Invalid response structure');
  } catch (parseError) {
    // Try to extract JSON from markdown code blocks or text
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      try {
        const extracted = JSON.parse(jsonMatch[0]);
        if (Array.isArray(extracted) && extracted.length > 0 && extracted[0].title) {
          return extracted;
        }
      } catch {
        // Continue to fallback
      }
    }

    // If all parsing fails, return a structured error response
    console.error('AI response parsing failed:', parseError);
    return [{
      title: 'Analysis Error',
      description: 'Unable to parse AI response. Please try again or check your data format.',
      confidence: 0.5,
      recommendations: ['Try generating insights again', 'Ensure you have sufficient data connected'],
    }];
  }
}

export async function predictDemand(
  productData: Record<string, unknown>,
  historicalSales: Record<string, unknown>[]
): Promise<{
  prediction: number;
  confidence: number;
  factors: string[];
  recommendation: string;
}> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a demand forecasting AI for gaming merchandise.

Product Data:
${JSON.stringify(productData, null, 2)}

Historical Sales (last periods):
${JSON.stringify(historicalSales, null, 2)}

Predict the demand for the next period. Return your response as JSON:
{
  "prediction": <number - predicted units>,
  "confidence": <0-1>,
  "factors": ["factor 1", "factor 2"],
  "recommendation": "What action to take"
}

Only return valid JSON.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Strip markdown code blocks if present
  let text = content.text.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*\n?/, '');
    text = text.replace(/\n?```\s*$/, '');
  }

  return JSON.parse(text);
}

export async function analyzeAssetPerformance(
  assetName: string,
  salesData: Record<string, unknown>[]
): Promise<{
  score: number;
  trend: 'rising' | 'stable' | 'declining';
  insights: string[];
  recommendedProducts: string[];
}> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are analyzing the performance of a gaming IP asset for merchandise.

Asset: ${assetName}

Sales Data:
${JSON.stringify(salesData, null, 2)}

Analyze this asset's merchandise performance and return JSON:
{
  "score": <1-100>,
  "trend": "rising" | "stable" | "declining",
  "insights": ["insight 1", "insight 2"],
  "recommendedProducts": ["product type 1", "product type 2"]
}

Only return valid JSON.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Strip markdown code blocks if present
  let text = content.text.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*\n?/, '');
    text = text.replace(/\n?```\s*$/, '');
  }

  return JSON.parse(text);
}

export { anthropic };
