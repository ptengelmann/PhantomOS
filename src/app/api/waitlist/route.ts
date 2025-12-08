import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { waitlist } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// POST - Add to waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, companyName, companyWebsite, revenueRange, primaryChannel } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await db
      .select({ id: waitlist.id })
      .from(waitlist)
      .where(eq(waitlist.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      );
    }

    // Insert into waitlist
    const [entry] = await db
      .insert(waitlist)
      .values({
        email: email.toLowerCase(),
        companyName: companyName || null,
        companyWebsite: companyWebsite || null,
        revenueRange: revenueRange || null,
        primaryChannel: primaryChannel || null,
        status: 'pending',
      })
      .returning({ id: waitlist.id });

    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist',
      id: entry.id,
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}

// GET - List waitlist entries (admin only - for now just check for a secret)
export async function GET(request: NextRequest) {
  try {
    // Simple admin check via query param (you can make this more secure later)
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('key');

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const entries = await db
      .select()
      .from(waitlist)
      .orderBy(waitlist.createdAt);

    return NextResponse.json({
      entries,
      total: entries.length,
      pending: entries.filter(e => e.status === 'pending').length,
      approved: entries.filter(e => e.status === 'approved').length,
    });
  } catch (error) {
    console.error('Waitlist fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}
