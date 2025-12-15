import 'dotenv/config';
import { db } from '../src/lib/db';
import { users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('Usage: npx tsx scripts/reset-password.ts <email> <new-password>');
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.log('Password must be at least 8 characters');
    process.exit(1);
  }

  console.log(`\nResetting password for: ${email}\n`);

  const [user] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    console.log('❌ User not found');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, user.id));

  console.log('✅ Password reset successfully!');
  console.log(`   You can now login with: ${email}`);
  process.exit(0);
}

resetPassword().catch(console.error);
