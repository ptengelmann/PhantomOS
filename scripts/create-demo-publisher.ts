import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function createDemoPublisher() {
  const DEMO_PUBLISHER_ID = '00000000-0000-0000-0000-000000000001';

  try {
    // Check if demo publisher exists
    const existing = await sql`
      SELECT id FROM publishers WHERE id = ${DEMO_PUBLISHER_ID}
    `;

    if (existing.length > 0) {
      console.log('Demo publisher already exists');
      return;
    }

    // Create demo publisher
    await sql`
      INSERT INTO publishers (id, name, slug, created_at, updated_at)
      VALUES (
        ${DEMO_PUBLISHER_ID},
        'Demo Publisher',
        'demo',
        NOW(),
        NOW()
      )
    `;

    console.log('Demo publisher created successfully!');
  } catch (error) {
    console.error('Error creating demo publisher:', error);
  }
}

createDemoPublisher();
