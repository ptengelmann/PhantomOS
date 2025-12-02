import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';
import { users, publishers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const DEMO_PUBLISHER_ID = '00000000-0000-0000-0000-000000000001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, publisherName, joinExisting } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    let publisherId: string;

    if (joinExisting) {
      // Join existing demo publisher
      publisherId = DEMO_PUBLISHER_ID;

      // Update publisher name if provided and it's still "Demo Publisher"
      if (publisherName) {
        const [publisher] = await db
          .select()
          .from(publishers)
          .where(eq(publishers.id, DEMO_PUBLISHER_ID))
          .limit(1);

        if (publisher && publisher.name === 'Demo Publisher') {
          await db
            .update(publishers)
            .set({
              name: publisherName,
              slug: publisherName.toLowerCase().replace(/\s+/g, '-'),
              updatedAt: new Date()
            })
            .where(eq(publishers.id, DEMO_PUBLISHER_ID));
        }
      }
    } else {
      // Create new publisher
      const slug = publisherName.toLowerCase().replace(/\s+/g, '-');
      const [newPublisher] = await db
        .insert(publishers)
        .values({
          name: publisherName,
          slug,
          subscriptionTier: 'starter',
        })
        .returning({ id: publishers.id });

      publisherId = newPublisher.id;
    }

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
        publisherId,
        role: 'owner', // First user is owner
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        publisherId: users.publisherId,
      });

    return NextResponse.json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
