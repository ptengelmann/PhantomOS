import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ipAssets, gameIps } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId, canWrite } from '@/lib/auth';

// GET - List all IP assets grouped by Game IP
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

    // Get all game IPs with their assets
    const gameIpsWithAssets = await db
      .select({
        gameIp: {
          id: gameIps.id,
          name: gameIps.name,
          slug: gameIps.slug,
          coverImage: gameIps.coverImage,
        },
        asset: {
          id: ipAssets.id,
          name: ipAssets.name,
          assetType: ipAssets.assetType,
          imageUrl: ipAssets.imageUrl,
        },
      })
      .from(gameIps)
      .leftJoin(ipAssets, eq(ipAssets.gameIpId, gameIps.id))
      .where(eq(gameIps.publisherId, publisherId))
      .orderBy(gameIps.name, ipAssets.name);

    // Group assets by game IP
    const grouped = gameIpsWithAssets.reduce((acc, row) => {
      const gameIpId = row.gameIp.id;
      if (!acc[gameIpId]) {
        acc[gameIpId] = {
          ...row.gameIp,
          assets: [],
        };
      }
      if (row.asset?.id) {
        acc[gameIpId].assets.push(row.asset);
      }
      return acc;
    }, {} as Record<string, { id: string; name: string; slug: string; coverImage: string | null; assets: Array<{ id: string; name: string; assetType: string; imageUrl: string | null }> }>);

    return NextResponse.json({
      gameIps: Object.values(grouped),
    });
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

// POST - Create a new IP asset (and optionally game IP)
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Require write access (owner/admin only)
    let publisherId: string;

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

    const body = await request.json();
    const { gameIpId, gameIpName, assetName, assetType = 'character' } = body;

    let targetGameIpId = gameIpId;

    // Create new game IP if needed
    if (!gameIpId && gameIpName) {
      const slug = gameIpName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const [newGameIp] = await db
        .insert(gameIps)
        .values({
          publisherId,
          name: gameIpName,
          slug,
        })
        .returning();
      targetGameIpId = newGameIp.id;
    }

    if (!targetGameIpId) {
      return NextResponse.json(
        { error: 'Game IP is required' },
        { status: 400 }
      );
    }

    if (!assetName) {
      return NextResponse.json(
        { error: 'Asset name is required' },
        { status: 400 }
      );
    }

    // Create the asset
    const [newAsset] = await db
      .insert(ipAssets)
      .values({
        gameIpId: targetGameIpId,
        name: assetName,
        assetType: assetType as 'character' | 'logo' | 'scene' | 'item' | 'theme' | 'other',
      })
      .returning();

    return NextResponse.json({
      asset: newAsset,
      gameIpId: targetGameIpId,
    });
  } catch (error) {
    console.error('Failed to create asset:', error);
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}
