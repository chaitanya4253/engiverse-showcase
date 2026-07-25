import React from 'react';
import { Globe, Wrench, GraduationCap, Cpu, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface ServicesPageProps {
  onOpenInquiry: (category?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenInquiry }) => {
  return (
    <div className="space-y-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Engineering & Digital Solutions</span>
        <h1 className="text-4xl sm:text-6xl font-heading font-black text-white">
          Our Comprehensive Services
        </h1>
        <p className="text-gray-300 text-base">
          Tailored web engineering for local businesses, ongoing site maintenance, academic project consultation, and upcoming educational electronics trainer hardware.
        </p>
      </div>

      {/* Services Detailed Cards */}
      <div className="space-y-12">
        
        {/* Service 1 */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/30 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Globe className="w-4 h-4" />
              <span>Service #1</span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-white">
              Web Site Development for Local Business
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transform your local shop, clinic, restaurant, or service business with an elite, custom-coded modern website. Built with speed, security, and mobile responsiveness to attract local clients.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Google My Business & Maps Integration</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>WhatsApp Direct Chat & Call Buttons</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Fast Page Loading (&lt; 1 Second)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>OWASP Top 10 Hardened Security</span>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 text-center space-y-4 bg-gray-950/80">
            <span className="text-xs text-gray-400 uppercase font-mono">Package Plan</span>
            <div className="text-2xl font-bold text-white">Custom Business Setup</div>
            <p className="text-xs text-gray-400">Includes domain configuration, mobile layout, and SEO.</p>
            <button
              onClick={() => onOpenInquiry('Web Site Development for Local Business')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium text-xs shadow-lg shadow-cyan-500/20"
            >
              Request Quote
            </button>
          </div>
        </div>

        {/* Service 2 */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-violet-500/30 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono">
              <Wrench className="w-4 h-4" />
              <span>Service #2</span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-white">
              Web Site Management & Maintenance
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Let us handle your website's technical maintenance while you focus on running your business. We manage server hosting, security patches, content updates, and backups.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Daily Database & Content Backups</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>24/7 Security Vulnerability Patching</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Product & Catalog Revisions</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>SSL Renewal & Domain Health</span>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 text-center space-y-4 bg-gray-950/80">
            <span className="text-xs text-gray-400 uppercase font-mono">Monthly Management</span>
            <div className="text-2xl font-bold text-white">Hassle-Free Care</div>
            <p className="text-xs text-gray-400">Regular maintenance & instant tech support.</p>
            <button
              onClick={() => onOpenInquiry('Web Site Management')}
              className="w-full py-3 rounded-xl bg-violet-600 text-white font-medium text-xs shadow-lg shadow-violet-500/20"
            >
              Start Management
            </button>
          </div>
        </div>

        {/* Service 3 */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/30 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <GraduationCap className="w-4 h-4" />
              <span>Service #3</span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-white">
              Engineering & Diploma Projects
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Comprehensive guidance and technical implementation for Degree, Diploma, B.Tech, and Polytechnic engineering students. Embedded C, IoT, Robotics, Web Apps, and AI projects.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hardware Assembly & PCB Schematics</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clean Source Code & Libraries</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complete Project Report & PPT</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live Viva & Demo Preparation</span>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 text-center space-y-4 bg-gray-950/80">
            <span className="text-xs text-gray-400 uppercase font-mono">Academic R&D</span>
            <div className="text-2xl font-bold text-white">Diploma & Degree</div>
            <p className="text-xs text-gray-400">Complete hardware & software guidance.</p>
            <button
              onClick={() => onOpenInquiry('Engineering & Diploma Projects')}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-lg shadow-emerald-500/20"
            >
              Inquire Project
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
