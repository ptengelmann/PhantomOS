import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, productAssets } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId, canWrite } from '@/lib/auth';

// Helper to get and verify publisherId
async function getPublisherId() {
  const session = await getServerSession();
  if (session?.user?.publisherId) {
    return session.user.publisherId;
  }
  if (isDemoMode()) {
    return getDemoPublisherId();
  }
  return null;
}

// Helper to check write access - ALWAYS checks RBAC when user is logged in
async function checkWriteAccess(): Promise<{ allowed: boolean; publisherId: string | null }> {
  const session = await getServerSession();

  if (session?.user?.publisherId) {
    // User is logged in - always check RBAC regardless of demo mode
    if (!canWrite(session.user.role)) {
      return { allowed: false, publisherId: session.user.publisherId };
    }
    return { allowed: true, publisherId: session.user.publisherId };
  }

  // No session - fall back to demo mode if enabled
  if (isDemoMode()) {
    return { allowed: true, publisherId: getDemoPublisherId() };
  }

  return { allowed: false, publisherId: null };
}

// Confirm product-asset mapping
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Require write access (owner/admin only)
    const { allowed, publisherId } = await checkWriteAccess();
    if (!publisherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!allowed) {
      return NextResponse.json({ error: 'Write access required' }, { status: 403 });
    }

    const body = await request.json();
    const { productId, assetIds } = body;

    if (!productId || !assetIds || !Array.isArray(assetIds)) {
      return NextResponse.json(
        { error: 'Product ID and asset IDs are required' },
        { status: 400 }
      );
    }

    // SECURITY: Verify product belongs to this publisher
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.publisherId, publisherId)))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or access denied' },
        { status: 404 }
      );
    }

    // Get userId from session for audit trail
    const session = await getServerSession();
    const userId = session?.user?.id || null;

    // Update product mapping status
    await db
      .update(products)
      .set({
        mappingStatus: 'confirmed',
        mappedBy: userId,
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
    // SECURITY: Require write access (owner/admin only)
    const { allowed, publisherId } = await checkWriteAccess();
    if (!publisherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!allowed) {
      return NextResponse.json({ error: 'Write access required' }, { status: 403 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // SECURITY: Verify product belongs to this publisher
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.publisherId, publisherId)))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or access denied' },
        { status: 404 }
      );
    }

    // Get userId from session for audit trail
    const session = await getServerSession();
    const userId = session?.user?.id || null;

    await db
      .update(products)
      .set({
        mappingStatus: 'skipped',
        mappedBy: userId,
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
    // SECURITY: Get publisherId from session, not query params
    const publisherId = await getPublisherId();
    if (!publisherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'unmapped';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query based on status
    let statusFilter;
    if (status === 'all') {
      statusFilter = undefined;
    } else if (status === 'pending') {
      statusFilter = ['unmapped', 'suggested'];
    } else {
      statusFilter = [status];
    }

    // For now, return demo data structure
    // In production, this would query the database with publisherId filter
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
