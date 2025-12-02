import 'dotenv/config';
import { db } from '../src/lib/db';
import { publishers, users } from '../src/lib/db/schema';

async function checkData() {
  console.log('\n=== PUBLISHERS ===');
  const allPublishers = await db.select().from(publishers);
  console.log(JSON.stringify(allPublishers, null, 2));

  console.log('\n=== USERS ===');
  const allUsers = await db.select().from(users);
  console.log(JSON.stringify(allUsers, null, 2));

  process.exit(0);
}

checkData().catch(console.error);
