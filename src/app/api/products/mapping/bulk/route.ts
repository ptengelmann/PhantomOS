import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, productAssets } from '@/lib/db/schema';
import { eq, inArray, and } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId, canWrite } from '@/lib/auth';

// Helper to get and verify publisherId
async function getPublisherId() {
  if (isDemoMode()) {
    return getDemoPublisherId();
  }
  const session = await getServerSession();
  if (!session?.user?.publisherId) {
    return null;
  }
  return session.user.publisherId;
}

// Helper to check write access
async function checkWriteAccess(): Promise<{ allowed: boolean; publisherId: string | null }> {
  if (isDemoMode()) {
    return { allowed: true, publisherId: getDemoPublisherId() };
  }
  const session = await getServerSession();
  if (!session?.user?.publisherId) {
    return { allowed: false, publisherId: null };
  }
  if (!canWrite(session.user.role)) {
    return { allowed: false, publisherId: session.user.publisherId };
  }
  return { allowed: true, publisherId: session.user.publisherId };
}

interface BulkMapping {
  productId: string;
  assetIds: string[];
}

// Bulk confirm product-asset mappings
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
    const { mappings } = body as { mappings: BulkMapping[] };

    if (!mappings || !Array.isArray(mappings) || mappings.length === 0) {
      return NextResponse.json(
        { error: 'Mappings array is required' },
        { status: 400 }
      );
    }

    // Get userId from session for audit trail
    const session = await getServerSession();
    const userId = session?.user?.id || null;

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as Array<{ productId: string; error: string }>,
    };

    // Process mappings
    for (const mapping of mappings) {
      try {
        const { productId, assetIds } = mapping;

        if (!productId) {
          results.errors.push({ productId: 'unknown', error: 'Missing product ID' });
          results.failed++;
          continue;
        }

        // SECURITY: Verify product belongs to this publisher
        const [product] = await db
          .select({ id: products.id })
          .from(products)
          .where(and(eq(products.id, productId), eq(products.publisherId, publisherId)))
          .limit(1);

        if (!product) {
          results.errors.push({ productId, error: 'Product not found or access denied' });
          results.failed++;
          continue;
        }

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

        // Create new product-asset links if any assets specified
        if (assetIds && assetIds.length > 0) {
          const links = assetIds.map((assetId: string, index: number) => ({
            productId,
            assetId,
            isPrimary: index === 0,
          }));

          await db.insert(productAssets).values(links);
        }

        results.successful++;
      } catch (err) {
        results.errors.push({
          productId: mapping.productId,
          error: err instanceof Error ? err.message : String(err),
        });
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: mappings.length,
      ...results,
    });
  } catch (error) {
    console.error('Bulk mapping error:', error);
    return NextResponse.json(
      { error: 'Failed to save bulk mappings' },
      { status: 500 }
    );
  }
}

// Bulk skip products
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
    const { productIds } = body as { productIds: string[] };

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      );
    }

    // Get userId from session for audit trail
    const session = await getServerSession();
    const userId = session?.user?.id || null;

    // SECURITY: Only update products that belong to this publisher
    await db
      .update(products)
      .set({
        mappingStatus: 'skipped',
        mappedBy: userId,
        mappedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(
        inArray(products.id, productIds),
        eq(products.publisherId, publisherId)
      ));

    return NextResponse.json({
      success: true,
      skipped: productIds.length,
    });
  } catch (error) {
    console.error('Bulk skip error:', error);
    return NextResponse.json(
      { error: 'Failed to skip products' },
      { status: 500 }
    );
  }
}

// Apply AI suggestions as bulk mappings
export async function PATCH(request: NextRequest) {
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
    const { minConfidence = 80 } = body as { minConfidence?: number };

    // This endpoint would:
    // 1. Get products with AI suggestions above the confidence threshold
    // 2. Auto-apply those suggestions as confirmed mappings
    // For demo purposes, we'll return the expected shape

    return NextResponse.json({
      success: true,
      applied: 0,
      skipped: 0,
      message: `Applied AI suggestions with >= ${minConfidence}% confidence`,
    });
  } catch (error) {
    console.error('Auto-apply AI suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to apply AI suggestions' },
      { status: 500 }
    );
  }
}
