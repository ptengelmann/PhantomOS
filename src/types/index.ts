// Publisher types
export interface Publisher {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  subscriptionTier: 'starter' | 'growth' | 'enterprise';
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface User {
  id: string;
  publisherId?: string;
  email: string;
  name?: string;
  avatar?: string;
  role: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Game IP types
export interface GameIP {
  id: string;
  publisherId: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  releaseDate?: Date;
  genre?: string;
  platforms: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// IP Asset types
export interface IPAsset {
  id: string;
  gameIpId: string;
  name: string;
  assetType: 'character' | 'logo' | 'scene' | 'item' | 'theme' | 'other';
  description?: string;
  imageUrl?: string;
  popularity: number;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Connector types
export interface Connector {
  id: string;
  publisherId: string;
  type: 'shopify' | 'amazon' | 'woocommerce' | 'bigcommerce' | 'custom';
  name: string;
  config: Record<string, unknown>;
  credentials: Record<string, unknown>;
  lastSyncAt?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export interface Product {
  id: string;
  publisherId: string;
  gameIpId?: string;
  connectorId?: string;
  externalId?: string;
  name: string;
  description?: string;
  category?: 'apparel' | 'collectibles' | 'accessories' | 'home' | 'digital' | 'other';
  imageUrl?: string;
  price?: number;
  currency: string;
  sku?: string;
  vendor?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Sales types
export interface Sale {
  id: string;
  publisherId: string;
  productId: string;
  connectorId?: string;
  externalOrderId?: string;
  quantity: number;
  revenue: number;
  cost?: number;
  profit?: number;
  currency: string;
  region?: string;
  channel?: string;
  orderDate: Date;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

// Analytics types
export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  avgOrderValue: number;
  previousPeriod?: {
    totalRevenue: number;
    totalOrders: number;
  };
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders?: number;
  units?: number;
}

export interface AssetPerformance {
  id: string;
  name: string;
  assetType: string;
  imageUrl?: string;
  gameIpName: string;
  productCount: number;
  totalRevenue: number;
  totalUnits: number;
  avgRevenuePerSale: number;
  score: number;
  trend: 'rising' | 'stable' | 'declining';
}

export interface CategoryRevenue {
  category: string;
  totalRevenue: number;
  totalUnits: number;
  percentage?: number;
}

// AI Insight types
export interface AIInsight {
  id: string;
  publisherId: string;
  gameIpId?: string;
  assetId?: string;
  type: 'opportunity' | 'warning' | 'insight';
  title: string;
  description: string;
  confidence: number;
  recommendations: string[];
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export interface DemandForecast {
  prediction: number;
  confidence: number;
  factors: string[];
  recommendation: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
