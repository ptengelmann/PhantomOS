import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, isDemoMode, getDemoPublisherId, canWrite } from '@/lib/auth';
import crypto from 'crypto';

// Shopify OAuth configuration
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || '';
const SHOPIFY_SCOPES = 'read_products,read_orders,read_customers';

// Generate a random nonce for CSRF protection
function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Initiate Shopify OAuth flow
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Require write access (owner/admin only)
    let publisherId: string;

    const session = await getServerSession();

    if (session?.user?.publisherId) {
      // User is logged in - always check RBAC regardless of demo mode
      if (!canWrite(session.user.role)) {
        return NextResponse.json({ error: 'Write access required' }, { status: 403 });
      }
      publisherId = session.user.publisherId;
    } else if (isDemoMode()) {
      // No session but demo mode - allow anonymous access
      publisherId = getDemoPublisherId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { shop } = body as { shop: string };

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop domain is required' },
        { status: 400 }
      );
    }

    // Sanitize and validate shop domain format
    let shopDomain = shop
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '') // Remove http:// or https://
      .replace(/\/$/, ''); // Remove trailing slash

    // Add .myshopify.com if not present
    if (!shopDomain.includes('.myshopify.com')) {
      shopDomain = `${shopDomain}.myshopify.com`;
    }

    if (!SHOPIFY_API_KEY) {
      return NextResponse.json(
        { error: 'Shopify API key not configured. Please set SHOPIFY_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    // Generate nonce and store in state (includes publisherId for callback)
    const nonce = generateNonce();
    const state = Buffer.from(JSON.stringify({
      nonce,
      publisherId,
      shop: shopDomain,
    })).toString('base64');

    // Build OAuth URL
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/connectors/shopify/callback`;
    const authUrl = new URL(`https://${shopDomain}/admin/oauth/authorize`);
    authUrl.searchParams.set('client_id', SHOPIFY_API_KEY);
    authUrl.searchParams.set('scope', SHOPIFY_SCOPES);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);

    return NextResponse.json({
      authUrl: authUrl.toString(),
      state,
    });
  } catch (error) {
    console.error('Shopify auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Shopify authentication' },
      { status: 500 }
    );
  }
}
