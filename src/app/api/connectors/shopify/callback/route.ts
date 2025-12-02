import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectors } from '@/lib/db/schema';
import crypto from 'crypto';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || '';
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || '';

// Verify Shopify HMAC signature
function verifyHmac(query: URLSearchParams): boolean {
  const hmac = query.get('hmac');
  if (!hmac) return false;

  // Remove hmac from query params for verification
  const params = new URLSearchParams(query);
  params.delete('hmac');

  // Sort params and create message
  const sortedParams = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const generatedHmac = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(sortedParams)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(generatedHmac)
  );
}

// Handle OAuth callback from Shopify
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const shop = searchParams.get('shop');
    const state = searchParams.get('state');

    // Validate required params
    if (!code || !shop || !state) {
      return NextResponse.redirect(
        new URL('/connectors?error=missing_params', request.url)
      );
    }

    // Verify HMAC (skip in development if secret not set)
    if (SHOPIFY_API_SECRET && !verifyHmac(searchParams)) {
      return NextResponse.redirect(
        new URL('/connectors?error=invalid_signature', request.url)
      );
    }

    // Decode state to get publisherId
    let stateData: { publisherId: string; shop: string; nonce: string };
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    } catch {
      return NextResponse.redirect(
        new URL('/connectors?error=invalid_state', request.url)
      );
    }

    // Verify shop matches
    if (stateData.shop !== shop) {
      return NextResponse.redirect(
        new URL('/connectors?error=shop_mismatch', request.url)
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: SHOPIFY_API_KEY,
          client_secret: SHOPIFY_API_SECRET,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(
        new URL('/connectors?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get shop info
    const shopResponse = await fetch(
      `https://${shop}/admin/api/2024-01/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      }
    );

    let shopInfo = { name: shop.replace('.myshopify.com', '') };
    if (shopResponse.ok) {
      const shopData = await shopResponse.json();
      shopInfo = shopData.shop;
    }

    // Save connector to database
    const [connector] = await db
      .insert(connectors)
      .values({
        publisherId: stateData.publisherId,
        type: 'shopify',
        name: shopInfo.name || shop,
        config: {
          shop,
          shopName: shopInfo.name,
        },
        credentials: {
          accessToken, // In production, encrypt this
        },
        status: 'active',
        lastSyncAt: null,
      })
      .returning();

    // Redirect back to connectors page with success
    return NextResponse.redirect(
      new URL(`/connectors?connected=shopify&id=${connector.id}`, request.url)
    );
  } catch (error) {
    console.error('Shopify callback error:', error);
    return NextResponse.redirect(
      new URL('/connectors?error=callback_failed', request.url)
    );
  }
}
