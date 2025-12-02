import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users, publishers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      publisherId: string;
      publisherName: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    publisherId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    publisherId: string;
    publisherName: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as NextAuthOptions['adapter'],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (!user) {
          // For demo purposes, create a demo user if not found
          // In production, this would verify password hash
          return null;
        }

        // In production: verify password with bcrypt
        // const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        // if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          role: user.role || 'member',
          publisherId: user.publisherId || '',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.publisherId = user.publisherId;

        // Fetch publisher name
        if (user.publisherId) {
          const [publisher] = await db
            .select({ name: publishers.name })
            .from(publishers)
            .where(eq(publishers.id, user.publisherId))
            .limit(1);

          token.publisherName = publisher?.name || '';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.publisherId = token.publisherId;
        session.user.publisherName = token.publisherName;
      }
      return session;
    },
  },
};

// Helper to get session on server components/API routes
import { getServerSession as getNextAuthSession } from 'next-auth';

export async function getServerSession() {
  return getNextAuthSession(authOptions);
}

// Helper for API routes - returns session or throws 401
export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user?.publisherId) {
    throw new Error('Unauthorized');
  }

  return session;
}

// Demo mode helper - returns demo publisherId for testing without auth
// Using a fixed UUID for demo mode
const DEMO_PUBLISHER_ID = '00000000-0000-0000-0000-000000000001';

export function getDemoPublisherId() {
  return DEMO_PUBLISHER_ID;
}

// Check if running in demo mode (no real auth)
export function isDemoMode() {
  return process.env.DEMO_MODE === 'true';
}
