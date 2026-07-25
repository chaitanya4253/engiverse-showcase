"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditEvent = logAuditEvent;
exports.extractClientMeta = extractClientMeta;
const database_1 = require("../db/database");
async function logAuditEvent(params) {
    try {
        const { userId = null, username = 'Anonymous/System', action, details = '', ipAddress = '127.0.0.1', userAgent = 'Unknown', severity = 'info' } = params;
        await (0, database_1.dbRun)(`INSERT INTO audit_logs (user_id, username, action, details, ip_address, user_agent, severity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [userId, username, action, details, ipAddress, userAgent, severity]);
    }
    catch (err) {
        console.error('Failed to write audit log:', err);
    }
}
function extractClientMeta(req) {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    return { ipAddress, userAgent };
}
