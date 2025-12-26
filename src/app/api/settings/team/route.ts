import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, invitations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { resolvePublisher } from '@/lib/auth';

// GET - Get team members and pending invitations
export async function GET() {
  try {
    // SECURITY: Session-first pattern - always check auth before demo mode
    const resolved = await resolvePublisher();
    if (!resolved) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { publisherId } = resolved;

    // Get team members from users table
    const teamMembers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.publisherId, publisherId));

    // Get pending invitations
    const pendingInvites = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        name: invitations.name,
        role: invitations.role,
        expiresAt: invitations.expiresAt,
        createdAt: invitations.createdAt,
      })
      .from(invitations)
      .where(
        and(
          eq(invitations.publisherId, publisherId),
          eq(invitations.status, 'pending')
        )
      );

    return NextResponse.json({
      members: teamMembers.map(m => ({
        id: m.id,
        name: m.name || 'Unknown',
        email: m.email,
        role: m.role || 'member',
        avatar: m.avatar,
      })),
      pendingInvites: pendingInvites.map(i => ({
        id: i.id,
        email: i.email,
        name: i.name,
        role: i.role,
        expiresAt: i.expiresAt?.toISOString().split('T')[0],
      })),
    });
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    );
  }
}
