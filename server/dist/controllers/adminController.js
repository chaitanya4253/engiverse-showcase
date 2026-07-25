"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogsAdmin = exports.createUserAdmin = exports.getAllUsersAdmin = exports.updateSiteConfigAdmin = exports.getSiteConfigAdmin = exports.updateInquiryStatus = exports.getAllInquiriesAdmin = exports.deleteKit = exports.updateKit = exports.createKit = exports.getAllKitsAdmin = exports.deleteProject = exports.updateProject = exports.createProject = exports.getAllProjectsAdmin = exports.deleteService = exports.updateService = exports.createService = exports.getAllServicesAdmin = exports.getDashboardStats = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../db/database");
const auditLogger_1 = require("../middleware/auditLogger");
// 1. Dashboard Overview Statistics
const getDashboardStats = async (req, res) => {
    try {
        const servicesCount = await (0, database_1.dbGet)('SELECT COUNT(*) as count FROM services');
        const projectsCount = await (0, database_1.dbGet)('SELECT COUNT(*) as count FROM projects');
        const kitsCount = await (0, database_1.dbGet)('SELECT COUNT(*) as count FROM trainer_kits');
        const inquiriesCount = await (0, database_1.dbGet)('SELECT COUNT(*) as count FROM inquiries');
        const newInquiriesCount = await (0, database_1.dbGet)("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'");
        const auditLogsCount = await (0, database_1.dbGet)('SELECT COUNT(*) as count FROM audit_logs');
        const usersCount = await (0, database_1.dbGet)('SELECT COUNT(*) as count FROM users');
        return res.json({
            services: servicesCount?.count || 0,
            projects: projectsCount?.count || 0,
            kits: kitsCount?.count || 0,
            totalInquiries: inquiriesCount?.count || 0,
            newInquiries: newInquiriesCount?.count || 0,
            auditLogs: auditLogsCount?.count || 0,
            users: usersCount?.count || 0
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to load dashboard statistics.' });
    }
};
exports.getDashboardStats = getDashboardStats;
// 2. Services Management
const getAllServicesAdmin = async (req, res) => {
    try {
        const services = await (0, database_1.dbAll)('SELECT * FROM services ORDER BY sort_order ASC, id ASC');
        return res.json({ services });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to fetch services.' });
    }
};
exports.getAllServicesAdmin = getAllServicesAdmin;
const createService = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { title, slug, category, description, features_json, price_range, sort_order } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ error: 'Title, category, and description are required.' });
        }
        const sSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const result = await (0, database_1.dbRun)(`INSERT INTO services (title, slug, category, description, features_json, price_range, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [title, sSlug, category, description, JSON.stringify(features_json || []), price_range || '', sort_order || 0]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'CREATE_SERVICE',
            details: `Created new service '${title}' (ID: ${result.lastID})`,
            ipAddress,
            userAgent
        });
        return res.status(201).json({ message: 'Service created successfully.', id: result.lastID });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to create service.' });
    }
};
exports.createService = createService;
const updateService = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { id } = req.params;
        const { title, category, description, features_json, price_range, is_active, sort_order } = req.body;
        await (0, database_1.dbRun)(`UPDATE services SET title = ?, category = ?, description = ?, features_json = ?, price_range = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [title, category, description, JSON.stringify(features_json || []), price_range, is_active ? 1 : 0, sort_order, id]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'UPDATE_SERVICE',
            details: `Updated service ID ${id} '${title}'`,
            ipAddress,
            userAgent
        });
        return res.json({ message: 'Service updated successfully.' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to update service.' });
    }
};
exports.updateService = updateService;
const deleteService = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { id } = req.params;
        await (0, database_1.dbRun)('DELETE FROM services WHERE id = ?', [id]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'DELETE_SERVICE',
            details: `Deleted service ID ${id}`,
            ipAddress,
            userAgent,
            severity: 'warning'
        });
        return res.json({ message: 'Service deleted.' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to delete service.' });
    }
};
exports.deleteService = deleteService;
// 3. Projects Management (Diploma & Engineering Projects)
const getAllProjectsAdmin = async (req, res) => {
    try {
        const projects = await (0, database_1.dbAll)('SELECT * FROM projects ORDER BY id DESC');
        return res.json({ projects });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to fetch projects.' });
    }
};
exports.getAllProjectsAdmin = getAllProjectsAdmin;
const createProject = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { title, category, short_desc, full_desc, technologies_json, image_url, demo_url, features_json, featured } = req.body;
        if (!title || !category || !short_desc) {
            return res.status(400).json({ error: 'Title, category, and short description are required.' });
        }
        const result = await (0, database_1.dbRun)(`INSERT INTO projects (title, category, short_desc, full_desc, technologies_json, image_url, demo_url, features_json, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            title,
            category,
            short_desc,
            full_desc || short_desc,
            JSON.stringify(technologies_json || []),
            image_url || '',
            demo_url || '',
            JSON.stringify(features_json || []),
            featured ? 1 : 0
        ]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'CREATE_PROJECT',
            details: `Created new project '${title}' (ID: ${result.lastID})`,
            ipAddress,
            userAgent
        });
        return res.status(201).json({ message: 'Project created successfully.', id: result.lastID });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to create project.' });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { id } = req.params;
        const { title, category, short_desc, full_desc, technologies_json, image_url, demo_url, features_json, featured, is_active } = req.body;
        await (0, database_1.dbRun)(`UPDATE projects SET title = ?, category = ?, short_desc = ?, full_desc = ?, technologies_json = ?, image_url = ?, demo_url = ?, features_json = ?, featured = ?, is_active = ? WHERE id = ?`, [
            title,
            category,
            short_desc,
            full_desc,
            JSON.stringify(technologies_json || []),
            image_url,
            demo_url,
            JSON.stringify(features_json || []),
            featured ? 1 : 0,
            is_active ? 1 : 0,
            id
        ]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'UPDATE_PROJECT',
            details: `Updated project ID ${id} '${title}'`,
            ipAddress,
            userAgent
        });
        return res.json({ message: 'Project updated successfully.' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to update project.' });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { id } = req.params;
        await (0, database_1.dbRun)('DELETE FROM projects WHERE id = ?', [id]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'DELETE_PROJECT',
            details: `Deleted project ID ${id}`,
            ipAddress,
            userAgent,
            severity: 'warning'
        });
        return res.json({ message: 'Project deleted.' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to delete project.' });
    }
};
exports.deleteProject = deleteProject;
// 4. Electronics Trainer Kits Management
const getAllKitsAdmin = async (req, res) => {
    try {
        const kits = await (0, database_1.dbAll)('SELECT * FROM trainer_kits ORDER BY id DESC');
        return res.json({ kits });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to fetch electronics trainer kits.' });
    }
};
exports.getAllKitsAdmin = getAllKitsAdmin;
const createKit = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { title, subtitle, category, description, features_json, specs_json, status, image_url } = req.body;
        if (!title || !category || !description) {
            return res.status(400).json({ error: 'Title, category, and description are required.' });
        }
        const result = await (0, database_1.dbRun)(`INSERT INTO trainer_kits (title, subtitle, category, description, features_json, specs_json, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            title,
            subtitle || '',
            category,
            description,
            JSON.stringify(features_json || []),
            JSON.stringify(specs_json || {}),
            status || 'coming_soon',
            image_url || ''
        ]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'CREATE_TRAINER_KIT',
            details: `Created new electronics trainer kit '${title}' (ID: ${result.lastID})`,
            ipAddress,
            userAgent
        });
        return res.status(201).json({ message: 'Trainer kit created successfully.', id: result.lastID });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to create trainer kit.' });
    }
};
exports.createKit = createKit;
const updateKit = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { id } = req.params;
        const { title, subtitle, category, description, features_json, specs_json, status, image_url } = req.body;
        await (0, database_1.dbRun)(`UPDATE trainer_kits SET title = ?, subtitle = ?, category = ?, description = ?, features_json = ?, specs_json = ?, status = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [
            title,
            subtitle,
            category,
            description,
            JSON.stringify(features_json || []),
            JSON.stringify(specs_json || {}),
            status,
            image_url,
            id
        ]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'UPDATE_TRAINER_KIT',
            details: `Updated kit ID ${id} '${title}'`,
            ipAddress,
            userAgent
        });
        return res.json({ message: 'Trainer kit updated successfully.' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to update trainer kit.' });
    }
};
exports.updateKit = updateKit;
const deleteKit = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { id } = req.params;
        await (0, database_1.dbRun)('DELETE FROM trainer_kits WHERE id = ?', [id]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'DELETE_TRAINER_KIT',
            details: `Deleted trainer kit ID ${id}`,
            ipAddress,
            userAgent,
            severity: 'warning'
        });
        return res.json({ message: 'Trainer kit deleted.' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to delete trainer kit.' });
    }
};
exports.deleteKit = deleteKit;
// 5. Inquiries & Leads Management
const getAllInquiriesAdmin = async (req, res) => {
    try {
        const inquiries = await (0, database_1.dbAll)('SELECT * FROM inquiries ORDER BY created_at DESC');
        return res.json({ inquiries });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to fetch inquiries.' });
    }
};
exports.getAllInquiriesAdmin = getAllInquiriesAdmin;
const updateInquiryStatus = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { id } = req.params;
        const { status } = req.body;
        await (0, database_1.dbRun)('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'UPDATE_INQUIRY_STATUS',
            details: `Inquiry ID ${id} marked as '${status}'`,
            ipAddress,
            userAgent
        });
        return res.json({ message: 'Inquiry status updated.' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to update inquiry status.' });
    }
};
exports.updateInquiryStatus = updateInquiryStatus;
// 6. Site Config Management (Hero text, Contact Info, Instagram, Custom Theme)
const getSiteConfigAdmin = async (req, res) => {
    try {
        const rows = await (0, database_1.dbAll)('SELECT * FROM site_config');
        const configMap = {};
        for (const r of rows) {
            try {
                configMap[r.key] = JSON.parse(r.value);
            }
            catch {
                configMap[r.key] = r.value;
            }
        }
        return res.json({ config: configMap });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to load site configuration.' });
    }
};
exports.getSiteConfigAdmin = getSiteConfigAdmin;
const updateSiteConfigAdmin = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { configMap } = req.body;
        if (!configMap || typeof configMap !== 'object') {
            return res.status(400).json({ error: 'Invalid configuration payload.' });
        }
        for (const [key, value] of Object.entries(configMap)) {
            const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
            await (0, database_1.dbRun)('INSERT OR REPLACE INTO site_config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)', [key, valStr]);
        }
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'UPDATE_SITE_CONFIG',
            details: 'Updated global site branding, contact numbers, email addresses, or theme',
            ipAddress,
            userAgent,
            severity: 'warning'
        });
        return res.json({ message: 'Site configuration updated successfully.' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to update site configuration.' });
    }
};
exports.updateSiteConfigAdmin = updateSiteConfigAdmin;
// 7. Users Management (RBAC)
const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await (0, database_1.dbAll)('SELECT id, username, email, role, is_active, last_login, created_at FROM users ORDER BY id ASC');
        return res.json({ users });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to fetch users.' });
    }
};
exports.getAllUsersAdmin = getAllUsersAdmin;
const createUserAdmin = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }
        const pwdHash = await bcryptjs_1.default.hash(password, 12);
        const userRole = role || 'Admin';
        const result = await (0, database_1.dbRun)('INSERT INTO users (username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)', [username.trim(), email.trim().toLowerCase(), pwdHash, userRole]);
        await (0, auditLogger_1.logAuditEvent)({
            userId: req.user?.id,
            username: req.user?.username,
            action: 'CREATE_USER',
            details: `Created new admin user '${username}' with role '${userRole}'`,
            ipAddress,
            userAgent,
            severity: 'warning'
        });
        return res.status(201).json({ message: 'User created successfully.', id: result.lastID });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to create user. Ensure username and email are unique.' });
    }
};
exports.createUserAdmin = createUserAdmin;
// 8. Audit Logs Querying
const getAuditLogsAdmin = async (req, res) => {
    try {
        const logs = await (0, database_1.dbAll)('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200');
        return res.json({ logs });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to fetch audit logs.' });
    }
};
exports.getAuditLogsAdmin = getAuditLogsAdmin;
