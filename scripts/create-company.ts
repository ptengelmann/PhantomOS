import 'dotenv/config';
import { db } from '../src/lib/db';
import { users, publishers } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

async function createCompany() {
  const companyName = process.argv[2];
  const email = process.argv[3];
  const password = process.argv[4];
  const userName = process.argv[5] || companyName;

  if (!companyName || !email || !password) {
    console.log('Usage: npx tsx scripts/create-company.ts <company-name> <email> <password> [user-name]');
    console.log('Example: npx tsx scripts/create-company.ts "Riot Games" john@riot.com password123 "John Smith"');
    process.exit(1);
  }

  if (password.length < 8) {
    console.log('❌ Password must be at least 8 characters');
    process.exit(1);
  }

  console.log(`\nCreating company: ${companyName}\n`);

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

  // Create publisher (company)
  const publisherId = randomUUID();
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  await db.insert(publishers).values({
    id: publisherId,
    name: companyName,
    slug,
    subscriptionTier: 'starter',
  });

  // Create owner user
  const passwordHash = await bcrypt.hash(password, 12);
  const userId = randomUUID();

  await db.insert(users).values({
    id: userId,
    email,
    name: userName,
    passwordHash,
    publisherId,
    role: 'owner', // Full access
  });

  console.log('✅ Company created successfully!\n');
  console.log('   Company:', companyName);
  console.log('   Publisher ID:', publisherId);
  console.log('   ─────────────────────────────');
  console.log('   Owner Email:', email);
  console.log('   Owner Name:', userName);
  console.log('   Role: owner (full access)');
  console.log('\n   They can now:');
  console.log('   1. Login at https://phantom-os.vercel.app/login');
  console.log('   2. Go to Connectors to connect their Shopify');
  console.log('   3. Import their own products and sales data');
  console.log('\n   Their dashboard will be empty until they connect data.');

  process.exit(0);
}

createCompany().catch(console.error);
