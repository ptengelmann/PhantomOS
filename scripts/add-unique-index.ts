import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function addUniqueIndex() {
  console.log('Adding unique index on products (connector_id, external_id)...');

  try {
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS products_connector_external_idx
      ON products (connector_id, external_id)
      WHERE connector_id IS NOT NULL AND external_id IS NOT NULL
    `;
    console.log('Index created successfully!');
  } catch (error) {
    console.log('Error:', error);
  }
}

addUniqueIndex();
