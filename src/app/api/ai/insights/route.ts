import { NextRequest, NextResponse } from 'next/server';
import { generateInsights } from '@/lib/ai';
import { db } from '@/lib/db';
import { sql, eq, desc } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';
import { aiInsights, gameIps } from '@/lib/db/schema';

// GET: Retrieve stored insights
export async function GET(request: NextRequest) {
  try {
    let publisherId: string;

    // Check session first for real user data
    const session = await getServerSession();
    if (session?.user?.publisherId) {
      publisherId = session.user.publisherId;
    } else if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unread') === 'true';

    // Fetch insights from database
    let query = db
      .select({
        id: aiInsights.id,
        type: aiInsights.type,
        title: aiInsights.title,
        description: aiInsights.description,
        confidence: aiInsights.confidence,
        data: aiInsights.data,
        isRead: aiInsights.isRead,
        createdAt: aiInsights.createdAt,
        gameIpId: aiInsights.gameIpId,
        assetId: aiInsights.assetId,
      })
      .from(aiInsights)
      .where(eq(aiInsights.publisherId, publisherId))
      .orderBy(desc(aiInsights.createdAt))
      .limit(limit);

    const insights = await query;

    return NextResponse.json({
      insights,
      total: insights.length,
    });
  } catch (error) {
    console.error('Get insights error:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}

// POST: Generate new insights using AI
export async function POST(request: NextRequest) {
  try {
    let publisherId: string;

    // Check session first for real user data
    const session = await getServerSession();
    if (session?.user?.publisherId) {
      publisherId = session.user.publisherId;
    } else if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, persist = true } = body;

    // Fetch ALL products (not just ones with sales)
    const productsData = await db.execute(sql`
      SELECT
        p.id,
        p.name,
        p.category,
        p.price,
        p.sku,
        p.created_at,
        COALESCE(
          (SELECT json_agg(ia.name)
           FROM product_assets pa
           JOIN ip_assets ia ON ia.id = pa.asset_id
           WHERE pa.product_id = p.id),
          '[]'
        ) as tagged_assets
      FROM products p
      WHERE p.publisher_id = ${publisherId}
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

    // Fetch IP assets
    const ipAssetsData = await db.execute(sql`
      SELECT
        ia.id,
        ia.name,
        ia.asset_type,
        gi.name as game_ip,
        (SELECT COUNT(*) FROM product_assets pa WHERE pa.asset_id = ia.id) as product_count
      FROM ip_assets ia
      JOIN game_ips gi ON gi.id = ia.game_ip_id
      WHERE gi.publisher_id = ${publisherId}
    `);

    // Fetch sales data if any
    const salesData = await db.execute(sql`
      SELECT
        p.name as product_name,
        p.category,
        ia.name as asset_name,
        SUM(s.revenue::numeric) as revenue,
        SUM(s.quantity) as units,
        COUNT(*) as orders
      FROM sales s
      JOIN products p ON p.id = s.product_id
      LEFT JOIN product_assets pa ON pa.product_id = p.id
      LEFT JOIN ip_assets ia ON ia.id = pa.asset_id
      WHERE s.publisher_id = ${publisherId}
        AND s.order_date >= NOW() - INTERVAL '30 days'
      GROUP BY p.name, p.category, ia.name
      ORDER BY revenue DESC
      LIMIT 20
    `);

    // Calculate tagging stats
    const taggingStats = await db.execute(sql`
      SELECT
        COUNT(*) as total_products,
        COUNT(CASE WHEN EXISTS (SELECT 1 FROM product_assets pa WHERE pa.product_id = p.id) THEN 1 END) as tagged_products
      FROM products p
      WHERE p.publisher_id = ${publisherId}
    `);

    const stats = taggingStats.rows[0] as { total_products: number; tagged_products: number } | undefined;
    const totalProducts = Number(stats?.total_products || 0);
    const taggedProducts = Number(stats?.tagged_products || 0);
    const untaggedProducts = totalProducts - taggedProducts;

    // Build rich context for AI
    const context = `You are analyzing a gaming merchandise catalog for PhantomOS.

CATALOG SUMMARY:
- Total products: ${totalProducts}
- Tagged with IP assets: ${taggedProducts}
- Untagged (need mapping): ${untaggedProducts}
- IP Assets created: ${ipAssetsData.rows.length}

Your job is to provide SPECIFIC, ACTIONABLE insights based on the actual products and data.
Be specific about product names, categories, and characters when making recommendations.
Focus on practical merchandising opportunities.`;

    const rawInsights = await generateInsights({
      context,
      data: {
        products: productsData.rows.slice(0, 30),
        ipAssets: ipAssetsData.rows,
        recentSales: salesData.rows,
        taggingProgress: {
          total: totalProducts,
          tagged: taggedProducts,
          untagged: untaggedProducts,
          percentComplete: totalProducts > 0 ? Math.round((taggedProducts / totalProducts) * 100) : 0,
        },
        analysisType: type || 'general',
      },
      question: `Analyze this merchandise catalog and provide 3-5 specific, actionable insights:
1. If products exist but are untagged, identify specific products that should be prioritized for tagging
2. Look at product names/categories to suggest which IP assets they might belong to
3. Identify gaps in the product catalog (e.g., "You have Mario products but no Luigi")
4. Spot pricing optimization opportunities
5. Recommend specific next actions

Be SPECIFIC - mention actual product names and categories from the data. No generic advice.`,
    });

    // Persist insights to database if requested
    if (persist && rawInsights.length > 0) {
      // Get the first game IP for this publisher
      const [gameIp] = await db
        .select({ id: gameIps.id })
        .from(gameIps)
        .where(eq(gameIps.publisherId, publisherId))
        .limit(1);

      const gameIpId = gameIp?.id;

      // Transform and insert insights
      const insightsToInsert = rawInsights.map((insight) => ({
        publisherId,
        gameIpId,
        type: mapInsightType(insight.title),
        title: insight.title,
        description: insight.description,
        confidence: (insight.confidence || 0.8).toFixed(2),
        data: {
          recommendations: insight.recommendations || [],
          generatedAt: new Date().toISOString(),
          analysisType: type || 'general',
        },
        isRead: false,
      }));

      // Clear old insights and insert new ones
      await db
        .delete(aiInsights)
        .where(eq(aiInsights.publisherId, publisherId));

      await db.insert(aiInsights).values(insightsToInsert);
    }

    return NextResponse.json({
      insights: rawInsights,
      persisted: persist,
      count: rawInsights.length,
    });
  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}

// PATCH: Mark insight as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.publisherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { insightId, isRead = true } = body;

    if (!insightId) {
      return NextResponse.json({ error: 'insightId required' }, { status: 400 });
    }

    await db
      .update(aiInsights)
      .set({ isRead })
      .where(eq(aiInsights.id, insightId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update insight error:', error);
    return NextResponse.json({ error: 'Failed to update insight' }, { status: 500 });
  }
}

// Helper to map insight title to type
function mapInsightType(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('opportunity') || lowerTitle.includes('potential') || lowerTitle.includes('growth')) {
    return 'opportunity';
  }
  if (lowerTitle.includes('warning') || lowerTitle.includes('decline') || lowerTitle.includes('risk')) {
    return 'warning';
  }
  if (lowerTitle.includes('recommend') || lowerTitle.includes('action') || lowerTitle.includes('should')) {
    return 'recommendation';
  }
  return 'insight';
}
