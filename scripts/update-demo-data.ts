/**
 * Quick fix script to add vendor and order IDs to existing demo data
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, isNull, and } from 'drizzle-orm';
import { products, sales, connectors } from '../src/lib/db/schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function updateDemoData() {
  console.log('🔧 Updating demo data...\n');

  // 1. Find the demo connector
  const [demoConnector] = await db
    .select()
    .from(connectors)
    .where(eq(connectors.name, 'Phantom Warriors Demo Import'))
    .limit(1);

  if (!demoConnector) {
    console.error('❌ Demo connector not found');
    process.exit(1);
  }

  console.log(`✅ Found demo connector: ${demoConnector.id}\n`);

  // 2. Update all demo products with vendor
  console.log('📦 Updating product vendors...');
  const updatedProducts = await db
    .update(products)
    .set({ vendor: 'Phantom Studios' })
    .where(eq(products.connectorId, demoConnector.id))
    .returning({ id: products.id });

  console.log(`   ✓ Updated ${updatedProducts.length} products with vendor "Phantom Studios"\n`);

  // 3. Update all demo sales with order IDs
  console.log('🧾 Generating order IDs for sales...');

  // Get all sales from demo connector that don't have order IDs
  const demoSales = await db
    .select({ id: sales.id })
    .from(sales)
    .where(eq(sales.connectorId, demoConnector.id));

  let updated = 0;
  for (let i = 0; i < demoSales.length; i++) {
    const orderId = `PW-${String(i + 1).padStart(6, '0')}`;
    await db
      .update(sales)
      .set({ externalOrderId: orderId })
      .where(eq(sales.id, demoSales[i].id));
    updated++;
  }

  console.log(`   ✓ Updated ${updated} sales with order IDs (PW-000001 to PW-${String(updated).padStart(6, '0')})\n`);

  console.log('═'.repeat(40));
  console.log('✅ Demo data updated successfully!');
  console.log('═'.repeat(40));
}

updateDemoData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Update failed:', err);
    process.exit(1);
  });
