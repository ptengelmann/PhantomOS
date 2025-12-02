import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function testShopify() {
  // Get the connector to get credentials
  const connectors = await sql`
    SELECT id, config, credentials
    FROM connectors
    WHERE type = 'shopify'
    LIMIT 1
  `;

  if (connectors.length === 0) {
    console.log('No Shopify connector found');
    return;
  }

  const connector = connectors[0];
  const config = connector.config as { shop: string };
  const credentials = connector.credentials as { accessToken: string };

  console.log('Shop:', config.shop);
  console.log('Has access token:', !!credentials.accessToken);
  console.log('---');

  // Try to fetch products
  const url = `https://${config.shop}/admin/api/2024-01/products.json?limit=10`;
  console.log('Fetching:', url);

  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': credentials.accessToken,
    },
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    console.log('Error:', await response.text());
    return;
  }

  const data = await response.json();
  console.log('Products returned:', data.products?.length || 0);

  if (data.products && data.products.length > 0) {
    console.log('First product:', data.products[0].title);
    data.products.forEach((p: { title: string }) => console.log(`  - ${p.title}`));
  }
}

testShopify();
