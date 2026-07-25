import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, Menu, X, ArrowRight, PhoneCall, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenInquiry: (category?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/public/config')
      .then(res => res.json())
      .then(data => setConfig(data.config))
      .catch(console.error);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const waNum = config?.whatsapp_number || '919405456978';
  const waMsg = config?.whatsapp_message || 'Hello Engiverse! I want to chat about your services.';
  const primaryPhone = Array.isArray(config?.phones) ? config.phones[0] : '9405456978';
  const whatsappUrl = `https://wa.me/${waNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Services', path: '/services' },
    { name: 'Diploma & Degree Projects', path: '/projects' },
    { name: 'Trainer Kits', path: '/kits', badge: 'Soon' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyber-border/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-gray-950 rounded-[11px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-2xl tracking-wider text-white flex items-center gap-1">
                {config?.brand_name || 'ENGIVERSE'} <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 font-mono">v2.0</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                Engineering & Web Showcase
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (No Admin link present) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-900/60'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 animate-pulse">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 hover:text-white transition-colors px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>WhatsApp Chat</span>
            </a>
            <a
              href={`tel:${primaryPhone}`}
              className="flex items-center space-x-2 text-xs font-mono text-gray-300 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900/50"
            >
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <span>{primaryPhone}</span>
            </a>
            <button
              onClick={() => onOpenInquiry()}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-xl group bg-gradient-to-br from-cyan-500 to-violet-600 group-hover:from-cyan-500 group-hover:to-violet-600 hover:text-white text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-950 rounded-[10px] group-hover:bg-opacity-0 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover:text-white" />
                <span>Start Project</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-900 border border-gray-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-cyber-border px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive(link.path)
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-500/40'
                  : 'text-gray-300 hover:bg-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>WhatsApp Chat</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Project Inquiry</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
