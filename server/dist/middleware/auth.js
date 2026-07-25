"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInputs = exports.apiRateLimiter = exports.loginRateLimiter = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const JWT_SECRET = process.env.JWT_SECRET || 'engiverse_super_secret_jwt_key_9405456978_8010895511_8788705811';
// 1. JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    let token = undefined;
    // Check HttpOnly cookie first, then Authorization Header
    if (req.cookies && req.cookies.engiverse_token) {
        token = req.cookies.engiverse_token;
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ error: 'Access denied. Authentication token missing or invalid.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Session expired or token invalid. Please log in again.' });
    }
};
exports.authenticateToken = authenticateToken;
// 2. Role-Based Access Control (RBAC) Middleware
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: `Forbidden. Requires one of roles: [${allowedRoles.join(', ')}]` });
        }
        next();
    };
};
exports.requireRole = requireRole;
// 3. Strict Rate Limiters
exports.loginRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 failed login attempts per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts from this IP. Please try again after 15 minutes.' }
});
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Rate limit exceeded. Please slow down your requests.' }
});
// 4. Input Sanitization Middleware (XSS & Injection Protection)
const sanitizeInputs = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
        sanitizeObject(req.query);
    }
    next();
};
exports.sanitizeInputs = sanitizeInputs;
function sanitizeObject(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = (0, sanitize_html_1.default)(obj[key], {
                allowedTags: [],
                allowedAttributes: {}
            }).trim();
        }
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
        }
    }
}
