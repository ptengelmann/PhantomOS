import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { waitlist } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth';

// GET - List all waitlist entries (admin only)
export async function GET() {
  try {
    // Check authentication - require admin or owner role
    let session;
    try {
      session = await requireAuth();
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'owner' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const entries = await db
      .select()
      .from(waitlist)
      .orderBy(waitlist.createdAt);

    return NextResponse.json({
      entries,
      stats: {
        total: entries.length,
        pending: entries.filter(e => e.status === 'pending').length,
        approved: entries.filter(e => e.status === 'approved').length,
        rejected: entries.filter(e => e.status === 'rejected').length,
        converted: entries.filter(e => e.status === 'converted').length,
      },
    });
  } catch (error) {
    console.error('Waitlist admin fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}
