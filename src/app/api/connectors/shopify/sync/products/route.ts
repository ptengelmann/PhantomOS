import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectors, products } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId, canWrite } from '@/lib/auth';

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string;
  variants: Array<{
    id: number;
    sku: string;
    price: string;
  }>;
  images: Array<{
    src: string;
  }>;
}

// Sync products from Shopify
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Require write access (owner/admin only)
    let publisherId: string;

    if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      const session = await getServerSession();
      if (!session?.user?.publisherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (!canWrite(session.user.role)) {
        return NextResponse.json({ error: 'Write access required' }, { status: 403 });
      }
      publisherId = session.user.publisherId;
    }

    const body = await request.json();
    const { connectorId } = body as { connectorId: string };

    if (!connectorId) {
      return NextResponse.json(
        { error: 'Connector ID is required' },
        { status: 400 }
      );
    }

    // Get connector and verify ownership
    const [connector] = await db
      .select()
      .from(connectors)
      .where(
        and(
          eq(connectors.id, connectorId),
          eq(connectors.publisherId, publisherId),
          eq(connectors.type, 'shopify')
        )
      )
      .limit(1);

    if (!connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      );
    }

    const credentials = connector.credentials as { accessToken: string };
    const config = connector.config as { shop: string };

    if (!credentials?.accessToken || !config?.shop) {
      return NextResponse.json(
        { error: 'Invalid connector configuration' },
        { status: 400 }
      );
    }

    // Fetch products from Shopify
    let allProducts: ShopifyProduct[] = [];
    let nextPageUrl: string | null = `https://${config.shop}/admin/api/2024-01/products.json?limit=250`;

    while (nextPageUrl) {
      const response: Response = await fetch(nextPageUrl, {
        headers: {
          'X-Shopify-Access-Token': credentials.accessToken,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Shopify API error:', errorText);
        return NextResponse.json(
          { error: 'Failed to fetch products from Shopify' },
          { status: 502 }
        );
      }

      const data = await response.json();
      allProducts = [...allProducts, ...data.products];

      // Check for next page (pagination)
      const linkHeader = response.headers.get('Link');
      if (linkHeader) {
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        nextPageUrl = nextMatch ? nextMatch[1] : null;
      } else {
        nextPageUrl = null;
      }
    }

    // Map categories
    const categoryMap: Record<string, 'apparel' | 'collectibles' | 'accessories' | 'home' | 'digital' | 'other'> = {
      clothing: 'apparel',
      apparel: 'apparel',
      't-shirts': 'apparel',
      shirts: 'apparel',
      hoodies: 'apparel',
      accessories: 'accessories',
      jewelry: 'accessories',
      bags: 'accessories',
      collectibles: 'collectibles',
      figures: 'collectibles',
      toys: 'collectibles',
      home: 'home',
      homeware: 'home',
      mugs: 'home',
      digital: 'digital',
      downloads: 'digital',
    };

    // Insert/update products
    const insertedProducts = [];
    const errors: Array<{ product: string; error: string }> = [];

    for (const shopifyProduct of allProducts) {
      try {
        const variant = shopifyProduct.variants[0];
        const normalizedType = shopifyProduct.product_type?.toLowerCase() || '';
        const category = categoryMap[normalizedType] || 'other';
        const tags = shopifyProduct.tags
          ? shopifyProduct.tags.split(',').map((t) => t.trim())
          : [];

        // Check if product exists
        const [existing] = await db
          .select({ id: products.id })
          .from(products)
          .where(
            and(
              eq(products.connectorId, connectorId),
              eq(products.externalId, String(shopifyProduct.id))
            )
          )
          .limit(1);

        if (existing) {
          // Update existing product
          await db
            .update(products)
            .set({
              name: shopifyProduct.title,
              description: shopifyProduct.body_html?.replace(/<[^>]*>/g, '') || null,
              category,
              price: variant?.price || null,
              sku: variant?.sku || null,
              vendor: shopifyProduct.vendor || null,
              imageUrl: shopifyProduct.images[0]?.src || null,
              tags,
              updatedAt: new Date(),
            })
            .where(eq(products.id, existing.id));
          insertedProducts.push(existing);
        } else {
          // Insert new product
          const [inserted] = await db
            .insert(products)
            .values({
              publisherId,
              connectorId,
              externalId: String(shopifyProduct.id),
              name: shopifyProduct.title,
              description: shopifyProduct.body_html?.replace(/<[^>]*>/g, '') || null,
              category,
              price: variant?.price || null,
              sku: variant?.sku || null,
              vendor: shopifyProduct.vendor || null,
              imageUrl: shopifyProduct.images[0]?.src || null,
              tags,
              mappingStatus: 'unmapped',
              metadata: {
                shopifyId: shopifyProduct.id,
                productType: shopifyProduct.product_type,
                variantCount: shopifyProduct.variants.length,
              },
            })
            .returning();
          insertedProducts.push(inserted);
        }
      } catch (err) {
        errors.push({
          product: shopifyProduct.title,
          error: String(err),
        });
      }
    }

    // Update connector last sync time
    await db
      .update(connectors)
      .set({ lastSyncAt: new Date(), status: 'active' })
      .where(eq(connectors.id, connectorId));

    return NextResponse.json({
      success: true,
      synced: insertedProducts.length,
      total: allProducts.length,
      errors,
    });
  } catch (error) {
    console.error('Product sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync products' },
      { status: 500 }
    );
  }
}
