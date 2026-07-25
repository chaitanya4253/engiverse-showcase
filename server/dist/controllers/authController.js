"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.logout = exports.getMe = exports.login = exports.initialSetup = exports.checkSetupStatus = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../db/database");
const auditLogger_1 = require("../middleware/auditLogger");
const JWT_SECRET = process.env.JWT_SECRET || 'engiverse_super_secret_jwt_key_9405456978_8010895511_8788705811';
// Password Strength Validator (OWASP compliant)
function validatePasswordPolicy(password) {
    if (password.length < 12) {
        return { valid: false, error: 'Password must be at least 12 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one numeric digit.' };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one special character.' };
    }
    return { valid: true };
}
// Check if initial admin exists
const checkSetupStatus = async (req, res) => {
    try {
        const userCount = await (0, database_1.dbGet)('SELECT COUNT(*) as count FROM users');
        const isConfigured = userCount && userCount.count > 0;
        return res.json({ isConfigured: Boolean(isConfigured) });
    }
    catch (err) {
        return res.status(500).json({ error: 'Internal server error while checking setup status.' });
    }
};
exports.checkSetupStatus = checkSetupStatus;
// Initial Setup Wizard Handler (Web registration disabled for security - Direct DB creation required)
const initialSetup = async (req, res) => {
    return res.status(403).json({
        error: 'Web-based admin account registration is disabled for security compliance. Please run the direct database CLI command: "npm run create-admin" inside the server directory.'
    });
};
exports.initialSetup = initialSetup;
// Admin Login
const login = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: 'Username/Email and password are required.' });
        }
        const user = await (0, database_1.dbGet)(`SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1`, [usernameOrEmail.trim(), usernameOrEmail.trim().toLowerCase()]);
        if (!user) {
            await (0, auditLogger_1.logAuditEvent)({
                action: 'FAILED_LOGIN_ATTEMPT',
                details: `Failed login attempt for identifier: ${usernameOrEmail}`,
                ipAddress,
                userAgent,
                severity: 'warning'
            });
            return res.status(401).json({ error: 'Invalid credentials or inactive account.' });
        }
        const match = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!match) {
            await (0, auditLogger_1.logAuditEvent)({
                userId: user.id,
                username: user.username,
                action: 'FAILED_LOGIN_PASSWORD_MISMATCH',
                details: `Invalid password attempt for username: ${user.username}`,
                ipAddress,
                userAgent,
                severity: 'warning'
            });
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        // Update last_login timestamp
        await (0, database_1.dbRun)(`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`, [user.id]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: user.id,
            username: user.username,
            action: 'SUCCESSFUL_LOGIN',
            details: `User logged in successfully as ${user.role}`,
            ipAddress,
            userAgent,
            severity: 'info'
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        res.cookie('engiverse_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 3600 * 1000
        });
        return res.json({
            message: 'Login successful.',
            user: { id: user.id, username: user.username, email: user.email, role: user.role },
            token
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Authentication error during login.' });
    }
};
exports.login = login;
// Current Logged-in User Info
const getMe = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized.' });
    return res.json({ user: req.user });
};
exports.getMe = getMe;
// Logout
const logout = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    if (req.user) {
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user.id,
            username: req.user.username,
            action: 'LOGOUT',
            details: 'User logged out and session destroyed',
            ipAddress,
            userAgent,
            severity: 'info'
        });
    }
    res.clearCookie('engiverse_token');
    return res.json({ message: 'Logged out successfully.' });
};
exports.logout = logout;
// Change Password
const changePassword = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized.' });
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required.' });
        }
        const user = await (0, database_1.dbGet)('SELECT * FROM users WHERE id = ?', [req.user.id]);
        if (!user)
            return res.status(404).json({ error: 'User account not found.' });
        const match = await bcryptjs_1.default.compare(currentPassword, user.password_hash);
        if (!match) {
            return res.status(400).json({ error: 'Current password does not match.' });
        }
        const pwdCheck = validatePasswordPolicy(newPassword);
        if (!pwdCheck.valid) {
            return res.status(400).json({ error: pwdCheck.error });
        }
        const newHash = await bcryptjs_1.default.hash(newPassword, 12);
        await (0, database_1.dbRun)('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newHash, req.user.id]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user.id,
            username: req.user.username,
            action: 'PASSWORD_CHANGED',
            details: 'User successfully updated password',
            ipAddress,
            userAgent,
            severity: 'critical'
        });
        return res.json({ message: 'Password updated successfully.' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to update password.' });
    }
};
exports.changePassword = changePassword;
