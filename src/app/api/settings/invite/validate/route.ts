import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { invitations, users, publishers } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

// Validate an invitation token (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find the invitation
    const [invitation] = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        name: invitations.name,
        role: invitations.role,
        publisherId: invitations.publisherId,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
      })
      .from(invitations)
      .where(eq(invitations.token, token))
      .limit(1);

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      // Mark as expired
      await db
        .update(invitations)
        .set({ status: 'expired' })
        .where(eq(invitations.id, invitation.id));

      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    // Check if already used
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: `Invitation has already been ${invitation.status}` },
        { status: 410 }
      );
    }

    // Get publisher info
    const [publisher] = await db
      .select({ name: publishers.name })
      .from(publishers)
      .where(eq(publishers.id, invitation.publisherId))
      .limit(1);

    return NextResponse.json({
      valid: true,
      invitation: {
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        publisherName: publisher?.name || 'Unknown Organization',
      },
    });
  } catch (error) {
    console.error('Validate invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate invitation' },
      { status: 500 }
    );
  }
}

// Redeem an invitation (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, name, password } = body as {
      token: string;
      name: string;
      password: string;
    };

    if (!token || !name || !password) {
      return NextResponse.json(
        { error: 'Token, name, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Find the invitation
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.token, token),
          eq(invitations.status, 'pending'),
          gt(invitations.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, invitation.email))
      .limit(1);

    if (existingUser) {
      // User exists - update their publisherId and role if different publisher
      if (existingUser.publisherId !== invitation.publisherId) {
        // For now, don't allow users to belong to multiple publishers
        return NextResponse.json(
          { error: 'This email is already registered with another organization' },
          { status: 400 }
        );
      }

      // Mark invitation as accepted
      await db
        .update(invitations)
        .set({ status: 'accepted', acceptedAt: new Date() })
        .where(eq(invitations.id, invitation.id));

      return NextResponse.json({
        success: true,
        message: 'You are already a member of this organization',
        userId: existingUser.id,
      });
    }

    // Create new user
    // In production, hash the password with bcrypt
    // const passwordHash = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        email: invitation.email,
        name,
        publisherId: invitation.publisherId,
        role: invitation.role,
        // passwordHash, // Add this field to schema in production
      })
      .returning();

    // Mark invitation as accepted
    await db
      .update(invitations)
      .set({ status: 'accepted', acceptedAt: new Date() })
      .where(eq(invitations.id, invitation.id));

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      userId: newUser.id,
    });
  } catch (error) {
    console.error('Redeem invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to redeem invitation' },
      { status: 500 }
    );
  }
}
