import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Phone, Mail, User } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, defaultCategory = 'Web Site Development for Local Business' }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    phone: '',
    email: '',
    service_category: defaultCategory,
    project_title: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Save lead to local persistence backup
    const newLead = {
      id: Date.now(),
      client_name: formData.client_name,
      phone: formData.phone,
      email: formData.email || '',
      service_category: formData.service_category || defaultCategory,
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
      console.log('Inquiry modal lead saved locally.');
    } finally {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          client_name: '',
          phone: '',
          email: '',
          service_category: defaultCategory,
          project_title: '',
          message: ''
        });
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel border border-cyber-cyan/40 rounded-2xl shadow-2xl p-6 sm:p-8 bg-gray-950 overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-lg bg-gray-900 border border-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">Inquiry Received!</h3>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              Thank you for contacting Engiverse. Our technical lead will review your message and reach out via call/WhatsApp shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Connect With Us</span>
              <h3 className="text-2xl font-heading font-bold text-white">Start Your Project</h3>
              <p className="text-xs text-gray-400 mt-1">Fill out the details below and we will get back to you immediately.</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number (Call / WhatsApp) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9405456978"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address (Optional)</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Service Category</label>
                <select
                  value={formData.service_category}
                  onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Web Site Development for Local Business">Web Site Development for Local Business</option>
                  <option value="Web Site Management">Web Site Management & Maintenance</option>
                  <option value="Engineering & Diploma Projects">Engineering & Diploma Projects</option>
                  <option value="Electronics Trainer Kits">Electronics Trainer Kits (Pre-order)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Project / Subject Title</label>
                <input
                  type="text"
                  value={formData.project_title}
                  onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                  placeholder="e.g. Grocery Store Website or IoT Project"
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Inquiry Details / Requirements *</label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe what you need (e.g. I need a local business website for my shop or hardware project guidance)..."
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-medium rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting Securely...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry Now</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
