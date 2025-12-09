/**
 * Test script for invite-only authentication flow
 *
 * Simulates a company requesting access and going through the invite process
 *
 * Usage: npx tsx scripts/test-invite-flow.ts
 */

const BASE_URL = 'http://localhost:3000';

interface WaitlistEntry {
  id: string;
  email: string;
  companyName: string | null;
  status: string;
  inviteToken: string | null;
}

async function testInviteFlow() {
  console.log('🧪 Testing PhantomOS Invite Flow\n');
  console.log('=' .repeat(60));

  // Test data - simulating a game studio
  const testCompany = {
    email: `test+${Date.now()}@gamestudio.com`,
    companyName: 'Epic Game Studio',
    companyWebsite: 'https://epicgamestudio.com',
    revenueRange: '1m_5m',
    primaryChannel: 'shopify',
  };

  const testUser = {
    name: 'John Smith',
    password: 'SecurePassword123!',
  };

  try {
    // Step 1: Submit waitlist form
    console.log('\n📝 Step 1: Submitting waitlist request...');
    console.log(`Email: ${testCompany.email}`);
    console.log(`Company: ${testCompany.companyName}`);

    const waitlistResponse = await fetch(`${BASE_URL}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCompany),
    });

    if (!waitlistResponse.ok) {
      const error = await waitlistResponse.json();
      throw new Error(`Waitlist submission failed: ${error.error}`);
    }

    const waitlistData = await waitlistResponse.json();
    console.log('✅ Waitlist entry created');
    console.log(`   Entry ID: ${waitlistData.id}`);

    // Step 2: Fetch waitlist entries (as admin)
    console.log('\n👤 Step 2: Fetching waitlist entries (admin view)...');
    console.log('   NOTE: In production, this requires authentication');

    const adminResponse = await fetch(`${BASE_URL}/api/waitlist/admin`, {
      headers: {
        // In production, this would need auth headers
        'Cookie': 'your-auth-cookie-here',
      },
    });

    if (!adminResponse.ok) {
      console.log('⚠️  Admin endpoint requires authentication');
      console.log('   In the real flow, you would:');
      console.log('   1. Login as admin at /login');
      console.log('   2. Navigate to /admin/waitlist');
      console.log('   3. Click "Approve" on the entry');
      console.log('\n   Simulating approval...');
    }

    // Step 3: Approve the entry
    console.log('\n✅ Step 3: Approving waitlist entry...');

    const approveResponse = await fetch(`${BASE_URL}/api/waitlist/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In production, this would need auth
      },
      body: JSON.stringify({ id: waitlistData.id }),
    });

    if (!approveResponse.ok) {
      console.log('⚠️  Approve endpoint requires authentication');
      console.log('\n📋 Manual Steps Required:');
      console.log('   1. Start your dev server: npm run dev');
      console.log('   2. Create an admin account or login');
      console.log('   3. Visit: http://localhost:3000/admin/waitlist');
      console.log(`   4. Find entry: ${testCompany.email}`);
      console.log('   5. Click "Approve"');
      console.log('   6. Click "Copy Invite Link"');
      console.log('   7. The link will look like: http://localhost:3000/register/[TOKEN]');
      console.log('\n✨ Once approved, user can register using that link!');
      return;
    }

    const approveData = await approveResponse.json();
    const inviteToken = approveData.inviteToken;
    console.log('✅ Entry approved!');
    console.log(`   Invite token: ${inviteToken}`);
    console.log(`   Invite link: ${BASE_URL}/register/${inviteToken}`);

    // Step 4: Validate the invite token
    console.log('\n🔍 Step 4: Validating invite token...');

    const validateResponse = await fetch(
      `${BASE_URL}/api/auth/validate-invite?token=${inviteToken}`
    );

    if (!validateResponse.ok) {
      const error = await validateResponse.json();
      throw new Error(`Token validation failed: ${error.error}`);
    }

    const validateData = await validateResponse.json();
    console.log('✅ Token is valid!');
    console.log(`   Email: ${validateData.email}`);
    console.log(`   Company: ${validateData.companyName}`);

    // Step 5: Register with the invite token
    console.log('\n📝 Step 5: Creating account with invite token...');
    console.log(`   Name: ${testUser.name}`);

    const registerResponse = await fetch(`${BASE_URL}/api/auth/register-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: inviteToken,
        name: testUser.name,
        password: testUser.password,
      }),
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      throw new Error(`Registration failed: ${error.error}`);
    }

    const registerData = await registerResponse.json();
    console.log('✅ Account created successfully!');
    console.log(`   User ID: ${registerData.user.id}`);
    console.log(`   Email: ${registerData.user.email}`);
    console.log(`   Role: ${registerData.user.role}`);

    // Step 6: Test login
    console.log('\n🔐 Step 6: Testing login...');
    console.log('   NOTE: NextAuth sign-in requires browser session');
    console.log(`   You can now login at: ${BASE_URL}/login`);
    console.log(`   Email: ${testCompany.email}`);
    console.log(`   Password: ${testUser.password}`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✨ INVITE FLOW TEST COMPLETE!\n');
    console.log('Summary:');
    console.log(`✅ Waitlist submission: SUCCESS`);
    console.log(`✅ Token generation: SUCCESS`);
    console.log(`✅ Token validation: SUCCESS`);
    console.log(`✅ Account creation: SUCCESS`);
    console.log('\n📧 Email Workflow (Manual for now):');
    console.log('   1. Admin approves entry in dashboard');
    console.log('   2. Admin copies invite link');
    console.log('   3. Admin sends link via email manually');
    console.log('   4. User clicks link and creates account');
    console.log('\n🔮 Future Enhancement:');
    console.log('   Add Resend integration to automate email sending');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Is your dev server running? (npm run dev)');
    console.log('   - Is your database connected?');
    console.log('   - Check the console for error details');
  }
}

// Run the test
testInviteFlow();
