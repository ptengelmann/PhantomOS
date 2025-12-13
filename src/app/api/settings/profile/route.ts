import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, publishers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';

// GET current user profile
export async function GET() {
  try {
    // Check session first - logged in users always get real data
    const session = await getServerSession();

    if (session?.user?.id) {
      // User is logged in - return their real profile
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          avatar: users.avatar,
          role: users.role,
          publisherId: users.publisherId,
        })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      let publisher = null;
      if (user.publisherId) {
        const [pub] = await db
          .select({
            id: publishers.id,
            name: publishers.name,
            website: publishers.website,
            subscriptionTier: publishers.subscriptionTier,
          })
          .from(publishers)
          .where(eq(publishers.id, user.publisherId))
          .limit(1);
        publisher = pub;
      }

      return NextResponse.json({ user, publisher });
    }

    // No session - fall back to demo mode if enabled
    if (isDemoMode()) {
      return NextResponse.json({
        user: {
          id: 'demo-user',
          email: 'demo@phantomos.com',
          name: 'Demo User',
          role: 'owner',
        },
        publisher: {
          id: getDemoPublisherId(),
          name: 'Demo Publisher',
          website: 'https://demo.phantomos.com',
        },
      });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    console.error('Failed to get profile:', error);
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    // Check session first - logged in users always update real data
    const session = await getServerSession();

    if (session?.user?.id) {
      // User is logged in - update their real profile
      const body = await request.json();
      const { name, avatar } = body as { name?: string; avatar?: string };

      // Validate
      if (name !== undefined && (typeof name !== 'string' || name.length > 255)) {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
      }

      // Update user
      const updateData: { name?: string; avatar?: string | null; updatedAt: Date } = {
        updatedAt: new Date(),
      };
      if (name !== undefined) updateData.name = name;
      if (avatar !== undefined) updateData.avatar = avatar;

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, session.user.id));

      return NextResponse.json({ success: true });
    }

    // No session - simulate success in demo mode
    if (isDemoMode()) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
