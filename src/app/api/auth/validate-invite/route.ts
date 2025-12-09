import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { waitlist } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Validate invite token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find waitlist entry with this token
    const [entry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.inviteToken, token))
      .limit(1);

    if (!entry) {
      return NextResponse.json(
        { valid: false, error: 'Invalid invite token' },
        { status: 404 }
      );
    }

    // Check if token is still valid
    if (entry.status !== 'approved') {
      return NextResponse.json(
        { valid: false, error: 'This invite has already been used or is no longer valid' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: entry.email,
      companyName: entry.companyName,
    });
  } catch (error) {
    console.error('Validate invite error:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate invite' },
      { status: 500 }
    );
  }
}
