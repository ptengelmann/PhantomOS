import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { waitlist } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, key } = body;

    // Validate admin key
    const adminKey = process.env.ADMIN_SECRET_KEY;
    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    if (!['pending', 'approved', 'rejected', 'converted'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update the entry
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'approved') {
      updateData.approvedAt = new Date();
      updateData.approvedBy = 'admin';
    }

    const [updated] = await db
      .update(waitlist)
      .set(updateData)
      .where(eq(waitlist.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry: updated });
  } catch (error) {
    console.error('Failed to update waitlist entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}
