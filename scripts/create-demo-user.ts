import 'dotenv/config';
import { db } from '../src/lib/db';
import { users, publishers } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

async function createDemoUser() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Demo User';

  if (!email || !password) {
    console.log('Usage: npx tsx scripts/create-demo-user.ts <email> <password> [name]');
    console.log('Example: npx tsx scripts/create-demo-user.ts john@example.com password123 "John Doe"');
    process.exit(1);
  }

  if (password.length < 8) {
    console.log('❌ Password must be at least 8 characters');
    process.exit(1);
  }

  // Demo publisher ID (has all the demo data)
  const DEMO_PUBLISHER_ID = '00000000-0000-0000-0000-000000000001';

  console.log(`\nCreating demo user: ${email}\n`);

  // Check if user already exists
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    console.log('❌ User with this email already exists');
    process.exit(1);
  }

  // Verify demo publisher exists
  const [publisher] = await db
    .select()
    .from(publishers)
    .where(eq(publishers.id, DEMO_PUBLISHER_ID))
    .limit(1);

  if (!publisher) {
    console.log('❌ Demo publisher not found. Run seed-demo-data.ts first.');
    process.exit(1);
  }

  // Create user
  const passwordHash = await bcrypt.hash(password, 12);
  const userId = randomUUID();

  await db.insert(users).values({
    id: userId,
    email,
    name,
    passwordHash,
    publisherId: DEMO_PUBLISHER_ID,
    role: 'member', // Read-only access, can't delete data
  });

  console.log('✅ Demo user created successfully!\n');
  console.log('   Email:', email);
  console.log('   Name:', name);
  console.log('   Role: member (read-only)');
  console.log('   Publisher:', publisher.name);
  console.log('\n   They can now login at https://phantom-os.vercel.app/login');

  process.exit(0);
}

createDemoUser().catch(console.error);
