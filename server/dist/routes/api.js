"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("../controllers/authController"));
const adminController = __importStar(require("../controllers/adminController"));
const publicController = __importStar(require("../controllers/publicController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply sanitization to all API requests
router.use(auth_1.sanitizeInputs);
// ------------------------------------
// PUBLIC ENDPOINTS
// ------------------------------------
router.get('/public/config', publicController.getSiteConfigPublic);
router.get('/public/services', publicController.getServicesPublic);
router.get('/public/projects', publicController.getProjectsPublic);
router.get('/public/kits', publicController.getKitsPublic);
router.post('/public/inquire', publicController.submitInquiry);
// Setup & Authentication Endpoints
router.get('/auth/setup-status', authController.checkSetupStatus);
router.post('/auth/setup', auth_1.loginRateLimiter, authController.initialSetup);
router.post('/auth/login', auth_1.loginRateLimiter, authController.login);
router.post('/auth/logout', auth_1.authenticateToken, authController.logout);
router.get('/auth/me', auth_1.authenticateToken, authController.getMe);
router.post('/auth/change-password', auth_1.authenticateToken, authController.changePassword);
// ------------------------------------
// PROTECTED ADMIN ENDPOINTS (RBAC Enforced)
// ------------------------------------
const adminAuth = [auth_1.authenticateToken, (0, auth_1.requireRole)(['Super Admin', 'Admin', 'Editor'])];
const superAdminAuth = [auth_1.authenticateToken, (0, auth_1.requireRole)(['Super Admin'])];
// Admin Dashboard Overview
router.get('/admin/stats', adminAuth, adminController.getDashboardStats);
// Admin Services CRUD
router.get('/admin/services', adminAuth, adminController.getAllServicesAdmin);
router.post('/admin/services', adminAuth, adminController.createService);
router.put('/admin/services/:id', adminAuth, adminController.updateService);
router.delete('/admin/services/:id', adminAuth, adminController.deleteService);
// Admin Projects CRUD
router.get('/admin/projects', adminAuth, adminController.getAllProjectsAdmin);
router.post('/admin/projects', adminAuth, adminController.createProject);
router.put('/admin/projects/:id', adminAuth, adminController.updateProject);
router.delete('/admin/projects/:id', adminAuth, adminController.deleteProject);
// Admin Electronics Trainer Kits CRUD
router.get('/admin/kits', adminAuth, adminController.getAllKitsAdmin);
router.post('/admin/kits', adminAuth, adminController.createKit);
router.put('/admin/kits/:id', adminAuth, adminController.updateKit);
router.delete('/admin/kits/:id', adminAuth, adminController.deleteKit);
// Admin Inquiries Management
router.get('/admin/inquiries', adminAuth, adminController.getAllInquiriesAdmin);
router.put('/admin/inquiries/:id/status', adminAuth, adminController.updateInquiryStatus);
// Admin Site Config
router.get('/admin/site-config', adminAuth, adminController.getSiteConfigAdmin);
router.post('/admin/site-config', adminAuth, adminController.updateSiteConfigAdmin);
// Admin User Management & Audit Logs
router.get('/admin/users', superAdminAuth, adminController.getAllUsersAdmin);
router.post('/admin/users', superAdminAuth, adminController.createUserAdmin);
router.get('/admin/audit-logs', superAdminAuth, adminController.getAuditLogsAdmin);
exports.default = router;
