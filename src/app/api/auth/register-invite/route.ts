import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';
import { users, publishers, waitlist } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, name, password } = body;

    // Validate required fields
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

    // Find and validate invite
    const [invite] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.inviteToken, token))
      .limit(1);

    if (!invite || invite.status !== 'approved') {
      return NextResponse.json(
        { error: 'Invalid or expired invite token' },
        { status: 400 }
      );
    }

    // Check if email already has an account
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, invite.email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create publisher for this user
    const publisherName = invite.companyName || 'My Company';
    const slug = publisherName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const [newPublisher] = await db
      .insert(publishers)
      .values({
        name: publisherName,
        slug,
        subscriptionTier: 'starter',
      })
      .returning({ id: publishers.id });

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: invite.email,
        passwordHash,
        name,
        publisherId: newPublisher.id,
        role: 'owner', // First user is owner
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        publisherId: users.publisherId,
      });

    // Mark waitlist entry as converted
    await db
      .update(waitlist)
      .set({
        status: 'converted',
        updatedAt: new Date(),
      })
      .where(eq(waitlist.id, invite.id));

    return NextResponse.json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error('Register invite error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
