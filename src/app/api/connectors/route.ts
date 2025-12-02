import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';

// Get all connectors for the current publisher
export async function GET() {
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

    const publisherConnectors = await db
      .select({
        id: connectors.id,
        name: connectors.name,
        type: connectors.type,
        status: connectors.status,
        lastSyncAt: connectors.lastSyncAt,
        config: connectors.config,
        createdAt: connectors.createdAt,
      })
      .from(connectors)
      .where(eq(connectors.publisherId, publisherId));

    return NextResponse.json({
      connectors: publisherConnectors,
    });
  } catch (error) {
    console.error('Failed to load connectors:', error);
    return NextResponse.json(
      { error: 'Failed to load connectors' },
      { status: 500 }
    );
  }
}
