import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const DEMO_PUBLISHER_ID = '00000000-0000-0000-0000-000000000001';

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string;
  variants: Array<{ id: number; sku: string; price: string }>;
  images: Array<{ src: string }>;
}

async function syncProducts() {
  // Get connector
  const connectors = await sql`
    SELECT id, config, credentials
    FROM connectors
    WHERE type = 'shopify' AND publisher_id = ${DEMO_PUBLISHER_ID}
    LIMIT 1
  `;

  if (connectors.length === 0) {
    console.log('No Shopify connector found');
    return;
  }

  const connector = connectors[0];
  const config = connector.config as { shop: string };
  const credentials = connector.credentials as { accessToken: string };
  const connectorId = connector.id;

  console.log('Shop:', config.shop);
  console.log('Connector ID:', connectorId);

  // Fetch products from Shopify
  const response = await fetch(
    `https://${config.shop}/admin/api/2024-01/products.json?limit=250`,
    {
      headers: { 'X-Shopify-Access-Token': credentials.accessToken },
    }
  );

  const data = await response.json();
  const products: ShopifyProduct[] = data.products || [];
  console.log('Products from Shopify:', products.length);

  // Category mapping
  const categoryMap: Record<string, string> = {
    clothing: 'apparel',
    apparel: 'apparel',
    accessories: 'accessories',
    collectibles: 'collectibles',
    home: 'home',
    digital: 'digital',
  };

  // Insert products
  let inserted = 0;
  let errors = 0;

  for (const product of products) {
    try {
      const variant = product.variants[0];
      const normalizedType = product.product_type?.toLowerCase() || '';
      const category = categoryMap[normalizedType] || 'other';
      const tags = product.tags ? product.tags.split(',').map(t => t.trim()) : [];

      await sql`
        INSERT INTO products (
          publisher_id, connector_id, external_id, name, description,
          category, price, sku, vendor, image_url, tags, mapping_status
        )
        VALUES (
          ${DEMO_PUBLISHER_ID},
          ${connectorId},
          ${String(product.id)},
          ${product.title},
          ${product.body_html?.replace(/<[^>]*>/g, '') || null},
          ${category},
          ${variant?.price || null},
          ${variant?.sku || null},
          ${product.vendor || null},
          ${product.images[0]?.src || null},
          ${JSON.stringify(tags)},
          'unmapped'
        )
        ON CONFLICT (connector_id, external_id)
        WHERE connector_id IS NOT NULL AND external_id IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          price = EXCLUDED.price,
          sku = EXCLUDED.sku,
          vendor = EXCLUDED.vendor,
          image_url = EXCLUDED.image_url,
          tags = EXCLUDED.tags,
          updated_at = NOW()
      `;
      inserted++;
      console.log(`  Inserted: ${product.title}`);
    } catch (err) {
      errors++;
      console.error(`  Error: ${product.title}:`, err);
    }
  }

  console.log('\n---');
  console.log(`Inserted: ${inserted}`);
  console.log(`Errors: ${errors}`);

  // Verify
  const count = await sql`SELECT COUNT(*) as count FROM products WHERE publisher_id = ${DEMO_PUBLISHER_ID}`;
  console.log(`Products in DB: ${count[0].count}`);
}

syncProducts();
