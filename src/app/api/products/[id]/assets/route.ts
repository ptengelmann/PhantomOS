import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productAssets, ipAssets, products, gameIps } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId, canWrite } from '@/lib/auth';

// GET - Get assets for a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
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

    // Verify product belongs to publisher
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.publisherId, publisherId)))
      .limit(1);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get all assets linked to this product
    const linkedAssets = await db
      .select({
        linkId: productAssets.id,
        isPrimary: productAssets.isPrimary,
        asset: {
          id: ipAssets.id,
          name: ipAssets.name,
          assetType: ipAssets.assetType,
          imageUrl: ipAssets.imageUrl,
        },
        gameIp: {
          id: gameIps.id,
          name: gameIps.name,
        },
      })
      .from(productAssets)
      .innerJoin(ipAssets, eq(productAssets.assetId, ipAssets.id))
      .innerJoin(gameIps, eq(ipAssets.gameIpId, gameIps.id))
      .where(eq(productAssets.productId, productId));

    return NextResponse.json({
      assets: linkedAssets.map(row => ({
        linkId: row.linkId,
        isPrimary: row.isPrimary,
        ...row.asset,
        gameIp: row.gameIp,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch product assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

// POST - Add asset(s) to a product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    let publisherId: string;

    // SECURITY: Require write access (owner/admin only)
    if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      const session = await getServerSession();
      if (!session?.user?.publisherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (!canWrite(session.user.role)) {
        return NextResponse.json({ error: 'Write access required' }, { status: 403 });
      }
      publisherId = session.user.publisherId;
    }

    const body = await request.json();
    const { assetIds, isPrimary = false } = body as { assetIds: string[]; isPrimary?: boolean };

    if (!assetIds || assetIds.length === 0) {
      return NextResponse.json(
        { error: 'Asset IDs are required' },
        { status: 400 }
      );
    }

    // Verify product belongs to publisher
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.publisherId, publisherId)))
      .limit(1);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Add each asset link (skip if already exists)
    const results = [];
    for (const assetId of assetIds) {
      // Check if link already exists
      const [existing] = await db
        .select({ id: productAssets.id })
        .from(productAssets)
        .where(
          and(
            eq(productAssets.productId, productId),
            eq(productAssets.assetId, assetId)
          )
        )
        .limit(1);

      if (!existing) {
        const [link] = await db
          .insert(productAssets)
          .values({
            productId,
            assetId,
            isPrimary,
          })
          .returning();
        results.push(link);
      }
    }

    // Update product mapping status
    await db
      .update(products)
      .set({
        mappingStatus: 'confirmed',
        mappedAt: new Date(),
      })
      .where(eq(products.id, productId));

    return NextResponse.json({
      success: true,
      added: results.length,
    });
  } catch (error) {
    console.error('Failed to add product assets:', error);
    return NextResponse.json(
      { error: 'Failed to add assets' },
      { status: 500 }
    );
  }
}

// DELETE - Remove asset from product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    let publisherId: string;

    // SECURITY: Require write access (owner/admin only)
    if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      const session = await getServerSession();
      if (!session?.user?.publisherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (!canWrite(session.user.role)) {
        return NextResponse.json({ error: 'Write access required' }, { status: 403 });
      }
      publisherId = session.user.publisherId;
    }

    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');

    if (!assetId) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      );
    }

    // Verify product belongs to publisher
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.publisherId, publisherId)))
      .limit(1);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete the link
    await db
      .delete(productAssets)
      .where(
        and(
          eq(productAssets.productId, productId),
          eq(productAssets.assetId, assetId)
        )
      );

    // Check if any assets remain, update status if not
    const [remaining] = await db
      .select({ count: productAssets.id })
      .from(productAssets)
      .where(eq(productAssets.productId, productId))
      .limit(1);

    if (!remaining) {
      await db
        .update(products)
        .set({
          mappingStatus: 'unmapped',
          mappedAt: null,
        })
        .where(eq(products.id, productId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove product asset:', error);
    return NextResponse.json(
      { error: 'Failed to remove asset' },
      { status: 500 }
    );
  }
}
