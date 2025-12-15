/**
 * PhantomOS Analytics Module
 *
 * Comprehensive analytics tracking using Posthog.
 * Tracks user behavior, feature adoption, and engagement metrics.
 */

import posthog from 'posthog-js';

// Initialize Posthog only on client side
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let isInitialized = false;

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;
  if (!POSTHOG_KEY) {
    console.warn('[Analytics] NEXT_PUBLIC_POSTHOG_KEY not set - analytics disabled');
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false, // We'll handle this manually for more control
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] Posthog initialized');
      }
    },
  });

  isInitialized = true;
}

// Identify user after login
export function identifyUser(user: {
  id: string;
  email: string;
  name?: string;
  role: string;
  publisherId: string;
  publisherName?: string;
}): void {
  if (typeof window === 'undefined' || !isInitialized) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
    publisher_id: user.publisherId,
    publisher_name: user.publisherName,
  });

  // Set user properties for filtering
  posthog.people.set({
    $email: user.email,
    $name: user.name,
    role: user.role,
    publisher_id: user.publisherId,
    publisher_name: user.publisherName,
  });
}

// Reset on logout
export function resetAnalytics(): void {
  if (typeof window === 'undefined' || !isInitialized) return;
  posthog.reset();
}

// Page view tracking
export function trackPageView(pageName: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !isInitialized) return;

  posthog.capture('$pageview', {
    $current_url: window.location.href,
    page_name: pageName,
    ...properties,
  });
}

// ============================================
// CORE FEATURE EVENTS
// ============================================

// Dashboard Events
export const DashboardEvents = {
  viewed: (properties?: { dateRange?: string; hasData?: boolean }) => {
    track('dashboard_viewed', { feature: 'dashboard', ...properties });
  },

  chartInteraction: (chartType: string, action: string) => {
    track('dashboard_chart_interaction', {
      feature: 'dashboard',
      chart_type: chartType,
      action,
    });
  },

  dateRangeChanged: (range: string) => {
    track('dashboard_date_range_changed', {
      feature: 'dashboard',
      date_range: range,
    });
  },
};

// Intelligence Hub Events
export const IntelligenceEvents = {
  viewed: () => {
    track('intelligence_hub_viewed', { feature: 'intelligence' });
  },

  insightGenerated: (insightCount: number) => {
    track('ai_insight_generated', {
      feature: 'intelligence',
      insight_count: insightCount,
    });
  },

  insightRead: (insightId: string, insightType: string) => {
    track('ai_insight_read', {
      feature: 'intelligence',
      insight_id: insightId,
      insight_type: insightType,
    });
  },

  insightActioned: (insightId: string, action: string) => {
    track('ai_insight_actioned', {
      feature: 'intelligence',
      insight_id: insightId,
      action,
    });
  },
};

// Asset Tagging Events
export const TaggingEvents = {
  viewed: (stats?: { total?: number; mapped?: number; unmapped?: number }) => {
    track('tagging_workbench_viewed', {
      feature: 'tagging',
      ...stats,
    });
  },

  productMapped: (productId: string, assetId: string, source: 'manual' | 'ai_confirmed') => {
    track('product_asset_mapped', {
      feature: 'tagging',
      product_id: productId,
      asset_id: assetId,
      mapping_source: source,
    });
  },

  productSkipped: (productId: string) => {
    track('product_mapping_skipped', {
      feature: 'tagging',
      product_id: productId,
    });
  },

  aiTaggingRequested: (productCount: number) => {
    track('ai_tagging_requested', {
      feature: 'tagging',
      product_count: productCount,
    });
  },

  bulkMappingCompleted: (productCount: number) => {
    track('bulk_mapping_completed', {
      feature: 'tagging',
      product_count: productCount,
    });
  },
};

// Connector Events
export const ConnectorEvents = {
  viewed: () => {
    track('connectors_page_viewed', { feature: 'connectors' });
  },

  connectionStarted: (connectorType: string) => {
    track('connector_connection_started', {
      feature: 'connectors',
      connector_type: connectorType,
    });
  },

  connectionCompleted: (connectorType: string) => {
    track('connector_connection_completed', {
      feature: 'connectors',
      connector_type: connectorType,
    });
  },

  connectionFailed: (connectorType: string, error?: string) => {
    track('connector_connection_failed', {
      feature: 'connectors',
      connector_type: connectorType,
      error,
    });
  },

  syncTriggered: (connectorId: string, syncType: 'products' | 'orders') => {
    track('connector_sync_triggered', {
      feature: 'connectors',
      connector_id: connectorId,
      sync_type: syncType,
    });
  },

  csvImported: (recordCount: number, importType: 'products' | 'sales') => {
    track('csv_imported', {
      feature: 'connectors',
      record_count: recordCount,
      import_type: importType,
    });
  },
};

// Settings Events
export const SettingsEvents = {
  viewed: (tab: string) => {
    track('settings_viewed', {
      feature: 'settings',
      tab,
    });
  },

  profileUpdated: () => {
    track('profile_updated', { feature: 'settings' });
  },

  organizationUpdated: () => {
    track('organization_updated', { feature: 'settings' });
  },

  teamMemberInvited: (role: string) => {
    track('team_member_invited', {
      feature: 'settings',
      invited_role: role,
    });
  },

  inviteRevoked: () => {
    track('team_invite_revoked', { feature: 'settings' });
  },
};

// ============================================
// MARKETING & CONVERSION EVENTS
// ============================================

export const MarketingEvents = {
  landingPageViewed: () => {
    track('landing_page_viewed', { feature: 'marketing' });
  },

  featurePageViewed: (featureName: string) => {
    track('feature_page_viewed', {
      feature: 'marketing',
      feature_name: featureName,
    });
  },

  ctaClicked: (ctaLocation: string, ctaText: string) => {
    track('cta_clicked', {
      feature: 'marketing',
      cta_location: ctaLocation,
      cta_text: ctaText,
    });
  },

  waitlistSubmitted: (companySize?: string) => {
    track('waitlist_submitted', {
      feature: 'marketing',
      company_size: companySize,
    });
  },

  pricingViewed: () => {
    track('pricing_page_viewed', { feature: 'marketing' });
  },

  pricingTierClicked: (tier: string) => {
    track('pricing_tier_clicked', {
      feature: 'marketing',
      tier,
    });
  },
};

// ============================================
// AUTH EVENTS
// ============================================

export const AuthEvents = {
  loginAttempted: () => {
    track('login_attempted', { feature: 'auth' });
  },

  loginSuccess: () => {
    track('login_success', { feature: 'auth' });
  },

  loginFailed: (reason?: string) => {
    track('login_failed', {
      feature: 'auth',
      reason,
    });
  },

  signupStarted: (source: 'waitlist' | 'invite' | 'direct') => {
    track('signup_started', {
      feature: 'auth',
      signup_source: source,
    });
  },

  signupCompleted: (source: 'waitlist' | 'invite' | 'direct') => {
    track('signup_completed', {
      feature: 'auth',
      signup_source: source,
    });
  },

  logout: () => {
    track('logout', { feature: 'auth' });
  },
};

// ============================================
// ENGAGEMENT METRICS
// ============================================

export const EngagementEvents = {
  // Time spent on feature
  featureEngaged: (feature: string, durationSeconds: number) => {
    track('feature_engaged', {
      feature,
      duration_seconds: durationSeconds,
    });
  },

  // Search/filter usage
  searchPerformed: (feature: string, query: string) => {
    track('search_performed', {
      feature,
      query_length: query.length,
      has_results: true, // Will be updated by caller
    });
  },

  filterApplied: (feature: string, filterType: string, filterValue: string) => {
    track('filter_applied', {
      feature,
      filter_type: filterType,
      filter_value: filterValue,
    });
  },

  // Data export
  dataExported: (feature: string, format: string, recordCount: number) => {
    track('data_exported', {
      feature,
      format,
      record_count: recordCount,
    });
  },
};

// ============================================
// CORE TRACKING FUNCTION
// ============================================

function track(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !isInitialized) return;

  posthog.capture(eventName, {
    timestamp: new Date().toISOString(),
    ...properties,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, properties);
  }
}

// Export raw track function for custom events
export { track };

// Export posthog instance for advanced usage
export { posthog };
