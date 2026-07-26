import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbAll, dbGet, dbRun, inMemoryInquiries } from '../db/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent, extractClientMeta } from '../middleware/auditLogger';

// 1. Dashboard Overview Statistics
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const servicesCount = await dbGet('SELECT COUNT(*) as count FROM services');
    const projectsCount = await dbGet('SELECT COUNT(*) as count FROM projects');
    const kitsCount = await dbGet('SELECT COUNT(*) as count FROM trainer_kits');
    const inquiriesCount = await dbGet('SELECT COUNT(*) as count FROM inquiries');
    const newInquiriesCount = await dbGet("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'");
    const auditLogsCount = await dbGet('SELECT COUNT(*) as count FROM audit_logs');
    const usersCount = await dbGet('SELECT COUNT(*) as count FROM users');

    return res.json({
      services: servicesCount?.count || 0,
      projects: projectsCount?.count || 0,
      kits: kitsCount?.count || 0,
      totalInquiries: inquiriesCount?.count || 0,
      newInquiries: newInquiriesCount?.count || 0,
      auditLogs: auditLogsCount?.count || 0,
      users: usersCount?.count || 0
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load dashboard statistics.' });
  }
};

// 2. Services Management
export const getAllServicesAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const services = await dbAll('SELECT * FROM services ORDER BY sort_order ASC, id ASC');
    return res.json({ services });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch services.' });
  }
};

export const createService = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { title, slug, category, description, features_json, price_range, sort_order } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, category, and description are required.' });
    }

    const sSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = await dbRun(
      `INSERT INTO services (title, slug, category, description, features_json, price_range, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, sSlug, category, description, JSON.stringify(features_json || []), price_range || '', sort_order || 0]
    );

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'CREATE_SERVICE',
      details: `Created new service '${title}' (ID: ${result.lastID})`,
      ipAddress,
      userAgent
    });

    return res.status(201).json({ message: 'Service created successfully.', id: result.lastID });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create service.' });
  }
};

export const updateService = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { id } = req.params;
    const { title, category, description, features_json, price_range, is_active, sort_order } = req.body;

    await dbRun(
      `UPDATE services SET title = ?, category = ?, description = ?, features_json = ?, price_range = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, category, description, JSON.stringify(features_json || []), price_range, is_active ? 1 : 0, sort_order, id]
    );

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'UPDATE_SERVICE',
      details: `Updated service ID ${id} '${title}'`,
      ipAddress,
      userAgent
    });

    return res.json({ message: 'Service updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update service.' });
  }
};

export const deleteService = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM services WHERE id = ?', [id]);

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'DELETE_SERVICE',
      details: `Deleted service ID ${id}`,
      ipAddress,
      userAgent,
      severity: 'warning'
    });

    return res.json({ message: 'Service deleted.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete service.' });
  }
};

// 3. Projects Management (Diploma & Engineering Projects)
export const getAllProjectsAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projects = await dbAll('SELECT * FROM projects ORDER BY id DESC');
    return res.json({ projects });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch projects.' });
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { title, category, short_desc, full_desc, technologies_json, image_url, demo_url, features_json, featured } = req.body;

    if (!title || !category || !short_desc) {
      return res.status(400).json({ error: 'Title, category, and short description are required.' });
    }

    const result = await dbRun(
      `INSERT INTO projects (title, category, short_desc, full_desc, technologies_json, image_url, demo_url, features_json, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category,
        short_desc,
        full_desc || short_desc,
        JSON.stringify(technologies_json || []),
        image_url || '',
        demo_url || '',
        JSON.stringify(features_json || []),
        featured ? 1 : 0
      ]
    );

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'CREATE_PROJECT',
      details: `Created new project '${title}' (ID: ${result.lastID})`,
      ipAddress,
      userAgent
    });

    return res.status(201).json({ message: 'Project created successfully.', id: result.lastID });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create project.' });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { id } = req.params;
    const { title, category, short_desc, full_desc, technologies_json, image_url, demo_url, features_json, featured, is_active } = req.body;

    await dbRun(
      `UPDATE projects SET title = ?, category = ?, short_desc = ?, full_desc = ?, technologies_json = ?, image_url = ?, demo_url = ?, features_json = ?, featured = ?, is_active = ? WHERE id = ?`,
      [
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
      ]
    );

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'UPDATE_PROJECT',
      details: `Updated project ID ${id} '${title}'`,
      ipAddress,
      userAgent
    });

    return res.json({ message: 'Project updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update project.' });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM projects WHERE id = ?', [id]);

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'DELETE_PROJECT',
      details: `Deleted project ID ${id}`,
      ipAddress,
      userAgent,
      severity: 'warning'
    });

    return res.json({ message: 'Project deleted.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
};

// 4. Electronics Trainer Kits Management
export const getAllKitsAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const kits = await dbAll('SELECT * FROM trainer_kits ORDER BY id DESC');
    return res.json({ kits });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch electronics trainer kits.' });
  }
};

export const createKit = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { title, subtitle, category, description, features_json, specs_json, status, image_url } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required.' });
    }

    const result = await dbRun(
      `INSERT INTO trainer_kits (title, subtitle, category, description, features_json, specs_json, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        subtitle || '',
        category,
        description,
        JSON.stringify(features_json || []),
        JSON.stringify(specs_json || {}),
        status || 'coming_soon',
        image_url || ''
      ]
    );

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'CREATE_TRAINER_KIT',
      details: `Created new electronics trainer kit '${title}' (ID: ${result.lastID})`,
      ipAddress,
      userAgent
    });

    return res.status(201).json({ message: 'Trainer kit created successfully.', id: result.lastID });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create trainer kit.' });
  }
};

export const updateKit = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { id } = req.params;
    const { title, subtitle, category, description, features_json, specs_json, status, image_url } = req.body;

    await dbRun(
      `UPDATE trainer_kits SET title = ?, subtitle = ?, category = ?, description = ?, features_json = ?, specs_json = ?, status = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        title,
        subtitle,
        category,
        description,
        JSON.stringify(features_json || []),
        JSON.stringify(specs_json || {}),
        status,
        image_url,
        id
      ]
    );

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'UPDATE_TRAINER_KIT',
      details: `Updated kit ID ${id} '${title}'`,
      ipAddress,
      userAgent
    });

    return res.json({ message: 'Trainer kit updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update trainer kit.' });
  }
};

export const deleteKit = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM trainer_kits WHERE id = ?', [id]);

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'DELETE_TRAINER_KIT',
      details: `Deleted trainer kit ID ${id}`,
      ipAddress,
      userAgent,
      severity: 'warning'
    });

    return res.json({ message: 'Trainer kit deleted.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete trainer kit.' });
  }
};

// 5. Inquiries & Leads Management
export const getAllInquiriesAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dbInquiries = await dbAll('SELECT * FROM inquiries ORDER BY created_at DESC');
    const combinedMap = new Map();
    for (const inq of [...inMemoryInquiries, ...dbInquiries]) {
      const key = `${inq.client_name}_${inq.phone}_${inq.id}`;
      if (!combinedMap.has(key)) {
        combinedMap.set(key, inq);
      }
    }
    return res.json({ inquiries: Array.from(combinedMap.values()) });
  } catch (err: any) {
    return res.json({ inquiries: inMemoryInquiries });
  }
};

export const updateInquiryStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { id } = req.params;
    const { status } = req.body;

    await dbRun('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'UPDATE_INQUIRY_STATUS',
      details: `Inquiry ID ${id} marked as '${status}'`,
      ipAddress,
      userAgent
    });

    return res.json({ message: 'Inquiry status updated.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update inquiry status.' });
  }
};

export const deleteInquiry = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM inquiries WHERE id = ?', [id]);

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'DELETE_INQUIRY',
      details: `Deleted lead / spam inquiry ID ${id}`,
      ipAddress,
      userAgent,
      severity: 'warning'
    });

    return res.json({ message: 'Inquiry deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
};

// 6. Site Config Management (Hero text, Contact Info, Instagram, Custom Theme)
export const getSiteConfigAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rows = await dbAll('SELECT * FROM site_config');
    const configMap: Record<string, any> = {};
    for (const r of rows) {
      try {
        configMap[r.key] = JSON.parse(r.value);
      } catch {
        configMap[r.key] = r.value;
      }
    }
    return res.json({ config: configMap });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load site configuration.' });
  }
};

export const updateSiteConfigAdmin = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { configMap } = req.body;
    if (!configMap || typeof configMap !== 'object') {
      return res.status(400).json({ error: 'Invalid configuration payload.' });
    }

    for (const [key, value] of Object.entries(configMap)) {
      const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
      await dbRun(
        'INSERT OR REPLACE INTO site_config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [key, valStr]
      );
    }

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'UPDATE_SITE_CONFIG',
      details: 'Updated global site branding, contact numbers, email addresses, or theme',
      ipAddress,
      userAgent,
      severity: 'warning'
    });

    return res.json({ message: 'Site configuration updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update site configuration.' });
  }
};

// 7. Users Management (RBAC)
export const getAllUsersAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await dbAll('SELECT id, username, email, role, is_active, last_login, created_at FROM users ORDER BY id ASC');
    return res.json({ users });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

export const createUserAdmin = async (req: AuthenticatedRequest, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    const pwdHash = await bcrypt.hash(password, 12);
    const userRole = role || 'Admin';

    const result = await dbRun(
      'INSERT INTO users (username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)',
      [username.trim(), email.trim().toLowerCase(), pwdHash, userRole]
    );

    await logAuditEvent({
      userId: req.user?.id,
      username: req.user?.username,
      action: 'CREATE_USER',
      details: `Created new admin user '${username}' with role '${userRole}'`,
      ipAddress,
      userAgent,
      severity: 'warning'
    });

    return res.status(201).json({ message: 'User created successfully.', id: result.lastID });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create user. Ensure username and email are unique.' });
  }
};

// 8. Audit Logs Querying
export const getAuditLogsAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await dbAll('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200');
    return res.json({ logs });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
};
