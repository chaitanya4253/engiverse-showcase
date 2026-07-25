"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitInquiry = exports.getKitsPublic = exports.getProjectsPublic = exports.getServicesPublic = exports.getSiteConfigPublic = void 0;
const database_1 = require("../db/database");
const auditLogger_1 = require("../middleware/auditLogger");
const getSiteConfigPublic = async (req, res) => {
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
        return res.status(500).json({ error: 'Failed to fetch public site configuration.' });
    }
};
exports.getSiteConfigPublic = getSiteConfigPublic;
const getServicesPublic = async (req, res) => {
    try {
        const services = await (0, database_1.dbAll)('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC');
        return res.json({ services });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to fetch active services.' });
    }
};
exports.getServicesPublic = getServicesPublic;
const getProjectsPublic = async (req, res) => {
    try {
        const projects = await (0, database_1.dbAll)('SELECT * FROM projects WHERE is_active = 1 ORDER BY featured DESC, id DESC');
        return res.json({ projects });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to fetch projects.' });
    }
};
exports.getProjectsPublic = getProjectsPublic;
const getKitsPublic = async (req, res) => {
    try {
        const kits = await (0, database_1.dbAll)('SELECT * FROM trainer_kits ORDER BY id ASC');
        return res.json({ kits });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to fetch electronics trainer kits.' });
    }
};
exports.getKitsPublic = getKitsPublic;
const submitInquiry = async (req, res) => {
    const { ipAddress, userAgent } = (0, auditLogger_1.extractClientMeta)(req);
    try {
        const { client_name, phone, email, service_category, project_title, message } = req.body;
        if (!client_name || !phone || !message) {
            return res.status(400).json({ error: 'Name, phone number, and inquiry message are required.' });
        }
        const result = await (0, database_1.dbRun)(`INSERT INTO inquiries (client_name, phone, email, service_category, project_title, message, status)
       VALUES (?, ?, ?, ?, ?, ?, 'new')`, [client_name, phone, email || '', service_category || 'General Web & Engineering Inquiry', project_title || '', message]);
        await (0, auditLogger_1.logAuditEvent)({
            action: 'NEW_CLIENT_INQUIRY',
            details: `New inquiry from '${client_name}' (${phone}) for category '${service_category}'`,
            ipAddress,
            userAgent,
            severity: 'info'
        });
        return res.status(201).json({
            message: 'Inquiry submitted successfully. Team Engiverse will get back to you shortly!',
            inquiryId: result.lastID
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to submit inquiry.' });
    }
};
exports.submitInquiry = submitInquiry;
