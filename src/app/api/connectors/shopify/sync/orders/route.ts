import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectors, products, sales } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId, canWrite } from '@/lib/auth';

interface ShopifyOrder {
  id: number;
  name: string;
  created_at: string;
  financial_status: string;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  currency: string;
  billing_address?: {
    country: string;
    country_code: string;
  };
  shipping_address?: {
    country: string;
    country_code: string;
  };
  source_name: string;
  line_items: Array<{
    id: number;
    product_id: number;
    variant_id: number;
    title: string;
    quantity: number;
    price: string;
    sku: string;
  }>;
}

// Sync orders from Shopify
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
    const { connectorId, since } = body as {
      connectorId: string;
      since?: string; // ISO date string for incremental sync
    };

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

    // Build products lookup map
    const publisherProducts = await db
      .select({ id: products.id, externalId: products.externalId })
      .from(products)
      .where(eq(products.connectorId, connectorId));

    const productIdMap = new Map(
      publisherProducts.map((p) => [p.externalId, p.id])
    );

    // Fetch orders from Shopify
    let allOrders: ShopifyOrder[] = [];
    let baseUrl = `https://${config.shop}/admin/api/2024-01/orders.json?status=any&limit=250`;

    // Add date filter for incremental sync
    if (since) {
      baseUrl += `&created_at_min=${since}`;
    }

    let nextPageUrl: string | null = baseUrl;

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
          { error: 'Failed to fetch orders from Shopify' },
          { status: 502 }
        );
      }

      const data = await response.json();
      allOrders = [...allOrders, ...data.orders];

      // Check for next page (pagination)
      const linkHeader = response.headers.get('Link');
      if (linkHeader) {
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        nextPageUrl = nextMatch ? nextMatch[1] : null;
      } else {
        nextPageUrl = null;
      }
    }

    // Insert sales records
    const insertedSales = [];
    const skippedProducts: string[] = [];
    const errors: Array<{ order: string; error: string }> = [];

    for (const order of allOrders) {
      // Skip cancelled/refunded orders
      if (order.financial_status === 'refunded' || order.financial_status === 'voided') {
        continue;
      }

      for (const lineItem of order.line_items) {
        try {
          // Find matching product
          const productId = productIdMap.get(String(lineItem.product_id));

          if (!productId) {
            if (!skippedProducts.includes(lineItem.title)) {
              skippedProducts.push(lineItem.title);
            }
            continue;
          }

          const region = order.shipping_address?.country ||
            order.billing_address?.country ||
            'Unknown';

          const [inserted] = await db
            .insert(sales)
            .values({
              publisherId,
              productId,
              connectorId,
              externalOrderId: `${order.id}-${lineItem.id}`,
              quantity: lineItem.quantity,
              revenue: (parseFloat(lineItem.price) * lineItem.quantity).toString(),
              currency: order.currency,
              region,
              channel: order.source_name || 'Online Store',
              orderDate: new Date(order.created_at),
              metadata: {
                shopifyOrderId: order.id,
                shopifyLineItemId: lineItem.id,
                orderName: order.name,
                financialStatus: order.financial_status,
              },
            })
            .onConflictDoNothing() // Skip duplicate orders
            .returning();

          if (inserted) {
            insertedSales.push(inserted);
          }
        } catch (err) {
          errors.push({
            order: order.name,
            error: String(err),
          });
        }
      }
    }

    // Update product revenue totals (aggregate sales)
    // This would be done in a background job in production

    // Update connector last sync time
    await db
      .update(connectors)
      .set({ lastSyncAt: new Date(), status: 'active' })
      .where(eq(connectors.id, connectorId));

    return NextResponse.json({
      success: true,
      synced: insertedSales.length,
      totalOrders: allOrders.length,
      skippedProducts: skippedProducts.length,
      unmatchedProducts: skippedProducts.slice(0, 10),
      errors,
    });
  } catch (error) {
    console.error('Order sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync orders' },
      { status: 500 }
    );
  }
}
