import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { publishers, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';

// PUT update organization settings
export async function PUT(request: NextRequest) {
  try {
    if (isDemoMode()) {
      // Simulate success in demo mode
      return NextResponse.json({ success: true });
    }

    const session = await getServerSession();
    if (!session?.user?.id || !session?.user?.publisherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission (owner or admin)
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user || !['owner', 'admin'].includes(user.role || '')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { name, website } = body as { name?: string; website?: string };

    // Validate
    if (name !== undefined && (typeof name !== 'string' || name.length < 1 || name.length > 255)) {
      return NextResponse.json({ error: 'Invalid organization name' }, { status: 400 });
    }

    if (website !== undefined && website !== '' && typeof website === 'string') {
      // Basic URL validation
      try {
        new URL(website);
      } catch {
        return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 });
      }
    }

    // Update publisher
    const updateData: { name?: string; website?: string | null; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (name !== undefined) updateData.name = name;
    if (website !== undefined) updateData.website = website || null;

    await db
      .update(publishers)
      .set(updateData)
      .where(eq(publishers.id, session.user.publisherId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update organization:', error);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}
