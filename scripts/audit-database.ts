import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function auditDatabase() {
  console.log('\n========================================');
  console.log('       DATABASE AUDIT REPORT');
  console.log('========================================\n');

  // Count all tables
  const users = await sql`SELECT COUNT(*) as count FROM users`;
  const publishers = await sql`SELECT COUNT(*) as count FROM publishers`;
  const connectors = await sql`SELECT COUNT(*) as count FROM connectors`;
  const gameIps = await sql`SELECT COUNT(*) as count FROM game_ips`;
  const ipAssets = await sql`SELECT COUNT(*) as count FROM ip_assets`;
  const products = await sql`SELECT COUNT(*) as count FROM products`;
  const productAssets = await sql`SELECT COUNT(*) as count FROM product_assets`;
  const sales = await sql`SELECT COUNT(*) as count FROM sales`;
  const analyticsSnapshots = await sql`SELECT COUNT(*) as count FROM analytics_snapshots`;
  const aiInsights = await sql`SELECT COUNT(*) as count FROM ai_insights`;
  const waitlist = await sql`SELECT COUNT(*) as count FROM waitlist`;
  const invitations = await sql`SELECT COUNT(*) as count FROM invitations`;

  const counts: Record<string, number> = {
    users: parseInt(users[0].count),
    publishers: parseInt(publishers[0].count),
    connectors: parseInt(connectors[0].count),
    game_ips: parseInt(gameIps[0].count),
    ip_assets: parseInt(ipAssets[0].count),
    products: parseInt(products[0].count),
    product_assets: parseInt(productAssets[0].count),
    sales: parseInt(sales[0].count),
    analytics_snapshots: parseInt(analyticsSnapshots[0].count),
    ai_insights: parseInt(aiInsights[0].count),
    waitlist: parseInt(waitlist[0].count),
    invitations: parseInt(invitations[0].count),
  };

  let totalRows = 0;
  const emptyTables: string[] = [];

  for (const [table, count] of Object.entries(counts)) {
    totalRows += count;
    const status = count > 0 ? '✅' : '⚠️ ';
    console.log(`${status} ${table.padEnd(22)} ${count.toString().padStart(6)} rows`);
    if (count === 0) emptyTables.push(table);
  }

  console.log('\n----------------------------------------');
  console.log(`Total rows: ${totalRows.toLocaleString()}`);
  console.log(`Tables with data: ${12 - emptyTables.length}/12`);

  if (emptyTables.length > 0) {
    console.log(`\n⚠️  Empty tables: ${emptyTables.join(', ')}`);
  }

  // Sample data
  console.log('\n========================================');
  console.log('       SAMPLE DATA');
  console.log('========================================\n');

  // Publishers
  const pubData = await sql`SELECT name FROM publishers`;
  console.log('📦 Publishers:');
  pubData.forEach((p: any) => console.log(`   - ${p.name}`));

  // Users
  const userData = await sql`SELECT email, role FROM users`;
  console.log('\n👤 Users:');
  userData.forEach((u: any) => console.log(`   - ${u.email} (${u.role})`));

  // Game IPs
  const gameData = await sql`SELECT name FROM game_ips`;
  console.log('\n🎮 Game IPs:');
  gameData.forEach((g: any) => console.log(`   - ${g.name}`));

  // IP Assets
  const assetData = await sql`SELECT name, asset_type FROM ip_assets LIMIT 10`;
  console.log('\n🦸 IP Assets (first 10):');
  assetData.forEach((a: any) => console.log(`   - ${a.name} (${a.asset_type})`));

  // Products stats
  const productStats = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN EXISTS (SELECT 1 FROM product_assets pa WHERE pa.product_id = p.id) THEN 1 END) as tagged
    FROM products p
  `;
  console.log('\n📦 Products:');
  console.log(`   Total: ${productStats[0].total}`);
  console.log(`   Tagged: ${productStats[0].tagged}`);
  console.log(`   Untagged: ${parseInt(productStats[0].total) - parseInt(productStats[0].tagged)}`);

  // Sales stats
  const salesStats = await sql`
    SELECT
      COUNT(*) as orders,
      COALESCE(SUM(revenue::numeric), 0) as revenue,
      COALESCE(AVG(revenue::numeric), 0) as aov
    FROM sales
  `;
  console.log('\n💰 Sales:');
  console.log(`   Orders: ${parseInt(salesStats[0].orders).toLocaleString()}`);
  console.log(`   Revenue: $${parseFloat(salesStats[0].revenue).toLocaleString()}`);
  console.log(`   AOV: $${parseFloat(salesStats[0].aov).toFixed(2)}`);

  // Analytics snapshots by period
  const snapData = await sql`
    SELECT period, COUNT(*) as count
    FROM analytics_snapshots
    GROUP BY period
  `;
  console.log('\n📊 Analytics Snapshots:');
  snapData.forEach((s: any) => console.log(`   ${s.period}: ${s.count}`));

  // AI Insights
  const insightData = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN is_actioned = true THEN 1 END) as actioned,
      COUNT(DISTINCT batch_id) as batches
    FROM ai_insights
  `;
  console.log('\n🧠 AI Insights:');
  console.log(`   Total: ${insightData[0].total}`);
  console.log(`   Actioned: ${insightData[0].actioned}`);
  console.log(`   Batches: ${insightData[0].batches}`);

  // Connectors
  const connData = await sql`SELECT type, status FROM connectors`;
  console.log('\n🔌 Connectors:');
  if (connData.length === 0) {
    console.log('   None configured');
  } else {
    connData.forEach((c: any) => console.log(`   - ${c.type} (${c.status})`));
  }

  // Waitlist
  const waitData = await sql`SELECT status, COUNT(*) as count FROM waitlist GROUP BY status`;
  console.log('\n📝 Waitlist:');
  if (waitData.length === 0) {
    console.log('   No entries');
  } else {
    waitData.forEach((w: any) => console.log(`   ${w.status}: ${w.count}`));
  }

  // Invitations
  const invData = await sql`SELECT status, COUNT(*) as count FROM invitations GROUP BY status`;
  console.log('\n✉️  Invitations:');
  if (invData.length === 0) {
    console.log('   None sent');
  } else {
    invData.forEach((i: any) => console.log(`   ${i.status}: ${i.count}`));
  }

  console.log('\n========================================');
  console.log('       AUDIT COMPLETE');
  console.log('========================================\n');
}

auditDatabase().catch(console.error);
