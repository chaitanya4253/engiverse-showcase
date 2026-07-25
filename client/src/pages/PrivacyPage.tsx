import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 relative z-10 text-gray-300">
      <div className="flex items-center space-x-3">
        <ShieldCheck className="w-8 h-8 text-cyan-400" />
        <h1 className="text-4xl font-heading font-black text-white">Privacy Policy</h1>
      </div>
      <p className="text-sm leading-relaxed">
        Engiverse values your privacy and is committed to protecting your personal data in accordance with modern OWASP ASVS and privacy standards.
      </p>
      <div className="space-y-4 glass-panel p-6 rounded-2xl border border-gray-800 text-xs leading-relaxed">
        <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
        <p>We collect minimal information provided voluntarily through project inquiry forms, including name, phone number, email address, and project requirements.</p>
        
        <h3 className="text-base font-bold text-white">2. How We Use Information</h3>
        <p>Information is strictly used to evaluate project requests, communicate project updates, and provide web development or hardware trainer kit assistance.</p>
        
        <h3 className="text-base font-bold text-white">3. Data Security</h3>
        <p>All database queries are parameterized to prevent injection attacks, and sensitive authentication data is securely hashed using Bcrypt/Argon2 algorithm standards.</p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 relative z-10 text-gray-300">
      <h1 className="text-4xl font-heading font-black text-white">Terms of Service</h1>
      <div className="space-y-4 glass-panel p-6 rounded-2xl border border-gray-800 text-xs leading-relaxed">
        <h3 className="text-base font-bold text-white">1. Services Agreement</h3>
        <p>Engiverse provides web site development for local business, website management, academic diploma & engineering project guidance, and electronics trainer kits.</p>
        
        <h3 className="text-base font-bold text-white">2. Intellectual Property</h3>
        <p>All source code, documentation, and hardware design schematics delivered for custom projects belong to the client upon full project settlement.</p>
      </div>
    </div>
  );
};
