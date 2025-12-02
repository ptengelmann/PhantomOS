import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, productAssets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Confirm product-asset mapping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, assetIds, userId } = body;

    if (!productId || !assetIds || !Array.isArray(assetIds)) {
      return NextResponse.json(
        { error: 'Product ID and asset IDs are required' },
        { status: 400 }
      );
    }

    // Update product mapping status
    await db
      .update(products)
      .set({
        mappingStatus: 'confirmed',
        mappedBy: userId || null,
        mappedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    // Remove existing product-asset links
    await db.delete(productAssets).where(eq(productAssets.productId, productId));

    // Create new product-asset links
    if (assetIds.length > 0) {
      const links = assetIds.map((assetId: string, index: number) => ({
        productId,
        assetId,
        isPrimary: index === 0,
      }));

      await db.insert(productAssets).values(links);
    }

    return NextResponse.json({
      success: true,
      productId,
      assetIds,
      mappedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Product mapping error:', error);
    return NextResponse.json(
      { error: 'Failed to save product mapping' },
      { status: 500 }
    );
  }
}

// Skip product mapping
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await db
      .update(products)
      .set({
        mappingStatus: 'skipped',
        mappedBy: userId || null,
        mappedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    return NextResponse.json({
      success: true,
      productId,
      skippedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Skip mapping error:', error);
    return NextResponse.json(
      { error: 'Failed to skip product mapping' },
      { status: 500 }
    );
  }
}

// Get unmapped products with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publisherId = searchParams.get('publisherId');
    const status = searchParams.get('status') || 'unmapped';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    if (!publisherId) {
      return NextResponse.json(
        { error: 'Publisher ID is required' },
        { status: 400 }
      );
    }

    // Build query based on status
    let statusFilter;
    if (status === 'all') {
      statusFilter = undefined;
    } else if (status === 'pending') {
      // Pending includes unmapped and suggested
      statusFilter = ['unmapped', 'suggested'];
    } else {
      statusFilter = [status];
    }

    // For now, return demo data structure
    // In production, this would query the database
    const result = {
      products: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
      stats: {
        unmapped: 0,
        suggested: 0,
        confirmed: 0,
        skipped: 0,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get unmapped products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unmapped products' },
      { status: 500 }
    );
  }
}
