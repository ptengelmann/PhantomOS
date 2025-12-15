import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function check() {
  // Check what regions exist in sales table
  const regions = await db.execute(sql`
    SELECT region, COUNT(*) as count, SUM(revenue::numeric) as total_revenue
    FROM sales
    GROUP BY region
    ORDER BY count DESC
  `);

  console.log('Regions in sales:');
  regions.rows.forEach((r: any) => {
    const region = r.region || 'NULL';
    const count = r.count;
    const revenue = parseFloat(r.total_revenue || 0).toFixed(2);
    console.log(`  ${region}: ${count} sales, $${revenue}`);
  });
}

check().catch(console.error);
