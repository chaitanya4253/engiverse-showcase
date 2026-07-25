import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Phone, Mail, Instagram, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/public/config')
      .then(res => res.json())
      .then(data => setConfig(data.config))
      .catch(console.error);
  }, []);

  const phones = Array.isArray(config?.phones) ? config.phones : ["9405456978", "8010895511", "8788705811"];
  const emails = Array.isArray(config?.emails) ? config.emails : ["chaitanyasoni40@gmail.com", "pratikdeore917@gmail.com"];
  const instagramUrl = config?.instagram || "https://www.instagram.com/engiverse_59?igsh=MTg2dm1lNzA5MHZ3OQ==";

  return (
    <footer className="relative z-10 glass-panel border-t border-cyber-border/80 bg-gray-950/90 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1px]">
                <div className="w-full h-full bg-gray-950 rounded-[11px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-heading font-bold text-xl text-white">{config?.brand_name || "ENGIVERSE"}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering local businesses with high-performance web development, web site management, engineering & diploma project innovation, and next-gen electronics trainer kits.
            </p>
            
            {/* Dynamic Instagram Handle Badge */}
            <div className="pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-pink-500/30 text-pink-300 text-xs font-mono hover:border-pink-500/60 transition-all shadow-sm"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram Profile</span>
                <ExternalLink className="w-3 h-3 text-pink-400" />
              </a>
            </div>
          </div>

          {/* Col 2: Our Core Services */}
          <div>
            <h4 className="font-heading font-semibold text-white text-base mb-4 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Core Services
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <span className="text-cyan-500">›</span>
                  <span>Web Site Development for Local Business</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <span className="text-cyan-500">›</span>
                  <span>Web Site Management & Maintenance</span>
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <span className="text-cyan-500">›</span>
                  <span>Engineering & Diploma Projects</span>
                </Link>
              </li>
              <li>
                <Link to="/kits" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <span className="text-cyan-500">›</span>
                  <span>Electronics Trainer Kits (Coming Soon)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dynamic Direct Contact Numbers */}
          <div>
            <h4 className="font-heading font-semibold text-white text-base mb-4 tracking-wider">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                <div className="flex flex-col font-mono text-xs space-y-1 text-gray-300">
                  {phones.map((p: string, idx: number) => (
                    <a key={idx} href={`tel:${p}`} className="hover:text-cyan-400 transition-colors">+91 {p}</a>
                  ))}
                </div>
              </li>
              <li className="flex items-start space-x-3 pt-1">
                <Mail className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                <div className="flex flex-col font-mono text-xs space-y-1 text-gray-300">
                  {emails.map((e: string, idx: number) => (
                    <a key={idx} href={`mailto:${e}`} className="hover:text-cyan-400 transition-colors">{e}</a>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div>
            <h4 className="font-heading font-semibold text-white text-base mb-4 tracking-wider">
              Security & Trust
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Engiverse is built adhering to OWASP ASVS Top 10 security standards, providing encrypted communication, parameterized backend databases, and enterprise data protection.
            </p>
            <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="flex flex-col text-[11px]">
                <span className="text-white font-medium">100% OWASP Security Compliant</span>
                <span className="text-gray-500 font-mono">Encrypted & Parameterized</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
          <div>
            © {new Date().getFullYear()} {config?.brand_name || "Engiverse"} Engineering Showcase. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
