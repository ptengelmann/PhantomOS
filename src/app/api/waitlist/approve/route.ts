import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { waitlist } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import crypto from 'crypto';

// POST - Approve waitlist entry and generate invite token
export async function POST(request: NextRequest) {
  try {
    // Check authentication - require admin or owner role
    const session = await requireAuth();

    if (session.user.role !== 'owner' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Waitlist entry ID is required' },
        { status: 400 }
      );
    }

    // Check if entry exists
    const [entry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.id, id))
      .limit(1);

    if (!entry) {
      return NextResponse.json(
        { error: 'Waitlist entry not found' },
        { status: 404 }
      );
    }

    if (entry.status !== 'pending') {
      return NextResponse.json(
        { error: 'Entry has already been processed' },
        { status: 400 }
      );
    }

    // Generate secure invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    // Update entry
    await db
      .update(waitlist)
      .set({
        status: 'approved',
        inviteToken,
        approvedAt: new Date(),
        approvedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(waitlist.id, id));

    // TODO: When you integrate Resend, send email here
    // await sendInviteEmail(entry.email, inviteToken);

    return NextResponse.json({
      success: true,
      message: 'Waitlist entry approved',
      inviteToken,
      inviteLink: `/register/${inviteToken}`,
    });
  } catch (error) {
    console.error('Approve waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to approve entry' },
      { status: 500 }
    );
  }
}
