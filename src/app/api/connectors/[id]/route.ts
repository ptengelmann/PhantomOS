import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectors, products, sales, productAssets } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId, canWrite } from '@/lib/auth';

// DELETE - Disconnect/delete a connector and its associated data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: connectorId } = await params;
    let publisherId: string;

    // SECURITY: Require write access (owner/admin only)
    const session = await getServerSession();

    if (session?.user?.publisherId) {
      // User is logged in - always check RBAC regardless of demo mode
      if (!canWrite(session.user.role)) {
        return NextResponse.json({ error: 'Write access required' }, { status: 403 });
      }
      publisherId = session.user.publisherId;
    } else if (isDemoMode()) {
      // No session but demo mode - allow anonymous access
      publisherId = getDemoPublisherId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify connector belongs to publisher
    const [connector] = await db
      .select({ id: connectors.id })
      .from(connectors)
      .where(and(eq(connectors.id, connectorId), eq(connectors.publisherId, publisherId)))
      .limit(1);

    if (!connector) {
      return NextResponse.json({ error: 'Connector not found' }, { status: 404 });
    }

    // Get all product IDs from this connector first
    const connectorProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.connectorId, connectorId));

    const productIds = connectorProducts.map(p => p.id);

    // Delete in correct order to respect foreign key constraints:

    // 1. Delete sales that reference these products (by productId)
    if (productIds.length > 0) {
      await db
        .delete(sales)
        .where(inArray(sales.productId, productIds));

      // 2. Delete product-asset mappings for these products
      await db
        .delete(productAssets)
        .where(inArray(productAssets.productId, productIds));
    }

    // 3. Also delete any sales directly linked to this connector (in case of orphans)
    await db
      .delete(sales)
      .where(eq(sales.connectorId, connectorId));

    // 4. Delete products from this connector
    await db
      .delete(products)
      .where(eq(products.connectorId, connectorId));

    // 5. Delete the connector
    await db
      .delete(connectors)
      .where(eq(connectors.id, connectorId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete connector:', error);
    return NextResponse.json(
      { error: 'Failed to delete connector' },
      { status: 500 }
    );
  }
}

// GET - Get connector details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: connectorId } = await params;
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

    const [connector] = await db
      .select()
      .from(connectors)
      .where(and(eq(connectors.id, connectorId), eq(connectors.publisherId, publisherId)))
      .limit(1);

    if (!connector) {
      return NextResponse.json({ error: 'Connector not found' }, { status: 404 });
    }

    return NextResponse.json({ connector });
  } catch (error) {
    console.error('Failed to fetch connector:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connector' },
      { status: 500 }
    );
  }
}
