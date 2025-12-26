import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Initialize Redis client - uses environment variables
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

function getRateLimiter() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Rate limiting disabled if Redis not configured
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds default
      analytics: true,
    });
  }

  return ratelimit;
}

// Different rate limit configurations
export const rateLimitConfigs = {
  // Strict for AI endpoints (expensive operations)
  ai: {
    requests: 5,
    window: '60 s', // 5 requests per minute
  },
  // Standard for write operations
  write: {
    requests: 20,
    window: '60 s', // 20 requests per minute
  },
  // Lenient for read operations
  read: {
    requests: 60,
    window: '60 s', // 60 requests per minute
  },
  // Very strict for auth attempts
  auth: {
    requests: 5,
    window: '300 s', // 5 attempts per 5 minutes
  },
  // Public endpoints (waitlist, contact)
  public: {
    requests: 3,
    window: '60 s', // 3 requests per minute
  },
} as const;

type RateLimitType = keyof typeof rateLimitConfigs;

// Create a rate limiter for a specific type
function createTypedRateLimiter(type: RateLimitType): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  const config = rateLimitConfigs[type];
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: `ratelimit:${type}`,
  });
}

// Cache of typed rate limiters
const rateLimiters: Partial<Record<RateLimitType, Ratelimit>> = {};

function getTypedRateLimiter(type: RateLimitType): Ratelimit | null {
  if (!rateLimiters[type]) {
    const limiter = createTypedRateLimiter(type);
    if (limiter) {
      rateLimiters[type] = limiter;
    }
  }
  return rateLimiters[type] || null;
}

// Get identifier from request (IP address or user ID)
async function getIdentifier(userId?: string): Promise<string> {
  if (userId) {
    return `user:${userId}`;
  }

  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');

  // Get IP from headers (Vercel/Cloudflare)
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'anonymous';
  return `ip:${ip}`;
}

// Rate limit check function
export async function checkRateLimit(
  type: RateLimitType = 'read',
  userId?: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = getTypedRateLimiter(type);

  if (!limiter) {
    // Rate limiting disabled - allow all
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  const identifier = await getIdentifier(userId);
  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

// Middleware helper - returns error response if rate limited
export async function withRateLimit(
  type: RateLimitType = 'read',
  userId?: string
): Promise<NextResponse | null> {
  const result = await checkRateLimit(type, userId);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Please slow down and try again later',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null; // Not rate limited
}

// Simple wrapper for API routes
export async function rateLimit(type: RateLimitType = 'read', userId?: string) {
  return withRateLimit(type, userId);
}
