import { pgTable, uuid, varchar, text, timestamp, decimal, integer, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const subscriptionTierEnum = pgEnum('subscription_tier', ['starter', 'growth', 'enterprise']);
export const connectorTypeEnum = pgEnum('connector_type', ['shopify', 'amazon', 'woocommerce', 'bigcommerce', 'custom']);
export const productCategoryEnum = pgEnum('product_category', ['apparel', 'collectibles', 'accessories', 'home', 'digital', 'other']);
export const assetTypeEnum = pgEnum('asset_type', ['character', 'logo', 'scene', 'item', 'theme', 'other']);
export const mappingStatusEnum = pgEnum('mapping_status', ['unmapped', 'suggested', 'confirmed', 'skipped']);
export const userRoleEnum = pgEnum('user_role', ['owner', 'admin', 'member', 'analyst']);
export const inviteStatusEnum = pgEnum('invite_status', ['pending', 'accepted', 'expired', 'revoked']);

// Publishers (Game Studios/Publishers)
export const publishers = pgTable('publishers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logo: text('logo'),
  website: text('website'),
  subscriptionTier: subscriptionTierEnum('subscription_tier').default('starter'),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users (Team members within publishers)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  publisherId: uuid('publisher_id').references(() => publishers.id),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'), // bcrypt hashed password
  name: varchar('name', { length: 255 }),
  avatar: text('avatar'),
  role: varchar('role', { length: 50 }).default('member'),
  emailVerified: timestamp('email_verified'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Game IPs (Individual game franchises)
export const gameIps = pgTable('game_ips', {
  id: uuid('id').primaryKey().defaultRandom(),
  publisherId: uuid('publisher_id').references(() => publishers.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  coverImage: text('cover_image'),
  releaseDate: timestamp('release_date'),
  genre: varchar('genre', { length: 100 }),
  platforms: jsonb('platforms').default([]),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// IP Assets (Characters, logos, themes within a game IP)
export const ipAssets = pgTable('ip_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameIpId: uuid('game_ip_id').references(() => gameIps.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  assetType: assetTypeEnum('asset_type').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  popularity: integer('popularity').default(0),
  tags: jsonb('tags').default([]),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Data Connectors (Shopify, Amazon, etc.)
export const connectors = pgTable('connectors', {
  id: uuid('id').primaryKey().defaultRandom(),
  publisherId: uuid('publisher_id').references(() => publishers.id).notNull(),
  type: connectorTypeEnum('type').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  config: jsonb('config').default({}),
  credentials: jsonb('credentials').default({}), // Encrypted
  lastSyncAt: timestamp('last_sync_at'),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products (Merchandise items)
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  publisherId: uuid('publisher_id').references(() => publishers.id).notNull(),
  gameIpId: uuid('game_ip_id').references(() => gameIps.id),
  connectorId: uuid('connector_id').references(() => connectors.id),
  externalId: varchar('external_id', { length: 255 }),
  name: varchar('name', { length: 500 }).notNull(),
  description: text('description'),
  category: productCategoryEnum('category'),
  imageUrl: text('image_url'),
  price: decimal('price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  sku: varchar('sku', { length: 100 }),
  vendor: varchar('vendor', { length: 255 }),
  tags: jsonb('tags').default([]),
  metadata: jsonb('metadata').default({}),
  // Asset Mapping Fields
  mappingStatus: mappingStatusEnum('mapping_status').default('unmapped'),
  aiSuggestedAssets: jsonb('ai_suggested_assets').default([]), // [{assetId, confidence, reason}]
  mappedBy: uuid('mapped_by').references(() => users.id),
  mappedAt: timestamp('mapped_at'),
  totalRevenue: decimal('total_revenue', { precision: 12, scale: 2 }).default('0'), // Cached for sorting
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Product-Asset Links (Many-to-many)
export const productAssets = pgTable('product_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  assetId: uuid('asset_id').references(() => ipAssets.id).notNull(),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Sales Data (Aggregated sales information)
export const sales = pgTable('sales', {
  id: uuid('id').primaryKey().defaultRandom(),
  publisherId: uuid('publisher_id').references(() => publishers.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  connectorId: uuid('connector_id').references(() => connectors.id),
  externalOrderId: varchar('external_order_id', { length: 255 }),
  quantity: integer('quantity').notNull(),
  revenue: decimal('revenue', { precision: 12, scale: 2 }).notNull(),
  cost: decimal('cost', { precision: 12, scale: 2 }),
  profit: decimal('profit', { precision: 12, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  region: varchar('region', { length: 100 }),
  channel: varchar('channel', { length: 100 }),
  orderDate: timestamp('order_date').notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Analytics Snapshots (Pre-computed metrics)
export const analyticsSnapshots = pgTable('analytics_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  publisherId: uuid('publisher_id').references(() => publishers.id).notNull(),
  period: varchar('period', { length: 20 }).notNull(), // daily, weekly, monthly
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  metrics: jsonb('metrics').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI Insights (Generated recommendations)
export const aiInsights = pgTable('ai_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  publisherId: uuid('publisher_id').references(() => publishers.id).notNull(),
  gameIpId: uuid('game_ip_id').references(() => gameIps.id),
  assetId: uuid('asset_id').references(() => ipAssets.id),
  type: varchar('type', { length: 100 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  data: jsonb('data').default({}),
  isRead: boolean('is_read').default(false),
  isActioned: boolean('is_actioned').default(false),
  actionedAt: timestamp('actioned_at'),
  batchId: uuid('batch_id'), // Groups insights generated together (nullable for legacy data)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Waitlist Entries (Pilot Program)
export const waitlistStatusEnum = pgEnum('waitlist_status', ['pending', 'approved', 'rejected', 'converted']);

export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  companyName: varchar('company_name', { length: 255 }),
  companyWebsite: text('company_website'),
  revenueRange: varchar('revenue_range', { length: 100 }), // e.g., "Under $100K", "$100K-$500K", etc.
  primaryChannel: varchar('primary_channel', { length: 100 }), // e.g., "Shopify", "Amazon", "Both"
  notes: text('notes'), // Internal notes from admin
  status: waitlistStatusEnum('status').default('pending'),
  approvedAt: timestamp('approved_at'),
  approvedBy: uuid('approved_by').references(() => users.id),
  inviteToken: varchar('invite_token', { length: 256 }), // Token sent when approved
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Team Invitations
export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: varchar('token', { length: 256 }).unique().notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  role: userRoleEnum('role').notNull().default('member'),
  publisherId: uuid('publisher_id').references(() => publishers.id, { onDelete: 'cascade' }).notNull(),
  invitedBy: uuid('invited_by').references(() => users.id),
  status: inviteStatusEnum('status').notNull().default('pending'),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const publishersRelations = relations(publishers, ({ many }) => ({
  users: many(users),
  gameIps: many(gameIps),
  connectors: many(connectors),
  products: many(products),
  sales: many(sales),
  analyticsSnapshots: many(analyticsSnapshots),
  aiInsights: many(aiInsights),
  invitations: many(invitations),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  publisher: one(publishers, {
    fields: [invitations.publisherId],
    references: [publishers.id],
  }),
  inviter: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  publisher: one(publishers, {
    fields: [users.publisherId],
    references: [publishers.id],
  }),
}));

export const gameIpsRelations = relations(gameIps, ({ one, many }) => ({
  publisher: one(publishers, {
    fields: [gameIps.publisherId],
    references: [publishers.id],
  }),
  assets: many(ipAssets),
  products: many(products),
}));

export const ipAssetsRelations = relations(ipAssets, ({ one, many }) => ({
  gameIp: one(gameIps, {
    fields: [ipAssets.gameIpId],
    references: [gameIps.id],
  }),
  productAssets: many(productAssets),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  publisher: one(publishers, {
    fields: [products.publisherId],
    references: [publishers.id],
  }),
  gameIp: one(gameIps, {
    fields: [products.gameIpId],
    references: [gameIps.id],
  }),
  connector: one(connectors, {
    fields: [products.connectorId],
    references: [connectors.id],
  }),
  productAssets: many(productAssets),
  sales: many(sales),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  publisher: one(publishers, {
    fields: [sales.publisherId],
    references: [publishers.id],
  }),
  product: one(products, {
    fields: [sales.productId],
    references: [products.id],
  }),
  connector: one(connectors, {
    fields: [sales.connectorId],
    references: [connectors.id],
  }),
}));
