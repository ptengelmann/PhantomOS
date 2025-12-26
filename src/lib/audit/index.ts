import { db } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';
import { headers } from 'next/headers';

// Audit action types
export type AuditAction =
  // Products
  | 'product.create'
  | 'product.update'
  | 'product.delete'
  | 'product.import'
  | 'product.tag'
  | 'product.untag'
  | 'product.bulk_tag'
  // Connectors
  | 'connector.create'
  | 'connector.update'
  | 'connector.delete'
  | 'connector.sync'
  | 'connector.auth'
  // AI
  | 'ai.insights_generate'
  | 'ai.insights_action'
  | 'ai.tagging_suggest'
  | 'ai.forecast_generate'
  // Users & Team
  | 'user.login'
  | 'user.logout'
  | 'user.register'
  | 'user.update_profile'
  | 'user.change_password'
  | 'team.invite_create'
  | 'team.invite_accept'
  | 'team.invite_revoke'
  | 'team.member_update'
  | 'team.member_remove'
  // Organization
  | 'organization.update'
  | 'organization.settings_update'
  // Waitlist
  | 'waitlist.submit'
  | 'waitlist.approve'
  | 'waitlist.reject'
  // Assets
  | 'asset.create'
  | 'asset.update'
  | 'asset.delete'
  // Sales
  | 'sales.import';

export type AuditResourceType =
  | 'product'
  | 'connector'
  | 'user'
  | 'team'
  | 'organization'
  | 'waitlist'
  | 'asset'
  | 'insight'
  | 'invitation'
  | 'sales';

export type AuditStatus = 'success' | 'failure' | 'error';

interface AuditLogEntry {
  publisherId?: string;
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  resourceType?: AuditResourceType;
  resourceId?: string;
  resourceName?: string;
  metadata?: Record<string, unknown>;
  status?: AuditStatus;
  errorMessage?: string;
}

// Get request metadata from headers
async function getRequestMetadata(): Promise<{
  ipAddress: string;
  userAgent: string;
}> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const userAgent = headersList.get('user-agent');

    const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

    return {
      ipAddress,
      userAgent: userAgent || 'unknown',
    };
  } catch {
    return {
      ipAddress: 'unknown',
      userAgent: 'unknown',
    };
  }
}

/**
 * Create an audit log entry
 * This should be called after important actions to track who did what
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    const { ipAddress, userAgent } = await getRequestMetadata();

    await db.insert(auditLogs).values({
      publisherId: entry.publisherId || null,
      userId: entry.userId || null,
      userEmail: entry.userEmail || null,
      action: entry.action,
      resourceType: entry.resourceType || null,
      resourceId: entry.resourceId || null,
      resourceName: entry.resourceName || null,
      metadata: entry.metadata || {},
      ipAddress,
      userAgent,
      status: entry.status || 'success',
      errorMessage: entry.errorMessage || null,
    });
  } catch (error) {
    // Don't throw - audit logging should never break the main flow
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Helper to create audit log from session
 */
export async function auditFromSession(
  session: { user: { id: string; email: string; publisherId: string } } | null,
  action: AuditAction,
  options?: {
    resourceType?: AuditResourceType;
    resourceId?: string;
    resourceName?: string;
    metadata?: Record<string, unknown>;
    status?: AuditStatus;
    errorMessage?: string;
  }
): Promise<void> {
  await createAuditLog({
    publisherId: session?.user?.publisherId,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    action,
    resourceType: options?.resourceType,
    resourceId: options?.resourceId,
    resourceName: options?.resourceName,
    metadata: options?.metadata,
    status: options?.status || 'success',
    errorMessage: options?.errorMessage,
  });
}

/**
 * Audit decorator for tracking before/after state changes
 */
export function auditChange<T>(
  action: AuditAction,
  resourceType: AuditResourceType,
  before: T | null,
  after: T | null
): Record<string, unknown> {
  return {
    before: before || null,
    after: after || null,
    changedAt: new Date().toISOString(),
  };
}

/**
 * Quick audit helpers for common actions
 */
export const audit = {
  // Product actions
  productCreated: (
    session: { user: { id: string; email: string; publisherId: string } } | null,
    productId: string,
    productName: string
  ) =>
    auditFromSession(session, 'product.create', {
      resourceType: 'product',
      resourceId: productId,
      resourceName: productName,
    }),

  productTagged: (
    session: { user: { id: string; email: string; publisherId: string } } | null,
    productId: string,
    productName: string,
    assetNames: string[]
  ) =>
    auditFromSession(session, 'product.tag', {
      resourceType: 'product',
      resourceId: productId,
      resourceName: productName,
      metadata: { taggedAssets: assetNames },
    }),

  // Connector actions
  connectorCreated: (
    session: { user: { id: string; email: string; publisherId: string } } | null,
    connectorId: string,
    connectorName: string,
    connectorType: string
  ) =>
    auditFromSession(session, 'connector.create', {
      resourceType: 'connector',
      resourceId: connectorId,
      resourceName: connectorName,
      metadata: { type: connectorType },
    }),

  connectorSynced: (
    session: { user: { id: string; email: string; publisherId: string } } | null,
    connectorId: string,
    connectorName: string,
    syncedCount: number
  ) =>
    auditFromSession(session, 'connector.sync', {
      resourceType: 'connector',
      resourceId: connectorId,
      resourceName: connectorName,
      metadata: { syncedCount },
    }),

  // AI actions
  insightsGenerated: (
    session: { user: { id: string; email: string; publisherId: string } } | null,
    batchId: string,
    insightCount: number
  ) =>
    auditFromSession(session, 'ai.insights_generate', {
      resourceType: 'insight',
      resourceId: batchId,
      metadata: { insightCount },
    }),

  // Waitlist actions
  waitlistApproved: (
    session: { user: { id: string; email: string; publisherId: string } } | null,
    waitlistId: string,
    email: string
  ) =>
    auditFromSession(session, 'waitlist.approve', {
      resourceType: 'waitlist',
      resourceId: waitlistId,
      resourceName: email,
    }),

  waitlistRejected: (
    session: { user: { id: string; email: string; publisherId: string } } | null,
    waitlistId: string,
    email: string
  ) =>
    auditFromSession(session, 'waitlist.reject', {
      resourceType: 'waitlist',
      resourceId: waitlistId,
      resourceName: email,
    }),

  // Team actions
  teamInviteCreated: (
    session: { user: { id: string; email: string; publisherId: string } } | null,
    inviteId: string,
    invitedEmail: string,
    role: string
  ) =>
    auditFromSession(session, 'team.invite_create', {
      resourceType: 'invitation',
      resourceId: inviteId,
      resourceName: invitedEmail,
      metadata: { role },
    }),

  // User actions
  userLogin: (userId: string, email: string, publisherId: string) =>
    createAuditLog({
      userId,
      userEmail: email,
      publisherId,
      action: 'user.login',
      resourceType: 'user',
      resourceId: userId,
      resourceName: email,
    }),

  userRegistered: (userId: string, email: string, publisherId: string) =>
    createAuditLog({
      userId,
      userEmail: email,
      publisherId,
      action: 'user.register',
      resourceType: 'user',
      resourceId: userId,
      resourceName: email,
    }),
};
