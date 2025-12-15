import 'dotenv/config';
import { db } from '../src/lib/db';
import { users, publishers } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function checkUser() {
  const email = process.argv[2];

  if (!email) {
    console.log('Usage: npx tsx scripts/check-user.ts <email>');
    process.exit(1);
  }

  console.log(`\nChecking user: ${email}\n`);

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      publisherId: users.publisherId,
      hasPassword: users.passwordHash,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    console.log('❌ User NOT FOUND in database\n');
    console.log('The account may not exist or was created in a different database.');
    process.exit(1);
  }

  console.log('✅ User found:');
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Name: ${user.name || '(not set)'}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   Has Password: ${user.hasPassword ? 'YES' : 'NO ⚠️'}`);
  console.log(`   Publisher ID: ${user.publisherId || 'NONE ⚠️'}`);
  console.log(`   Created: ${user.createdAt}`);

  if (!user.hasPassword) {
    console.log('\n⚠️  WARNING: User has no password hash!');
    console.log('   This user cannot login with credentials.');
  }

  if (user.publisherId) {
    const [publisher] = await db
      .select()
      .from(publishers)
      .where(eq(publishers.id, user.publisherId))
      .limit(1);

    if (publisher) {
      console.log(`\n📦 Publisher: ${publisher.name}`);
    } else {
      console.log('\n⚠️  WARNING: Publisher not found!');
    }
  }

  process.exit(0);
}

checkUser().catch(console.error);
