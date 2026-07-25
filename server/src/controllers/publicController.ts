import { Request, Response } from 'express';
import { dbAll, dbGet, dbRun } from '../db/database';
import { logAuditEvent, extractClientMeta } from '../middleware/auditLogger';

export const getSiteConfigPublic = async (req: Request, res: Response) => {
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
    return res.status(500).json({ error: 'Failed to fetch public site configuration.' });
  }
};

export const getServicesPublic = async (req: Request, res: Response) => {
  try {
    const services = await dbAll('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC');
    return res.json({ services });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch active services.' });
  }
};

export const getProjectsPublic = async (req: Request, res: Response) => {
  try {
    const projects = await dbAll('SELECT * FROM projects WHERE is_active = 1 ORDER BY featured DESC, id DESC');
    return res.json({ projects });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch projects.' });
  }
};

export const getKitsPublic = async (req: Request, res: Response) => {
  try {
    const kits = await dbAll('SELECT * FROM trainer_kits ORDER BY id ASC');
    return res.json({ kits });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch electronics trainer kits.' });
  }
};

export const submitInquiry = async (req: Request, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { client_name, phone, email, service_category, project_title, message } = req.body;

    if (!client_name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone number, and inquiry message are required.' });
    }

    const result = await dbRun(
      `INSERT INTO inquiries (client_name, phone, email, service_category, project_title, message, status)
       VALUES (?, ?, ?, ?, ?, ?, 'new')`,
      [client_name, phone, email || '', service_category || 'General Web & Engineering Inquiry', project_title || '', message]
    );

    await logAuditEvent({
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
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
};
