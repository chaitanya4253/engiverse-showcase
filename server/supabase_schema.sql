-- ====================================================================
-- ENGIVERSE SHOWCASE - SUPABASE CLOUD POSTGRESQL DATABASE SCHEMA
-- Copy and paste this script directly into Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/_/sql
-- ====================================================================

-- 1. Users Table
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
);

-- 2. Services Table
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
);

-- 3. Projects Table (Diploma & Degree Projects)
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
);

-- 4. Electronics Trainer Kits Table
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
);

-- 5. Inquiries & Leads Table
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
);

-- 6. Site Config Table (WhatsApp, Phones, Emails, Instagram, Hero Banner)
CREATE TABLE IF NOT EXISTS site_config (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Audit Logs Table
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
);

-- ====================================================================
-- INITIAL SEED DATA FOR SUPABASE
-- ====================================================================

-- Default Site Config Seed
INSERT INTO site_config (key, value) VALUES
  ('brand_name', '"Engiverse"'),
  ('tagline', '"Engineering Showcase, Web Development & Electronics Innovation"'),
  ('phones', '["9405456978", "8010895511", "8788705811"]'),
  ('whatsapp_number', '"919405456978"'),
  ('whatsapp_message', '"Hello Engiverse! I want to inquire about your web development & engineering services."'),
  ('emails', '["chaitanyasoni40@gmail.com", "pratikdeore917@gmail.com"]'),
  ('instagram', '"https://www.instagram.com/engiverse_59?igsh=MTg2dm1lNzA5MHZ3OQ=="'),
  ('hero_title', '"Empowering Local Businesses & Engineering Excellence"'),
  ('hero_subtitle', '"Custom web development for local enterprises, web management, engineering & diploma project solutions, and next-gen electronics trainer kits."')
ON CONFLICT (key) DO NOTHING;

-- Default Core Services Seed
INSERT INTO services (title, slug, category, description, features_json, price_range, sort_order) VALUES
  (
    'Web Site Development for Local Business',
    'web-development-local-business',
    'Web Development',
    'High-performance, modern, mobile-responsive custom websites engineered to help local businesses rank on Google, showcase products, and gain clients.',
    '["Custom Cyber/Modern UI Design", "SEO Optimization & Google My Business Setup", "Mobile-First Responsive Layouts", "Fast Load Times & Security Hardening", "Integrated WhatsApp & Phone Call Triggers"]',
    'Tailored Package',
    1
  ),
  (
    'Web Site Management & Maintenance',
    'website-management',
    'Web Management',
    'Hassle-free, ongoing web updates, cloud hosting management, daily security audits, performance optimizations, and content revisions.',
    '["Daily Automated Database Backups", "Security Monitoring & Malware Patching", "Content Updates & Catalog Maintenance", "Domain & SSL Certificate Management", "24/7 Server Uptime Guarantee"]',
    'Monthly Subscription',
    2
  ),
  (
    'Engineering and Diploma Projects',
    'engineering-diploma-projects',
    'Academic & R&D',
    'Complete hardware & software guidance for Degree, B.Tech, Diploma, and Polytechnic engineering students. Embedded systems, IoT, AI, Robotics & Web projects.',
    '["Hardware Circuit Design & PCB Layout", "Microcontroller Programming (Arduino, ESP32, STM32, Raspberry Pi)", "Full Project Documentation & Synopsis Report", "Live Demo & Presentation Prep Assistance", "Clean Source Code & Schematics"]',
    'Custom Scope',
    3
  ),
  (
    'Electronics Trainer Kits',
    'electronics-trainer-kits',
    'Hardware Kits',
    'Modular, robust educational hardware kits designed for electronics labs, robotics enthusiasts, and hands-on microcontroller learning.',
    '["Plug & Play Sensors & Actuator Modules", "Comprehensive Practical Experiment Manuals", "Short-Circuit Protection & Industrial Grade PCBs", "IoT & Embedded C Project Templates", "Coming Soon - Waitlist Open"]',
    'Coming Soon',
    4
  )
ON CONFLICT (slug) DO NOTHING;

-- Default Engineering Showcase Projects Seed
INSERT INTO projects (title, category, short_desc, full_desc, technologies_json, image_url, demo_url, features_json, featured) VALUES
  (
    'Smart Agricultural IoT & Automated Irrigation System',
    'IoT & Embedded',
    'Solar-powered ESP32 soil moisture sensor grid with real-time mobile dashboard and automated valve control.',
    'Designed for engineering final year showcase. Measures soil NPK levels, moisture, ambient humidity, and controls solenoid valves automatically with cloud telemetry.',
    '["ESP32", "C++", "MQTT", "Node.js", "React Dashboard"]',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    '#',
    '["Real-time Telemetry", "Solar Battery Backup", "Automated Relays", "GSM SMS Alert"]',
    1
  ),
  (
    'Autonomous Pathfinding Rover with Obstacle Avoidance',
    'Robotics',
    'Dual-wheel ultrasonic and LIDAR rover capable of mapping indoor obstacles and calculating shortest routes.',
    'Built for diploma and degree robotics competitions. Utilizes STM32 microcontrollers with motor driver ICs and ROS integration for dynamic navigation.',
    '["STM32", "LIDAR", "Python", "ROS", "Motor Drivers"]',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    '#',
    '["LIDAR Mapping", "PID Motor Control", "Bluetooth Remote", "Emergency Stop"]',
    1
  )
ON CONFLICT DO NOTHING;
