import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectors, products } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { resolvePublisherWithWriteAccess } from '@/lib/auth';
import { decryptCredentials } from '@/lib/crypto';
import { audit } from '@/lib/audit';
import { rateLimit } from '@/lib/rate-limit';

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

// Category mapping for Shopify product types
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

// Batch size for database operations
const BATCH_SIZE = 50;

// Sync products from Shopify
export async function POST(request: NextRequest) {
  try {
    // Rate limit sync operations
    const rateLimitResponse = await rateLimit('write');
    if (rateLimitResponse) return rateLimitResponse;

    // SECURITY: Session-first pattern with write access check
    const resolved = await resolvePublisherWithWriteAccess();
    if (!resolved) {
      return NextResponse.json({ error: 'Write access required' }, { status: 403 });
    }
    const { publisherId, session } = resolved;

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

    // Decrypt credentials (handles both encrypted and legacy plain data)
    const credentials = decryptCredentials<{ accessToken: string }>(connector.credentials);
    const config = connector.config as { shop: string };

    if (!credentials?.accessToken || !config?.shop) {
      return NextResponse.json(
        { error: 'Invalid connector configuration' },
        { status: 400 }
      );
    }

    // Fetch products from Shopify (with pagination)
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

    // Transform Shopify products to our format
    const transformedProducts = allProducts.map((shopifyProduct) => {
      const variant = shopifyProduct.variants[0];
      const normalizedType = shopifyProduct.product_type?.toLowerCase() || '';
      const category = categoryMap[normalizedType] || 'other';
      const tags = shopifyProduct.tags
        ? shopifyProduct.tags.split(',').map((t) => t.trim())
        : [];

      return {
        externalId: String(shopifyProduct.id),
        name: shopifyProduct.title,
        description: shopifyProduct.body_html?.replace(/<[^>]*>/g, '') || null,
        category,
        price: variant?.price || null,
        sku: variant?.sku || null,
        vendor: shopifyProduct.vendor || null,
        imageUrl: shopifyProduct.images[0]?.src || null,
        tags,
        metadata: {
          shopifyId: shopifyProduct.id,
          productType: shopifyProduct.product_type,
          variantCount: shopifyProduct.variants.length,
        },
      };
    });

    // Get existing products for this connector (batch lookup)
    const externalIds = transformedProducts.map((p) => p.externalId);
    const existingProducts = await db
      .select({ id: products.id, externalId: products.externalId })
      .from(products)
      .where(
        and(
          eq(products.connectorId, connectorId),
          inArray(products.externalId, externalIds)
        )
      );

    const existingMap = new Map(
      existingProducts.map((p) => [p.externalId, p.id])
    );

    // Separate into updates and inserts
    const toUpdate: Array<{ id: string; data: typeof transformedProducts[0] }> = [];
    const toInsert: typeof transformedProducts = [];

    for (const product of transformedProducts) {
      const existingId = existingMap.get(product.externalId);
      if (existingId) {
        toUpdate.push({ id: existingId, data: product });
      } else {
        toInsert.push(product);
      }
    }

    let insertedCount = 0;
    let updatedCount = 0;
    const errors: Array<{ product: string; error: string }> = [];

    // Batch insert new products
    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE);
      try {
        await db.insert(products).values(
          batch.map((p) => ({
            publisherId,
            connectorId,
            externalId: p.externalId,
            name: p.name,
            description: p.description,
            category: p.category,
            price: p.price,
            sku: p.sku,
            vendor: p.vendor,
            imageUrl: p.imageUrl,
            tags: p.tags,
            mappingStatus: 'unmapped' as const,
            metadata: p.metadata,
          }))
        );
        insertedCount += batch.length;
      } catch (err) {
        errors.push({
          product: `Batch ${i / BATCH_SIZE + 1}`,
          error: String(err),
        });
      }
    }

    // Batch update existing products
    for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
      const batch = toUpdate.slice(i, i + BATCH_SIZE);
      try {
        // For updates, we need to do them one by one due to Drizzle limitations
        // But we process them in parallel within the batch
        await Promise.all(
          batch.map((item) =>
            db
              .update(products)
              .set({
                name: item.data.name,
                description: item.data.description,
                category: item.data.category,
                price: item.data.price,
                sku: item.data.sku,
                vendor: item.data.vendor,
                imageUrl: item.data.imageUrl,
                tags: item.data.tags,
                updatedAt: new Date(),
              })
              .where(eq(products.id, item.id))
          )
        );
        updatedCount += batch.length;
      } catch (err) {
        errors.push({
          product: `Update batch ${i / BATCH_SIZE + 1}`,
          error: String(err),
        });
      }
    }

    // Update connector last sync time
    await db
      .update(connectors)
      .set({ lastSyncAt: new Date(), status: 'active' })
      .where(eq(connectors.id, connectorId));

    // Audit log the sync
    await audit.connectorSynced(
      session,
      connectorId,
      connector.name,
      insertedCount + updatedCount
    );

    return NextResponse.json({
      success: true,
      synced: insertedCount + updatedCount,
      inserted: insertedCount,
      updated: updatedCount,
      total: allProducts.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Product sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync products' },
      { status: 500 }
    );
  }
}
