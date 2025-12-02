import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectors, products, sales } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';

// DELETE - Disconnect/delete a connector and its associated data
export async function DELETE(
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

    // Verify connector belongs to publisher
    const [connector] = await db
      .select({ id: connectors.id })
      .from(connectors)
      .where(and(eq(connectors.id, connectorId), eq(connectors.publisherId, publisherId)))
      .limit(1);

    if (!connector) {
      return NextResponse.json({ error: 'Connector not found' }, { status: 404 });
    }

    // Delete sales from this connector
    await db
      .delete(sales)
      .where(eq(sales.connectorId, connectorId));

    // Delete products from this connector
    await db
      .delete(products)
      .where(eq(products.connectorId, connectorId));

    // Delete the connector
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
