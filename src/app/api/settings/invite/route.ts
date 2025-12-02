import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { invitations, users } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';
import crypto from 'crypto';

// Generate a secure random token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create a new invitation
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Get session and verify admin role
    let publisherId: string;
    let inviterId: string | null = null;

    if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      const session = await getServerSession();
      if (!session?.user?.publisherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user has permission to invite (owner or admin)
      const userRole = session.user.role;
      if (!['owner', 'admin'].includes(userRole)) {
        return NextResponse.json(
          { error: 'Only admins can invite team members' },
          { status: 403 }
        );
      }

      publisherId = session.user.publisherId;
      inviterId = session.user.id;
    }

    const body = await request.json();
    const { email, name, role } = body as {
      email: string;
      name?: string;
      role: 'admin' | 'member' | 'analyst';
    };

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!role || !['admin', 'member', 'analyst'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role is required (admin, member, or analyst)' },
        { status: 400 }
      );
    }

    // Check if user already exists with this email in this publisher
    const [existingUser] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email.toLowerCase()), eq(users.publisherId, publisherId)))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists in your organization' },
        { status: 400 }
      );
    }

    // Check for pending invite with same email
    const [existingInvite] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.email, email.toLowerCase()),
          eq(invitations.publisherId, publisherId),
          eq(invitations.status, 'pending'),
          gt(invitations.expiresAt, new Date())
        )
      )
      .limit(1);

    if (existingInvite) {
      return NextResponse.json(
        { error: 'An active invitation already exists for this email' },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = generateToken();

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const [invitation] = await db
      .insert(invitations)
      .values({
        token,
        email: email.toLowerCase(),
        name: name || null,
        role,
        publisherId,
        invitedBy: inviterId,
        status: 'pending',
        expiresAt,
      })
      .returning();

    // Generate invite URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/invite?token=${token}`;

    // In production, you would send an email here using Resend, SendGrid, etc.
    // For now, we'll just return the invite URL
    console.log(`Invite URL for ${email}: ${inviteUrl}`);

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        inviteUrl, // In production, remove this and only send via email
      },
    });
  } catch (error) {
    console.error('Create invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

// Get all invitations for the publisher
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Get session
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

    // Get all invitations for this publisher
    const allInvitations = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        name: invitations.name,
        role: invitations.role,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
        createdAt: invitations.createdAt,
      })
      .from(invitations)
      .where(eq(invitations.publisherId, publisherId))
      .orderBy(invitations.createdAt);

    return NextResponse.json({ invitations: allInvitations });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

// Revoke an invitation
export async function DELETE(request: NextRequest) {
  try {
    // SECURITY: Get session and verify admin role
    let publisherId: string;

    if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      const session = await getServerSession();
      if (!session?.user?.publisherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userRole = session.user.role;
      if (!['owner', 'admin'].includes(userRole)) {
        return NextResponse.json(
          { error: 'Only admins can revoke invitations' },
          { status: 403 }
        );
      }

      publisherId = session.user.publisherId;
    }

    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('id');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    // Update invitation status to revoked (only if it belongs to this publisher)
    const [updated] = await db
      .update(invitations)
      .set({ status: 'revoked' })
      .where(
        and(
          eq(invitations.id, invitationId),
          eq(invitations.publisherId, publisherId),
          eq(invitations.status, 'pending')
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Invitation not found or already processed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Revoke invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke invitation' },
      { status: 500 }
    );
  }
}
