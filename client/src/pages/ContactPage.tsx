import React, { useState } from 'react';
import { Phone, Mail, Instagram, Send, ExternalLink, MapPin, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    client_name: '',
    phone: '',
    email: '',
    service_category: 'Web Site Development for Local Business',
    project_title: '',
    message: ''
  });

  const [submittedData, setSubmittedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const getWaLink = (phoneNum: string) => {
    if (!submittedData) return `https://wa.me/${phoneNum}`;
    const text = `🚨 *NEW ENGIVERSE LEAD INQUIRY*\n\n👤 *Client Name:* ${submittedData.client_name}\n📞 *Phone:* ${submittedData.phone}\n📧 *Email:* ${submittedData.email || 'N/A'}\n🏷️ *Category:* ${submittedData.service_category}\n💬 *Message:* ${submittedData.message}`;
    return `https://wa.me/${phoneNum}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setSubmittedData({ ...formData });

    const newLead = {
      id: Date.now(),
      client_name: formData.client_name,
      phone: formData.phone,
      email: formData.email || '',
      service_category: formData.service_category || 'General',
      project_title: formData.project_title || '',
      message: formData.message,
      status: 'new',
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('engiverse_local_inquiries') || '[]');
      localStorage.setItem('engiverse_local_inquiries', JSON.stringify([newLead, ...existing]));
    } catch {}

    try {
      await fetch('/api/v1/public/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err: any) {
    } finally {
      setSuccess(true);
      setLoading(false);
      setFormData({
        client_name: '',
        phone: '',
        email: '',
        service_category: 'Web Site Development for Local Business',
        project_title: '',
        message: ''
      });
    }
  };

  return (
    <div className="space-y-16 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Get In Touch</span>
        <h1 className="text-4xl sm:text-6xl font-heading font-black text-white">
          Contact Team Engiverse
        </h1>
        <p className="text-gray-300 text-base">
          Have a question about local business website development, web management, engineering diploma projects, or electronics trainer kits? Reach out to us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Contact Info Cards */}
        <div className="space-y-6">
          
          {/* Phone Card */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">Phone & WhatsApp</h3>
            </div>
            <div className="space-y-2 text-xs font-mono text-gray-300">
              <a href="tel:9405456978" className="block p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors">
                +91 9405456978
              </a>
              <a href="tel:8010895511" className="block p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors">
                +91 8010895511
              </a>
              <a href="tel:8788705811" className="block p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors">
                +91 8788705811
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="glass-panel p-6 rounded-2xl border border-violet-500/30 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">Email Addresses</h3>
            </div>
            <div className="space-y-2 text-xs font-mono text-gray-300">
              <a href="mailto:chaitanyasoni40@gmail.com" className="block p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-violet-500/40 hover:text-violet-400 transition-colors">
                chaitanyasoni40@gmail.com
              </a>
              <a href="mailto:pratikdeore917@gmail.com" className="block p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-violet-500/40 hover:text-violet-400 transition-colors">
                pratikdeore917@gmail.com
              </a>
            </div>
          </div>

          {/* Instagram Handle */}
          <div className="glass-panel p-6 rounded-2xl border border-pink-500/30 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">Instagram Profile</h3>
            </div>
            <a
              href="https://www.instagram.com/engiverse_59?igsh=MTg2dm1lNzA5MHZ3OQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-pink-500/40 text-pink-300 text-xs font-mono flex items-center justify-between hover:opacity-90"
            >
              <span>@engiverse_59</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 glass-panel p-8 sm:p-10 rounded-3xl border border-gray-800">
          {success ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-white">Inquiry Submitted Successfully!</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto">
                Thank you for reaching out to Engiverse. Your lead has been logged in our system.
              </p>

              {/* Dual WhatsApp Notification Action Box */}
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 max-w-md mx-auto space-y-3">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  ⚡ Send Lead Notification directly on WhatsApp:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={getWaLink('919405456978')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/25"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp (9405456978)</span>
                  </a>
                  <a
                    href={getWaLink('918010895511')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/25"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp (8010895511)</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-2xl font-heading font-bold text-white">Send Us a Direct Message</h2>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="e.g. Chaitanya Soni"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9405456978"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. pratikdeore917@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.service_category}
                    onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Web Site Development for Local Business">Web Site Development for Local Business</option>
                    <option value="Web Site Management">Web Site Management</option>
                    <option value="Engineering & Diploma Projects">Engineering & Diploma Projects</option>
                    <option value="Electronics Trainer Kits">Electronics Trainer Kits</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Message / Project Requirements *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can Engiverse assist you today?..."
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
