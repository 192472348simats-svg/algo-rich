/**
 * Admin Audit Logging Utility
 *
 * Logs administrative actions to the database (AdminAuditLog table) for
 * security, accountability, and GDPR compliance.
 *
 * Falls back to console.error on DB failure — never let audit logging
 * crash a user-facing admin operation.
 */

import prisma from "./prisma";

interface AuditEntry {
  adminId: string;
  action: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

function sanitizeMetadata(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    // Prevent prototype pollution
    if (key === '__proto__' || key === 'constructor') return undefined;
    // Truncate strings
    if (typeof value === 'string' && value.length > 1000) {
      return value.substring(0, 1000) + '...[truncated]';
    }
    return value;
  }));
}

export async function logAdminAction(entry: AuditEntry): Promise<void> {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId: entry.adminId,
        action: entry.action,
        targetId: entry.targetId ?? null,
        metadata: sanitizeMetadata(entry.metadata) ?? undefined,
        // Cap lengths to fit schema constraints and prevent surprises
        ipAddress: entry.ipAddress?.substring(0, 45) ?? null,   // max IPv6 length
        userAgent: entry.userAgent?.substring(0, 255) ?? null,
      },
    });
  } catch (error) {
    // Graceful fallback — don't break the admin action just because audit failed
    console.error("[ADMIN AUDIT FAILED]", {
      error: error instanceof Error ? error.message : "Unknown error",
      entry: JSON.stringify(entry),
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Extract IP and user-agent from a NextRequest / standard Request.
 * Use this in API route handlers to populate ipAddress and userAgent.
 *
 * @example
 * const { ip, userAgent } = getClientInfo(req);
 * await logAdminAction({ adminId, action: 'problem_deleted', targetId, ip, userAgent });
 */
export function getClientInfo(req: Request): { ip: string; userAgent: string } {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const userAgent = req.headers.get('user-agent') ?? 'unknown';
  return { ip, userAgent };
}
