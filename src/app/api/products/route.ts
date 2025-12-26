import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, sales, connectors } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { resolvePublisher } from '@/lib/auth';

// Get all products for the current publisher
export async function GET() {
  try {
    // SECURITY: Session-first pattern - always check auth before demo mode
    const resolved = await resolvePublisher();
    if (!resolved) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { publisherId } = resolved;

    // Get products with revenue data
    const productsWithRevenue = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        description: products.description,
        category: products.category,
        price: products.price,
        vendor: products.vendor,
        imageUrl: products.imageUrl,
        mappingStatus: products.mappingStatus,
        connectorId: products.connectorId,
        totalRevenue: sql<number>`COALESCE(SUM(CAST(${sales.revenue} AS DECIMAL)), 0)`,
      })
      .from(products)
      .leftJoin(sales, eq(sales.productId, products.id))
      .where(eq(products.publisherId, publisherId))
      .groupBy(products.id);

    // Get connector info for source names
    const publisherConnectors = await db
      .select({ id: connectors.id, type: connectors.type })
      .from(connectors)
      .where(eq(connectors.publisherId, publisherId));

    const connectorMap = new Map(publisherConnectors.map(c => [c.id, c.type]));

    // Format products with source info
    const formattedProducts = productsWithRevenue.map(product => ({
      ...product,
      source: product.connectorId ? connectorMap.get(product.connectorId) || 'connector' : 'csv',
      totalRevenue: Number(product.totalRevenue || 0),
    }));

    // Calculate stats
    const stats = {
      total: formattedProducts.length,
      mapped: formattedProducts.filter(p => p.mappingStatus === 'confirmed').length,
      unmapped: formattedProducts.filter(p => p.mappingStatus === 'unmapped').length,
    };

    return NextResponse.json({
      products: formattedProducts,
      stats,
    });
  } catch (error) {
    console.error('Failed to load products:', error);
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  }
}
