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

  try {
    return JSON.parse(content.text);
  } catch {
    return [{
      title: 'Analysis Complete',
      description: content.text,
      confidence: 0.7,
      recommendations: [],
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

  return JSON.parse(content.text);
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

  return JSON.parse(content.text);
}

export { anthropic };
