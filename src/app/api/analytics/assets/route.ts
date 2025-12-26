import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { resolvePublisher } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Session-first pattern - always check auth before demo mode
    const resolved = await resolvePublisher();
    if (!resolved) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { publisherId } = resolved;

    const { searchParams } = new URL(request.url);
    const gameIpId = searchParams.get('gameIpId');

    // Asset performance scorecard
    const assetPerformance = await db.execute(sql`
      SELECT
        ia.id,
        ia.name,
        ia.asset_type,
        ia.image_url,
        gi.name as game_ip_name,
        COUNT(DISTINCT p.id) as product_count,
        COALESCE(SUM(s.revenue), 0) as total_revenue,
        COALESCE(SUM(s.quantity), 0) as total_units,
        COALESCE(AVG(s.revenue), 0) as avg_revenue_per_sale
      FROM ip_assets ia
      JOIN game_ips gi ON gi.id = ia.game_ip_id
      LEFT JOIN product_assets pa ON pa.asset_id = ia.id
      LEFT JOIN products p ON p.id = pa.product_id
      LEFT JOIN sales s ON s.product_id = p.id
      WHERE gi.publisher_id = ${publisherId}
      ${gameIpId ? sql`AND gi.id = ${gameIpId}` : sql``}
      GROUP BY ia.id, gi.name
      ORDER BY total_revenue DESC
    `);

    // Calculate performance scores (simplified algorithm)
    const scoredAssets = assetPerformance.rows.map((asset: Record<string, unknown>) => {
      const revenue = Number(asset.total_revenue) || 0;
      const units = Number(asset.total_units) || 0;
      const productCount = Number(asset.product_count) || 0;

      // Simple scoring: revenue weight 50%, units 30%, product diversity 20%
      const maxRevenue = Math.max(...assetPerformance.rows.map((a: Record<string, unknown>) => Number(a.total_revenue) || 0), 1);
      const maxUnits = Math.max(...assetPerformance.rows.map((a: Record<string, unknown>) => Number(a.total_units) || 0), 1);
      const maxProducts = Math.max(...assetPerformance.rows.map((a: Record<string, unknown>) => Number(a.product_count) || 0), 1);

      const score = Math.round(
        (revenue / maxRevenue * 50) +
        (units / maxUnits * 30) +
        (productCount / maxProducts * 20)
      );

      return {
        ...asset,
        score: Math.min(score, 100),
        trend: revenue > 0 ? 'stable' : 'new', // Would need historical data for real trend
      };
    });

    return NextResponse.json({
      assets: scoredAssets,
      total: scoredAssets.length,
    });
  } catch (error) {
    console.error('Asset analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch asset analytics' }, { status: 500 });
  }
}
