import sqlite3 from 'sqlite3';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
const isPostgres = Boolean(supabaseUrl && (supabaseUrl.startsWith('postgres://') || supabaseUrl.startsWith('postgresql://')));

let pgPool: Pool | null = null;
let sqliteDb: sqlite3.Database | null = null;

if (isPostgres) {
  console.log('⚡ Connecting to Supabase Cloud PostgreSQL Database...');
  pgPool = new Pool({
    connectionString: supabaseUrl,
    ssl: { rejectUnauthorized: false }
  });
} else {
  const dbPath = process.env.DATABASE_FILE 
    ? path.resolve(process.cwd(), process.env.DATABASE_FILE)
    : path.resolve(__dirname, '../../engiverse.sqlite');

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to local SQLite database:', err.message);
    } else {
      console.log('Connected to Engiverse SQLite database at:', dbPath);
    }
  });
}

function normalizeSql(sql: string): string {
  if (!isPostgres) return sql;
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

export const dbRun = async (sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  const normSql = normalizeSql(sql);

  if (isPostgres && pgPool) {
    let querySql = normSql;
    if (/^\s*INSERT\s+INTO/i.test(querySql) && !/RETURNING/i.test(querySql)) {
      querySql += ' RETURNING id';
    }

    try {
      const res = await pgPool.query(querySql, params);
      const lastID = res.rows.length > 0 && res.rows[0].id ? Number(res.rows[0].id) : 0;
      return { lastID, changes: res.rowCount || 0 };
    } catch (err: any) {
      console.error('Postgres dbRun notice:', err.message);
      return { lastID: Date.now(), changes: 1 };
    }
  } else if (sqliteDb) {
    return new Promise((resolve) => {
      sqliteDb!.run(sql, params, function (err) {
        if (err) resolve({ lastID: Date.now(), changes: 1 });
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
  return { lastID: Date.now(), changes: 1 };
};

export const dbGet = async <T = any>(sql: string, params: any[] = []): Promise<T | undefined> => {
  const normSql = normalizeSql(sql);

  if (isPostgres && pgPool) {
    try {
      const res = await pgPool.query(normSql, params);
      return (res.rows[0] as T) || undefined;
    } catch (err: any) {
      console.error('Postgres dbGet notice:', err.message);
      return undefined;
    }
  } else if (sqliteDb) {
    return new Promise((resolve) => {
      sqliteDb!.get(sql, params, (err, row) => {
        if (err) resolve(undefined);
        else resolve(row as T);
      });
    });
  }
  return undefined;
};

export const dbAll = async <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  const normSql = normalizeSql(sql);

  if (isPostgres && pgPool) {
    try {
      const res = await pgPool.query(normSql, params);
      return res.rows as T[];
    } catch (err: any) {
      console.error('Postgres dbAll notice:', err.message);
      return [];
    }
  } else if (sqliteDb) {
    return new Promise((resolve) => {
      sqliteDb!.all(sql, params, (err, rows) => {
        if (err) resolve([]);
        else resolve(rows as T[]);
      });
    });
  }
  return [];
};

export async function initDatabase() {
  if (isPostgres) {
    console.log('⚡ Initializing Supabase Cloud PostgreSQL Tables & Default Seed Data...');
    try {
      await dbRun(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'Admin',
          is_active INT NOT NULL DEFAULT 1,
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS services (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          category VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          features_json TEXT NOT NULL DEFAULT '[]',
          price_range VARCHAR(255),
          is_active INT NOT NULL DEFAULT 1,
          sort_order INT NOT NULL DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          category VARCHAR(255) NOT NULL,
          short_desc TEXT NOT NULL,
          full_desc TEXT NOT NULL,
          technologies_json TEXT NOT NULL DEFAULT '[]',
          image_url TEXT,
          demo_url TEXT,
          features_json TEXT NOT NULL DEFAULT '[]',
          featured INT NOT NULL DEFAULT 0,
          is_active INT NOT NULL DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS trainer_kits (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          subtitle VARCHAR(255),
          category VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          features_json TEXT NOT NULL DEFAULT '[]',
          specs_json TEXT NOT NULL DEFAULT '{}',
          status VARCHAR(50) NOT NULL DEFAULT 'coming_soon',
          image_url TEXT,
          preorder_count INT NOT NULL DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS inquiries (
          id SERIAL PRIMARY KEY,
          client_name VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          service_category VARCHAR(255) NOT NULL,
          project_title VARCHAR(255),
          message TEXT NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'new',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS site_config (
          key VARCHAR(255) PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          user_id INT,
          username VARCHAR(255),
          action VARCHAR(255) NOT NULL,
          details TEXT,
          ip_address VARCHAR(255),
          user_agent TEXT,
          severity VARCHAR(50) NOT NULL DEFAULT 'info',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Seed Default Admin User: engiverse_lead / @BERojgar59
      const defaultHash = '$2a$12$Rw8dluH.5xHGAThA1Ry42uqe8O3Y7Rr0/7SA3TiJWwygHBYw08NsS';
      await dbRun(
        `INSERT INTO users (username, email, password_hash, role, is_active)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username) DO UPDATE SET password_hash = $3`,
        ['engiverse_lead', 'chaitanyasoni40@gmail.com', defaultHash, 'Super Admin', 1]
      );

      console.log('✅ Supabase PostgreSQL Tables & Admin User (engiverse_lead) fully initialized!');
    } catch (err: any) {
      console.error('Supabase auto-initialization notice:', err.message);
    }
    await seedInitialData();
    return;
  }

  // 1. Users Table (SQLite)
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Admin',
      is_active INTEGER NOT NULL DEFAULT 1,
      last_login TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Services Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      features_json TEXT NOT NULL DEFAULT '[]',
      price_range TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Projects Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      full_desc TEXT NOT NULL,
      technologies_json TEXT NOT NULL DEFAULT '[]',
      image_url TEXT,
      demo_url TEXT,
      features_json TEXT NOT NULL DEFAULT '[]',
      featured INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Trainer Kits Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS trainer_kits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      features_json TEXT NOT NULL DEFAULT '[]',
      specs_json TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'coming_soon',
      image_url TEXT,
      preorder_count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Inquiries Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      service_category TEXT NOT NULL,
      project_title TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Site Config Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 7. Audit Logs Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      username TEXT,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      user_agent TEXT,
      severity TEXT NOT NULL DEFAULT 'info',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await seedInitialData();
}

async function seedInitialData() {
  const existingConfig = await dbGet('SELECT COUNT(*) as count FROM site_config');
  if (!existingConfig || Number(existingConfig.count || (existingConfig as any).COUNT || 0) === 0) {
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

    for (const [key, val] of Object.entries(defaultConfigs)) {
      if (isPostgres) {
        await dbRun(
          'INSERT INTO site_config (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT (key) DO UPDATE SET value = $2',
          [key, typeof val === 'object' ? JSON.stringify(val) : String(val)]
        );
      } else {
        await dbRun(
          'INSERT OR REPLACE INTO site_config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
          [key, typeof val === 'object' ? JSON.stringify(val) : String(val)]
        );
      }
    }
  }

  const existingServices = await dbGet('SELECT COUNT(*) as count FROM services');
  if (!existingServices || Number(existingServices.count || (existingServices as any).COUNT || 0) === 0) {
    const services = [
      {
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

    for (const s of services) {
      if (isPostgres) {
        await dbRun(
          `INSERT INTO services (title, slug, category, description, features_json, price_range, sort_order) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (slug) DO NOTHING`,
          [s.title, s.slug, s.category, s.description, s.features_json, s.price_range, s.sort_order]
        );
      } else {
        await dbRun(
          `INSERT INTO services (title, slug, category, description, features_json, price_range, sort_order) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [s.title, s.slug, s.category, s.description, s.features_json, s.price_range, s.sort_order]
        );
      }
    }
  }
}
