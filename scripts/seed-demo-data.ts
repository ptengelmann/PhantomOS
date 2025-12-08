/**
 * Demo Data Seed Script for PhantomOS
 *
 * This script creates curated gaming merchandise demo data for demonstration purposes.
 * It creates a fictional game IP "Phantom Warriors" with characters, products, and sales.
 *
 * Usage:
 *   npx tsx scripts/seed-demo-data.ts
 *
 * Prerequisites:
 *   - DATABASE_URL must be set in .env.local
 *   - User account must exist (ptengelmann@gmail.com)
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import {
  users,
  publishers,
  connectors,
  gameIps,
  ipAssets,
  products,
  productAssets,
  sales
} from '../src/lib/db/schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Configuration
const TARGET_EMAIL = 'ptengelmann@gmail.com';

// Demo Data Definitions
const GAME_IP = {
  name: 'Phantom Warriors',
  slug: 'phantom-warriors',
  description: 'An epic action RPG featuring legendary warriors battling against the Shadow Legion. Join millions of players in this award-winning franchise.',
  genre: 'Action RPG',
  platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch'],
};

const CHARACTERS = [
  {
    name: 'Shadow Knight',
    assetType: 'character' as const,
    description: 'The mysterious anti-hero wielding dark powers. Former guardian turned rogue after the Fall of Avalon.',
    popularity: 95,
    tags: ['villain', 'dark', 'popular', 'male'],
  },
  {
    name: 'Luna Starfire',
    assetType: 'character' as const,
    description: 'Celestial warrior princess with light-based abilities. The last hope of the Starborn dynasty.',
    popularity: 88,
    tags: ['hero', 'light', 'female', 'royal'],
  },
  {
    name: 'Iron Fang',
    assetType: 'character' as const,
    description: 'Legendary wolf companion with metallic fur. Loyal beast partner to the protagonist.',
    popularity: 82,
    tags: ['beast', 'companion', 'popular', 'cute'],
  },
  {
    name: 'The Architect',
    assetType: 'character' as const,
    description: 'Enigmatic mastermind behind the Shadow Legion. True identity unknown.',
    popularity: 70,
    tags: ['villain', 'mysterious', 'boss'],
  },
  {
    name: 'Pixel',
    assetType: 'character' as const,
    description: 'Adorable floating sprite companion. Comic relief and guide character beloved by fans.',
    popularity: 92,
    tags: ['mascot', 'cute', 'companion', 'popular'],
  },
  {
    name: 'Crimson Guard',
    assetType: 'character' as const,
    description: 'Elite faction of royal protectors. Iconic red armor and unwavering loyalty.',
    popularity: 65,
    tags: ['faction', 'group', 'armor', 'military'],
  },
];

// Product templates - will be generated with variations
const PRODUCT_TEMPLATES = [
  // Apparel - Shadow Knight
  { name: 'Shadow Knight Classic T-Shirt', category: 'apparel', character: 'Shadow Knight', price: 29.99, baseSales: 150 },
  { name: 'Shadow Knight Hoodie - Dark Edition', category: 'apparel', character: 'Shadow Knight', price: 59.99, baseSales: 80 },
  { name: 'Shadow Knight Premium Jersey', category: 'apparel', character: 'Shadow Knight', price: 49.99, baseSales: 45 },
  { name: 'Dark Powers T-Shirt', category: 'apparel', character: 'Shadow Knight', price: 24.99, baseSales: 120 },
  { name: 'Shadow Knight Cap', category: 'accessories', character: 'Shadow Knight', price: 19.99, baseSales: 90 },

  // Apparel - Luna Starfire
  { name: 'Luna Starfire Celestial Tee', category: 'apparel', character: 'Luna Starfire', price: 29.99, baseSales: 130 },
  { name: 'Starborn Dynasty Hoodie', category: 'apparel', character: 'Luna Starfire', price: 54.99, baseSales: 65 },
  { name: 'Luna Light Warrior Tank Top', category: 'apparel', character: 'Luna Starfire', price: 24.99, baseSales: 55 },
  { name: 'Celestial Princess Dress', category: 'apparel', character: 'Luna Starfire', price: 79.99, baseSales: 25 },

  // Collectibles - Shadow Knight
  { name: 'Shadow Knight 12" Action Figure', category: 'collectibles', character: 'Shadow Knight', price: 89.99, baseSales: 40 },
  { name: 'Shadow Knight Statue - Limited Edition', category: 'collectibles', character: 'Shadow Knight', price: 299.99, baseSales: 8 },
  { name: 'Shadow Knight Funko Pop', category: 'collectibles', character: 'Shadow Knight', price: 14.99, baseSales: 200 },

  // Collectibles - Luna Starfire
  { name: 'Luna Starfire Premium Figure', category: 'collectibles', character: 'Luna Starfire', price: 129.99, baseSales: 30 },
  { name: 'Luna Starfire Nendoroid', category: 'collectibles', character: 'Luna Starfire', price: 59.99, baseSales: 45 },
  { name: 'Luna Starfire Funko Pop', category: 'collectibles', character: 'Luna Starfire', price: 14.99, baseSales: 180 },

  // Collectibles - Iron Fang
  { name: 'Iron Fang Plush - Large', category: 'collectibles', character: 'Iron Fang', price: 39.99, baseSales: 95 },
  { name: 'Iron Fang Plush - Mini', category: 'collectibles', character: 'Iron Fang', price: 19.99, baseSales: 220 },
  { name: 'Iron Fang Articulated Figure', category: 'collectibles', character: 'Iron Fang', price: 49.99, baseSales: 35 },

  // Collectibles - Pixel (Mascot - high sales)
  { name: 'Pixel Plush - Standard', category: 'collectibles', character: 'Pixel', price: 24.99, baseSales: 350 },
  { name: 'Pixel Plush - Giant Edition', category: 'collectibles', character: 'Pixel', price: 49.99, baseSales: 120 },
  { name: 'Pixel Keychain Plush', category: 'accessories', character: 'Pixel', price: 12.99, baseSales: 400 },
  { name: 'Pixel LED Light Figure', category: 'collectibles', character: 'Pixel', price: 34.99, baseSales: 85 },
  { name: 'Pixel Funko Pop', category: 'collectibles', character: 'Pixel', price: 14.99, baseSales: 280 },

  // Collectibles - The Architect
  { name: 'The Architect Mystery Figure', category: 'collectibles', character: 'The Architect', price: 69.99, baseSales: 25 },
  { name: 'The Architect Mask Replica', category: 'collectibles', character: 'The Architect', price: 149.99, baseSales: 12 },

  // Collectibles - Crimson Guard
  { name: 'Crimson Guard Helmet Replica', category: 'collectibles', character: 'Crimson Guard', price: 199.99, baseSales: 15 },
  { name: 'Crimson Guard Army Pack (3 Figures)', category: 'collectibles', character: 'Crimson Guard', price: 79.99, baseSales: 28 },

  // Accessories - Various
  { name: 'Phantom Warriors Logo Mug', category: 'accessories', character: null, price: 16.99, baseSales: 180 },
  { name: 'Shadow Knight Emblem Mug', category: 'accessories', character: 'Shadow Knight', price: 18.99, baseSales: 95 },
  { name: 'Luna Starfire Crystal Mug', category: 'accessories', character: 'Luna Starfire', price: 18.99, baseSales: 85 },
  { name: 'Pixel Cute Mug', category: 'accessories', character: 'Pixel', price: 16.99, baseSales: 150 },
  { name: 'Iron Fang Paw Print Mug', category: 'accessories', character: 'Iron Fang', price: 16.99, baseSales: 70 },

  // Posters
  { name: 'Shadow Knight Key Art Poster', category: 'home', character: 'Shadow Knight', price: 19.99, baseSales: 110 },
  { name: 'Luna Starfire Celestial Poster', category: 'home', character: 'Luna Starfire', price: 19.99, baseSales: 95 },
  { name: 'Phantom Warriors Cast Poster', category: 'home', character: null, price: 24.99, baseSales: 75 },
  { name: 'Iron Fang & Pixel Duo Poster', category: 'home', character: 'Iron Fang', price: 19.99, baseSales: 85 },
  { name: 'The Architect Reveal Poster', category: 'home', character: 'The Architect', price: 19.99, baseSales: 40 },
  { name: 'Battle of Avalon Panoramic Poster', category: 'home', character: null, price: 34.99, baseSales: 55 },

  // Premium/Special Items
  { name: 'Shadow Knight Collector\'s Box Set', category: 'collectibles', character: 'Shadow Knight', price: 199.99, baseSales: 18 },
  { name: 'Luna Starfire Jewelry Set', category: 'accessories', character: 'Luna Starfire', price: 89.99, baseSales: 22 },
  { name: 'Phantom Warriors Art Book', category: 'home', character: null, price: 49.99, baseSales: 65 },
  { name: 'Pixel Backpack', category: 'accessories', character: 'Pixel', price: 44.99, baseSales: 75 },
  { name: 'Shadow Knight Wallet', category: 'accessories', character: 'Shadow Knight', price: 29.99, baseSales: 60 },
  { name: 'Luna Phone Case - Starlight', category: 'accessories', character: 'Luna Starfire', price: 24.99, baseSales: 130 },
  { name: 'Shadow Knight Phone Case - Dark', category: 'accessories', character: 'Shadow Knight', price: 24.99, baseSales: 145 },
  { name: 'Pixel Phone Case - Cute', category: 'accessories', character: 'Pixel', price: 24.99, baseSales: 160 },

  // Apparel - More variety
  { name: 'Phantom Warriors Logo Tee', category: 'apparel', character: null, price: 24.99, baseSales: 200 },
  { name: 'Iron Fang Pack T-Shirt', category: 'apparel', character: 'Iron Fang', price: 29.99, baseSales: 70 },
  { name: 'Pixel Squad Hoodie', category: 'apparel', character: 'Pixel', price: 54.99, baseSales: 90 },
  { name: 'The Architect Shadow Tee', category: 'apparel', character: 'The Architect', price: 29.99, baseSales: 45 },
  { name: 'Crimson Guard Battalion Tee', category: 'apparel', character: 'Crimson Guard', price: 27.99, baseSales: 55 },
  { name: 'Shadow vs Luna Battle Tee', category: 'apparel', character: 'Shadow Knight', price: 34.99, baseSales: 85 },

  // Home items
  { name: 'Shadow Knight Throw Blanket', category: 'home', character: 'Shadow Knight', price: 49.99, baseSales: 35 },
  { name: 'Pixel Plush Pillow', category: 'home', character: 'Pixel', price: 34.99, baseSales: 95 },
  { name: 'Iron Fang Pet Bed (for fans)', category: 'home', character: 'Iron Fang', price: 59.99, baseSales: 20 },
  { name: 'Luna Starfire LED Lamp', category: 'home', character: 'Luna Starfire', price: 44.99, baseSales: 40 },
  { name: 'Phantom Warriors Wall Clock', category: 'home', character: null, price: 29.99, baseSales: 50 },

  // Digital/Other
  { name: 'Phantom Warriors Mousepad XL', category: 'accessories', character: null, price: 19.99, baseSales: 120 },
  { name: 'Shadow Knight Gaming Mousepad', category: 'accessories', character: 'Shadow Knight', price: 24.99, baseSales: 80 },
  { name: 'Luna Starfire Desk Mat', category: 'accessories', character: 'Luna Starfire', price: 34.99, baseSales: 45 },
];

// Helper functions
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSKU(productName: string, index: number): string {
  const prefix = productName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  return `PW-${prefix}-${String(index).padStart(4, '0')}`;
}

function getCategoryEnum(category: string): 'apparel' | 'collectibles' | 'accessories' | 'home' | 'digital' | 'other' {
  const mapping: Record<string, 'apparel' | 'collectibles' | 'accessories' | 'home' | 'digital' | 'other'> = {
    apparel: 'apparel',
    collectibles: 'collectibles',
    accessories: 'accessories',
    home: 'home',
    digital: 'digital',
  };
  return mapping[category] || 'other';
}

// Generate sales with realistic patterns
function generateSalesData(
  productId: string,
  publisherId: string,
  connectorId: string,
  baseQuantity: number,
  price: number,
  characterPopularity: number
): Array<{
  publisherId: string;
  productId: string;
  connectorId: string;
  quantity: number;
  revenue: string;
  orderDate: Date;
  region: string;
  channel: string;
}> {
  const salesRecords: Array<{
    publisherId: string;
    productId: string;
    connectorId: string;
    quantity: number;
    revenue: string;
    orderDate: Date;
    region: string;
    channel: string;
  }> = [];

  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
  const regionWeights = [0.45, 0.30, 0.20, 0.05];

  // Generate 6 months of data (June 2025 - November 2025)
  const startDate = new Date('2025-06-01');
  const endDate = new Date('2025-11-30');

  // Adjust base quantity by character popularity
  const adjustedBase = Math.round(baseQuantity * (characterPopularity / 80));

  // Monthly sales with seasonal patterns
  const monthlyMultipliers = [0.8, 0.9, 1.0, 1.1, 1.3, 1.5]; // June to November (holiday ramp)

  for (let month = 0; month < 6; month++) {
    const monthDate = new Date(startDate);
    monthDate.setMonth(monthDate.getMonth() + month);

    // Calculate monthly quantity
    const monthlyQuantity = Math.round(
      (adjustedBase / 6) * monthlyMultipliers[month] * (0.8 + Math.random() * 0.4)
    );

    // Split into individual orders (3-8 orders per month per product)
    const numOrders = randomBetween(3, 8);

    for (let i = 0; i < numOrders; i++) {
      const orderQuantity = Math.max(1, Math.round(monthlyQuantity / numOrders * (0.5 + Math.random())));

      // Random day in the month
      const orderDate = new Date(monthDate);
      orderDate.setDate(randomBetween(1, 28));

      // Select region based on weights
      const rand = Math.random();
      let cumulative = 0;
      let region = regions[0];
      for (let r = 0; r < regions.length; r++) {
        cumulative += regionWeights[r];
        if (rand < cumulative) {
          region = regions[r];
          break;
        }
      }

      salesRecords.push({
        publisherId,
        productId,
        connectorId,
        quantity: orderQuantity,
        revenue: (orderQuantity * price).toFixed(2),
        orderDate,
        region,
        channel: 'Direct Store',
      });
    }
  }

  return salesRecords;
}

async function seedDemoData() {
  console.log('🚀 Starting demo data seed...\n');

  // 1. Find the target user
  console.log(`📧 Looking for user: ${TARGET_EMAIL}`);
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, TARGET_EMAIL))
    .limit(1);

  if (!user) {
    console.error(`❌ User not found: ${TARGET_EMAIL}`);
    console.log('Please ensure the user account exists before running this script.');
    process.exit(1);
  }

  if (!user.publisherId) {
    console.error('❌ User has no publisher associated');
    process.exit(1);
  }

  console.log(`✅ Found user: ${user.name || user.email}`);
  console.log(`   Publisher ID: ${user.publisherId}\n`);

  const publisherId = user.publisherId;

  // 2. Create the demo connector (CSV Import type)
  console.log('📦 Creating demo connector...');
  const [connector] = await db
    .insert(connectors)
    .values({
      publisherId,
      type: 'custom',
      name: 'Phantom Warriors Demo Import',
      status: 'connected',
      config: { source: 'demo_seed', version: '1.0' },
      lastSyncAt: new Date(),
    })
    .returning();

  console.log(`✅ Created connector: ${connector.name} (${connector.id})\n`);

  // 3. Create the Game IP
  console.log('🎮 Creating Game IP...');
  const [gameIp] = await db
    .insert(gameIps)
    .values({
      publisherId,
      name: GAME_IP.name,
      slug: GAME_IP.slug,
      description: GAME_IP.description,
      genre: GAME_IP.genre,
      platforms: GAME_IP.platforms,
    })
    .returning();

  console.log(`✅ Created Game IP: ${gameIp.name} (${gameIp.id})\n`);

  // 4. Create IP Assets (Characters)
  console.log('👥 Creating characters...');
  const characterMap = new Map<string, { id: string; popularity: number }>();

  for (const char of CHARACTERS) {
    const [asset] = await db
      .insert(ipAssets)
      .values({
        gameIpId: gameIp.id,
        name: char.name,
        assetType: char.assetType,
        description: char.description,
        popularity: char.popularity,
        tags: char.tags,
      })
      .returning();

    characterMap.set(char.name, { id: asset.id, popularity: char.popularity });
    console.log(`   ✓ ${char.name} (${char.assetType})`);
  }
  console.log(`✅ Created ${CHARACTERS.length} characters\n`);

  // 5. Create Products
  console.log('🛍️ Creating products...');
  const productMap = new Map<string, { id: string; character: string | null; baseSales: number; price: number }>();

  for (let i = 0; i < PRODUCT_TEMPLATES.length; i++) {
    const template = PRODUCT_TEMPLATES[i];

    const [product] = await db
      .insert(products)
      .values({
        publisherId,
        connectorId: connector.id,
        gameIpId: gameIp.id,
        name: template.name,
        category: getCategoryEnum(template.category),
        price: template.price.toString(),
        sku: generateSKU(template.name, i + 1),
        mappingStatus: template.character ? 'confirmed' : 'unmapped',
        tags: [template.category, 'phantom-warriors'],
      })
      .returning();

    productMap.set(product.id, {
      id: product.id,
      character: template.character,
      baseSales: template.baseSales,
      price: template.price,
    });

    // Link to character if applicable
    if (template.character) {
      const charData = characterMap.get(template.character);
      if (charData) {
        await db.insert(productAssets).values({
          productId: product.id,
          assetId: charData.id,
          isPrimary: true,
        });
      }
    }
  }
  console.log(`✅ Created ${PRODUCT_TEMPLATES.length} products\n`);

  // 6. Generate Sales Data
  console.log('💰 Generating sales data (6 months)...');
  let totalSalesRecords = 0;
  let totalRevenue = 0;

  for (const [productId, productData] of productMap) {
    const characterPopularity = productData.character
      ? (characterMap.get(productData.character)?.popularity || 75)
      : 75;

    const salesRecords = generateSalesData(
      productId,
      publisherId,
      connector.id,
      productData.baseSales,
      productData.price,
      characterPopularity
    );

    if (salesRecords.length > 0) {
      await db.insert(sales).values(salesRecords);
      totalSalesRecords += salesRecords.length;
      totalRevenue += salesRecords.reduce((sum, s) => sum + parseFloat(s.revenue), 0);
    }
  }

  console.log(`✅ Generated ${totalSalesRecords} sales records`);
  console.log(`   Total Revenue: $${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n`);

  // 7. Update product total revenue (cached field)
  console.log('📊 Updating product revenue totals...');

  // This would normally be done via a trigger or aggregation query
  // For now, we'll update each product's totalRevenue field
  for (const [productId] of productMap) {
    const productSales = await db
      .select({ revenue: sales.revenue })
      .from(sales)
      .where(eq(sales.productId, productId));

    const total = productSales.reduce((sum, s) => sum + parseFloat(s.revenue || '0'), 0);

    await db
      .update(products)
      .set({ totalRevenue: total.toFixed(2) })
      .where(eq(products.id, productId));
  }
  console.log('✅ Updated product revenue totals\n');

  // Summary
  console.log('═'.repeat(50));
  console.log('🎉 DEMO DATA SEED COMPLETE!\n');
  console.log('Summary:');
  console.log(`   • Game IP: ${GAME_IP.name}`);
  console.log(`   • Characters: ${CHARACTERS.length}`);
  console.log(`   • Products: ${PRODUCT_TEMPLATES.length}`);
  console.log(`   • Sales Records: ${totalSalesRecords}`);
  console.log(`   • Total Revenue: $${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
  console.log(`   • Date Range: June 2025 - November 2025`);
  console.log('\nYour dashboard should now show compelling demo data!');
  console.log('═'.repeat(50));
}

// Run the script
seedDemoData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
