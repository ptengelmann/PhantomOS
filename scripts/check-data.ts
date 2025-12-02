import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function checkData() {
  const DEMO_PUBLISHER_ID = '00000000-0000-0000-0000-000000000001';

  console.log('Checking data for publisher:', DEMO_PUBLISHER_ID);
  console.log('---');

  // Check connectors
  const connectors = await sql`
    SELECT id, name, type, status, last_sync_at, publisher_id
    FROM connectors
    WHERE publisher_id = ${DEMO_PUBLISHER_ID}
  `;
  console.log('Connectors:', connectors.length);
  connectors.forEach(c => console.log(`  - ${c.name} (${c.type}): ${c.status}, last sync: ${c.last_sync_at}`));

  // Check ALL connectors to see publisher IDs
  const allConnectors = await sql`SELECT id, name, publisher_id FROM connectors`;
  console.log('\nAll connectors in DB:');
  allConnectors.forEach(c => console.log(`  - ${c.name}: publisher_id=${c.publisher_id}`));

  // Check products
  const products = await sql`
    SELECT id, name, publisher_id, connector_id
    FROM products
    WHERE publisher_id = ${DEMO_PUBLISHER_ID}
    LIMIT 10
  `;
  console.log('\nProducts for demo publisher:', products.length);
  products.forEach(p => console.log(`  - ${p.name}`));

  // Check ALL products
  const allProducts = await sql`SELECT COUNT(*) as count, publisher_id FROM products GROUP BY publisher_id`;
  console.log('\nProducts by publisher_id:');
  allProducts.forEach(p => console.log(`  - ${p.publisher_id}: ${p.count} products`));

  // Check sales
  const sales = await sql`
    SELECT COUNT(*) as count
    FROM sales
    WHERE publisher_id = ${DEMO_PUBLISHER_ID}
  `;
  console.log('\nSales for demo publisher:', sales[0]?.count || 0);
}

checkData();
