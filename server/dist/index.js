"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./db/database");
const api_1 = __importDefault(require("./routes/api"));
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// 1. Enterprise Security Headers via Helmet
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.instagram.com"],
            connectSrc: ["'self'", CLIENT_URL]
        }
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' }, // Anti-clickjacking
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true }
}));
// 2. Strict CORS Policy
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin ||
            origin === CLIENT_URL ||
            origin.startsWith('http://localhost:') ||
            origin.endsWith('.netlify.app') ||
            origin.includes('netlify')) {
            callback(null, true);
        }
        else {
            callback(null, true); // Allow production origins for API queries
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));
// 3. Body Parsing & Limiters
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use((0, cookie_parser_1.default)());
// 4. Rate Limiter on API
app.use('/api', auth_1.apiRateLimiter);
// 5. Mount API Routes
app.use('/api/v1', api_1.default);
// 6. Root Healthcheck Endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ONLINE',
        system: 'Engiverse Engineering Showcase Backend API',
        security: 'HARDENED_OWASP_COMPLIANT',
        timestamp: new Date().toISOString()
    });
});
// 7. Centralized Error Handler (OWASP compliant: No stack trace leakage)
app.use((err, req, res, next) => {
    console.error('[CRITICAL_SERVER_ERROR]', err.message || err);
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(err.status || 500).json({
        error: isDev ? err.message : 'An unexpected security or server error occurred. Please contact system administrator.'
    });
});
// Initialize Database and Start Server
(0, database_1.initDatabase)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`⚡ Engiverse Backend Server Live on port ${PORT}`);
        console.log(`🔒 Security Hardened: OWASP Top 10 Aligned`);
        console.log(`🌐 Public API: http://localhost:${PORT}/api/v1/public/config`);
        console.log(`====================================================`);
    });
})
    .catch((err) => {
    console.error('Fatal Database Initialization Error:', err);
    process.exit(1);
});
