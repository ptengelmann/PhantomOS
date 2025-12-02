import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 50); // Max 50 per request
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Handle 'other' category (null category in DB)
    const categoryFilter = category === 'other'
      ? sql`${products.category} IS NULL OR ${products.category} = 'other'`
      : eq(products.category, category as any);

    // Get products for this category with pagination
    const categoryProducts = await db
      .select({
        id: products.id,
        name: products.name,
        imageUrl: products.imageUrl,
        price: products.price,
        sku: products.sku,
        totalRevenue: products.totalRevenue,
      })
      .from(products)
      .where(and(eq(products.publisherId, publisherId), categoryFilter))
      .orderBy(desc(products.totalRevenue), desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(eq(products.publisherId, publisherId), categoryFilter));

    const totalCount = Number(countResult?.count || 0);

    return NextResponse.json({
      products: categoryProducts.map(p => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        price: p.price ? Number(p.price) : null,
        sku: p.sku,
        revenue: p.totalRevenue ? Number(p.totalRevenue) : 0,
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
