import { Request } from 'express';
import { dbRun } from '../db/database';

export async function logAuditEvent(params: {
  userId?: number;
  username?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  severity?: 'info' | 'warning' | 'critical';
}) {
  try {
    const {
      userId = null,
      username = 'Anonymous/System',
      action,
      details = '',
      ipAddress = '127.0.0.1',
      userAgent = 'Unknown',
      severity = 'info'
    } = params;

    await dbRun(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address, user_agent, severity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, username, action, details, ipAddress, userAgent, severity]
    );
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

export function extractClientMeta(req: Request) {
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  return { ipAddress, userAgent };
}
