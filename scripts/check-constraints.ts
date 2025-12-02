import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function checkConstraints() {
  // Check indexes on products table
  const indexes = await sql`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'products'
  `;

  console.log('Indexes on products table:');
  indexes.forEach(i => console.log(`  ${i.indexname}: ${i.indexdef}`));

  // Try a simple insert to see what happens
  console.log('\n--- Testing insert ---');

  try {
    const result = await sql`
      INSERT INTO products (publisher_id, connector_id, external_id, name, category, mapping_status)
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        (SELECT id FROM connectors LIMIT 1),
        'test-123',
        'Test Product',
        'other',
        'unmapped'
      )
      RETURNING id, name
    `;
    console.log('Insert succeeded:', result);

    // Clean up
    await sql`DELETE FROM products WHERE external_id = 'test-123'`;
    console.log('Cleaned up test product');
  } catch (error) {
    console.log('Insert error:', error);
  }
}

checkConstraints();
