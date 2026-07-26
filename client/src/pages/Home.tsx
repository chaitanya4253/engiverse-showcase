import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Settings, 
  Cpu, 
  Package, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  PhoneCall, 
  Instagram, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  Layers,
  Wrench,
  GraduationCap
} from 'lucide-react';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ProjectModal, ProjectItem } from '../components/ProjectModal';

interface HomeProps {
  onOpenInquiry: (category?: string) => void;
}

const parseArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return val.split(',').map(s => s.trim());
    }
  }
  return [];
};

export const Home: React.FC<HomeProps> = ({ onOpenInquiry }) => {
  const [config, setConfig] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [kits, setKits] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    // Fetch public site config
    fetch('/api/v1/public/config')
      .then(res => res.json())
      .then(data => setConfig(data.config))
      .catch(console.error);

    // Fetch services
    fetch('/api/v1/public/services')
      .then(res => res.json())
      .then(data => setServices(data.services || []))
      .catch(console.error);

    // Fetch featured projects
    fetch('/api/v1/public/projects')
      .then(res => res.json())
      .then(data => setProjects(data.projects || []))
      .catch(console.error);

    // Fetch trainer kits
    fetch('/api/v1/public/kits')
      .then(res => res.json())
      .then(data => setKits(data.kits || []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-28 relative z-10">

      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-lg shadow-cyan-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Engiverse Engineering & Digital Innovation Hub</span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-none">
              Engineering <span className="text-gradient-cyan">Showcase</span> & Local Business Growth
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {config?.hero_subtitle || 
                "High-performance website development for local enterprises, complete web management, degree/diploma project guidance, and next-gen electronics trainer kits."}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onOpenInquiry('Web Site Development for Local Business')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-medium text-base shadow-xl shadow-cyan-500/25 flex items-center space-x-3 group transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>Build Local Business Website</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/projects"
                className="px-8 py-4 rounded-xl glass-panel hover:bg-gray-900 border border-gray-800 text-gray-200 font-medium text-base flex items-center space-x-3 transition-all"
              >
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <span>Explore Engineering Projects</span>
              </Link>
            </div>

            {/* Quick Contact Bar */}
            <div className="pt-8 border-t border-gray-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-mono">
              <span className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>Call Us: 9405456978 | 8010895511 | 8788705811</span>
              </span>
              <span className="hidden sm:inline text-gray-700">•</span>
              <a
                href="https://www.instagram.com/engiverse_59?igsh=MTg2dm1lNzA5MHZ3OQ=="
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-pink-400 hover:underline"
              >
                <Instagram className="w-4 h-4" />
                <span>@engiverse_59</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. CORE SERVICES SHOWCASE */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Tailored Solutions</span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
            Our Core Services
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            From establishing powerful web presence for local shops to guiding complex engineering diplomas and electronics kits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Service 1: Local Business Web Dev */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl relative flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white group-hover:text-cyan-400 transition-colors">
                Web Site Development for Local Business
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Custom, ultra-fast, mobile-friendly websites designed for local shops, services, and local enterprises to gain new customers.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Google My Business & Local SEO</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>WhatsApp One-Click Booking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>OWASP Hardened Security</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onOpenInquiry('Web Site Development for Local Business')}
              className="mt-8 w-full py-3 rounded-xl bg-gray-900 hover:bg-cyan-950 border border-gray-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <span>Get Website Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service 2: Web Site Management */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl relative flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white group-hover:text-violet-400 transition-colors">
                Web Site Management & Maintenance
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ongoing site management, cloud hosting management, daily security backups, catalog updates, and technical maintenance.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>24/7 Server Uptime Monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Daily Database Security Backups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Fast Content & Price Revisions</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onOpenInquiry('Web Site Management')}
              className="mt-8 w-full py-3 rounded-xl bg-gray-900 hover:bg-violet-950 border border-gray-800 hover:border-violet-500/40 text-violet-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <span>Manage My Site</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service 3: Engineering and Diploma Projects */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl relative flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white group-hover:text-emerald-400 transition-colors">
                Engineering & Diploma Projects
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Complete hardware & software project execution for B.Tech, Degree, and Diploma engineering students.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Circuit Schematic & PCB Design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Microcontroller Programming</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Complete Report & Synopsis</span>
                </li>
              </ul>
            </div>
            <Link
              to="/projects"
              className="mt-8 w-full py-3 rounded-xl bg-gray-900 hover:bg-emerald-950 border border-gray-800 hover:border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <span>Browse Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service 4: Electronics Trainer Kits (Coming Soon) */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl relative flex flex-col justify-between group border border-amber-500/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold animate-pulse">
                  COMING SOON
                </span>
              </div>
              <h3 className="text-xl font-heading font-bold text-white group-hover:text-amber-400 transition-colors">
                Electronics Trainer Kits
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Modular hardware kits for robotics labs, IoT learning, microcontroller experimentation, and academic practicals.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Plug & Play Sensor Modules</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Lab Manual & Source Code</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Short-Circuit Protected PCBs</span>
                </li>
              </ul>
            </div>
            <Link
              to="/kits"
              className="mt-8 w-full py-3 rounded-xl bg-gray-900 hover:bg-amber-950 border border-gray-800 hover:border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <span>Join Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEATURED ENGINEERING & DIPLOMA PROJECTS GALLERY */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Academic & R&D Excellence</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              Engineering Showcase Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
          >
            <span>View All Engineering Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((proj) => (
            <div key={proj.id} className="glass-panel glass-panel-hover rounded-2xl overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  <img
                    src={proj.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-mono">
                    {proj.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-heading font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                    {proj.short_desc}
                  </p>
                  
                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {parseArray(proj.technologies_json).map((tech: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-300 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-2">
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Case Study</span>
                </button>
                <button
                  onClick={() => onOpenInquiry(`Engineering Project Inquiry: ${proj.title}`)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 hover:bg-cyan-950 border border-gray-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-medium flex items-center justify-center space-x-1 transition-all"
                >
                  <span>Inquire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* TESTIMONIALS SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialsSection />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. INSTAGRAM & CONTACT CALLOUT */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-pink-500/30 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-gray-950 to-pink-950/30">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-mono">
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Follow @engiverse_59</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                Connect With Engiverse on Instagram
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Stay updated with our latest local business web projects, student diploma innovations, upcoming electronics trainer kit demos, and tech insights.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/engiverse_59?igsh=MTg2dm1lNzA5MHZ3OQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium text-sm flex items-center space-x-2 shadow-lg shadow-pink-500/25 hover:opacity-90 transition-opacity"
                >
                  <span>Visit Instagram Profile</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 bg-gray-950/80">
              <h3 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                <PhoneCall className="w-5 h-5 text-cyan-400" />
                <span>Direct Contact Lines</span>
              </h3>
              <div className="space-y-2 font-mono text-xs text-gray-300">
                <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 flex justify-between items-center">
                  <span>Contact 1:</span>
                  <a href="tel:9405456978" className="text-cyan-400 font-bold hover:underline">9405456978</a>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 flex justify-between items-center">
                  <span>Contact 2:</span>
                  <a href="tel:8010895511" className="text-cyan-400 font-bold hover:underline">8010895511</a>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 flex justify-between items-center">
                  <span>Contact 3:</span>
                  <a href="tel:8788705811" className="text-cyan-400 font-bold hover:underline">8788705811</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenInquiry={onOpenInquiry}
      />

    </div>
  );
};
