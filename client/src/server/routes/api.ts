import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as adminController from '../controllers/adminController';
import * as publicController from '../controllers/publicController';
import { authenticateToken, requireRole, loginRateLimiter, apiRateLimiter, sanitizeInputs } from '../middleware/auth';

const router = Router();

// Apply sanitization to all API requests
router.use(sanitizeInputs);

// ------------------------------------
// PUBLIC ENDPOINTS
// ------------------------------------
router.get('/public/config', publicController.getSiteConfigPublic);
router.get('/public/services', publicController.getServicesPublic);
router.get('/public/projects', publicController.getProjectsPublic);
router.get('/public/kits', publicController.getKitsPublic);
router.post('/public/inquire', publicController.submitInquiry);
router.post('/public/inquiries', publicController.submitInquiry);

// Setup & Authentication Endpoints
router.get('/auth/setup-status', authController.checkSetupStatus);
router.post('/auth/setup', loginRateLimiter, authController.initialSetup);
router.post('/auth/login', loginRateLimiter, authController.login);
router.post('/auth/logout', authenticateToken, authController.logout);
router.get('/auth/me', authenticateToken, authController.getMe);
router.post('/auth/change-password', authenticateToken, authController.changePassword);

// ------------------------------------
// PROTECTED ADMIN ENDPOINTS (RBAC Enforced)
// ------------------------------------
const adminAuth = [authenticateToken, requireRole(['Super Admin', 'Admin', 'Editor'])];
const superAdminAuth = [authenticateToken, requireRole(['Super Admin'])];

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

export default router;
