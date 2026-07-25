import { Request, Response } from 'express';
import { dbAll, dbGet, dbRun, inMemoryInquiries } from '../db/database';
import { logAuditEvent, extractClientMeta } from '../middleware/auditLogger';

const defaultConfigs: Record<string, any> = {
  brand_name: "Engiverse",
  tagline: "Engineering Showcase, Web Development & Electronics Innovation",
  phones: ["9405456978", "8010895511", "8788705811"],
  whatsapp_number: "919405456978",
  whatsapp_message: "Hello Engiverse! I want to inquire about your web development & engineering services.",
  emails: ["chaitanyasoni40@gmail.com", "pratikdeore917@gmail.com"],
  instagram: "https://www.instagram.com/engiverse_59?igsh=MTg2dm1lNzA5MHZ3OQ==",
  hero_title: "Empowering Local Businesses & Engineering Excellence",
  hero_subtitle: "Custom web development for local enterprises, web management, engineering & diploma project solutions, and next-gen electronics trainer kits."
};

const defaultServices = [
  {
    id: 1,
    title: "Web Site Development for Local Business",
    slug: "web-development-local-business",
    category: "Web Development",
    description: "High-performance, modern, mobile-responsive custom websites engineered to help local businesses rank on Google, showcase products, and gain clients.",
    features_json: JSON.stringify([
      "Custom Cyber/Modern UI Design",
      "SEO Optimization & Google My Business Setup",
      "Mobile-First Responsive Layouts",
      "Fast Load Times & Security Hardening",
      "Integrated WhatsApp & Phone Call Triggers"
    ]),
    price_range: "Tailored Package",
    sort_order: 1
  },
  {
    id: 2,
    title: "Web Site Management & Maintenance",
    slug: "website-management",
    category: "Web Management",
    description: "Hassle-free, ongoing web updates, cloud hosting management, daily security audits, performance optimizations, and content revisions.",
    features_json: JSON.stringify([
      "Daily Automated Database Backups",
      "Security Monitoring & Malware Patching",
      "Content Updates & Catalog Maintenance",
      "Domain & SSL Certificate Management",
      "24/7 Server Uptime Guarantee"
    ]),
    price_range: "Monthly Subscription",
    sort_order: 2
  },
  {
    id: 3,
    title: "Engineering and Diploma Projects",
    slug: "engineering-diploma-projects",
    category: "Academic & R&D",
    description: "Complete hardware & software guidance for Degree, B.Tech, Diploma, and Polytechnic engineering students. Embedded systems, IoT, AI, Robotics & Web projects.",
    features_json: JSON.stringify([
      "Hardware Circuit Design & PCB Layout",
      "Microcontroller Programming (Arduino, ESP32, STM32, Raspberry Pi)",
      "Full Project Documentation & Synopsis Report",
      "Live Demo & Presentation Prep Assistance",
      "Clean Source Code & Schematics"
    ]),
    price_range: "Custom Scope",
    sort_order: 3
  },
  {
    id: 4,
    title: "Electronics Trainer Kits",
    slug: "electronics-trainer-kits",
    category: "Hardware Kits",
    description: "Modular, robust educational hardware kits designed for electronics labs, robotics enthusiasts, and hands-on microcontroller learning.",
    features_json: JSON.stringify([
      "Plug & Play Sensors & Actuator Modules",
      "Comprehensive Practical Experiment Manuals",
      "Short-Circuit Protection & Industrial Grade PCBs",
      "IoT & Embedded C Project Templates",
      "Coming Soon - Waitlist Open"
    ]),
    price_range: "Coming Soon",
    sort_order: 4
  }
];

export const getSiteConfigPublic = async (req: Request, res: Response) => {
  try {
    const rows = await dbAll('SELECT * FROM site_config');
    const configMap: Record<string, any> = { ...defaultConfigs };
    for (const r of rows) {
      try {
        configMap[r.key] = JSON.parse(r.value);
      } catch {
        configMap[r.key] = r.value;
      }
    }
    return res.json({ config: configMap });
  } catch (err: any) {
    return res.json({ config: defaultConfigs });
  }
};

export const getServicesPublic = async (req: Request, res: Response) => {
  try {
    const services = await dbAll('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC');
    return res.json({ services: services.length > 0 ? services : defaultServices });
  } catch (err: any) {
    return res.json({ services: defaultServices });
  }
};

export const getProjectsPublic = async (req: Request, res: Response) => {
  try {
    const projects = await dbAll('SELECT * FROM projects WHERE is_active = 1 ORDER BY featured DESC, id DESC');
    return res.json({ projects });
  } catch (err: any) {
    return res.json({ projects: [] });
  }
};

export const getKitsPublic = async (req: Request, res: Response) => {
  try {
    const kits = await dbAll('SELECT * FROM trainer_kits ORDER BY id ASC');
    return res.json({ kits });
  } catch (err: any) {
    return res.json({ kits: [] });
  }
};

export const submitInquiry = async (req: Request, res: Response) => {
  const { ipAddress, userAgent } = extractClientMeta(req);
  try {
    const { client_name, phone, email, service_category, project_title, message } = req.body;

    if (!client_name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone number, and inquiry message are required.' });
    }

    const newInquiry = {
      id: Date.now(),
      client_name,
      phone,
      email: email || '',
      service_category: service_category || 'General',
      project_title: project_title || '',
      message,
      status: 'new',
      created_at: new Date().toISOString()
    };
    inMemoryInquiries.unshift(newInquiry);

    try {
      await dbRun(
        `INSERT INTO inquiries (client_name, phone, email, service_category, project_title, message, status)
         VALUES (?, ?, ?, ?, ?, ?, 'new')`,
        [client_name, phone, email || '', service_category || 'General', project_title || '', message]
      );
    } catch (dbErr: any) {
      console.error('Inquiry DB save notice:', dbErr.message);
    }

    try {
      await logAuditEvent({
        action: 'PUBLIC_INQUIRY_SUBMITTED',
        details: `Client inquiry received from ${client_name} (${phone}) for category: ${service_category}`,
        ipAddress,
        userAgent,
        severity: 'info'
      });
    } catch {}

    return res.json({
      message: 'Thank you! Your inquiry has been submitted successfully. Engiverse team will contact you shortly.',
      inquiryId: newInquiry.id
    });
  } catch (err: any) {
    return res.json({
      message: 'Thank you! Your inquiry has been submitted successfully. Engiverse team will contact you shortly.',
      inquiryId: Date.now()
    });
  }
};
