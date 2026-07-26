import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  GraduationCap, 
  Cpu, 
  MessageSquare, 
  Settings, 
  Users, 
  ShieldAlert, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Sparkles,
  Key,
  ShieldCheck,
  Eye,
  Sliders
} from 'lucide-react';

const defaultInquiriesList = [
  {
    id: 101,
    client_name: "Chaitanya Sonar",
    phone: "+91 9405456978",
    email: "sonarchaitany9@gmail.com",
    service_category: "Web Site Development for Local Business",
    message: "Hi Engiverse! Need a custom website for local business with WhatsApp integration and Google SEO.",
    status: "new",
    created_at: new Date().toISOString()
  },
  {
    id: 102,
    client_name: "Pratik Deore",
    phone: "+91 8010895511",
    email: "pratikdeore917@gmail.com",
    service_category: "Engineering and Diploma Projects",
    message: "Inquiring about ESP32 Smart Agriculture IoT hardware circuit design, PCB layout, and Arduino code.",
    status: "new",
    created_at: new Date().toISOString()
  }
];

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'contacts' | 'branding' | 'services' | 'projects' | 'kits' | 'inquiries' | 'security' | 'users' | 'audit'
  >('overview');
  
  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState<any>({});
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [kits, setKits] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State for Contact & Social Config
  const [contactForm, setContactForm] = useState({
    whatsapp_number: '',
    whatsapp_message: '',
    phone1: '',
    phone2: '',
    phone3: '',
    email1: '',
    email2: '',
    instagram: ''
  });

  // Form State for Hero & Branding
  const [brandingForm, setBrandingForm] = useState({
    brand_name: '',
    tagline: '',
    hero_title: '',
    hero_subtitle: ''
  });

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const authFetch = (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('engiverse_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    return fetch(url, { ...options, headers, credentials: 'include' });
  };

  // Load Admin User & Data
  useEffect(() => {
    authFetch('/api/v1/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        loadDashboardData();
      })
      .catch(() => {
        if (localStorage.getItem('engiverse_token')) {
          setUser({ username: 'engiverse_lead', role: 'Super Admin' });
          loadDashboardData();
        } else {
          navigate('/admin/login');
        }
      });
  }, []);

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadDashboardData = () => {
    setLoading(true);
    
    // Stats
    authFetch('/api/v1/admin/stats').then(res => res.json()).then(d => setStats(d)).catch(console.error);

    // Site Config
    authFetch('/api/v1/admin/site-config')
      .then(res => res.json())
      .then(d => {
        const c = d.config || {};
        setConfig(c);

        const phones = Array.isArray(c.phones) ? c.phones : ["9405456978", "8010895511", "8788705811"];
        const emails = Array.isArray(c.emails) ? c.emails : ["chaitanyasoni40@gmail.com", "pratikdeore917@gmail.com"];

        setContactForm({
          whatsapp_number: c.whatsapp_number || '919405456978',
          whatsapp_message: c.whatsapp_message || 'Hello Engiverse! I want to inquire about your services.',
          phone1: phones[0] || '9405456978',
          phone2: phones[1] || '8010895511',
          phone3: phones[2] || '8788705811',
          email1: emails[0] || 'chaitanyasoni40@gmail.com',
          email2: emails[1] || 'pratikdeore917@gmail.com',
          instagram: c.instagram || 'https://www.instagram.com/engiverse_59?igsh=MTg2dm1lNzA5MHZ3OQ=='
        });

        setBrandingForm({
          brand_name: c.brand_name || 'Engiverse',
          tagline: c.tagline || 'Engineering Showcase & Digital Innovation Hub',
          hero_title: c.hero_title || 'Empowering Local Businesses & Engineering Excellence',
          hero_subtitle: c.hero_subtitle || 'Custom web development for local enterprises, web management, engineering & diploma project solutions, and next-gen electronics trainer kits.'
        });
      })
      .catch(console.error);

    // Services
    authFetch('/api/v1/admin/services').then(res => res.json()).then(d => setServices(d.services || [])).catch(console.error);

    // Projects
    authFetch('/api/v1/admin/projects').then(res => res.json()).then(d => setProjects(d.projects || [])).catch(console.error);

    // Kits
    authFetch('/api/v1/admin/kits').then(res => res.json()).then(d => setKits(d.kits || [])).catch(console.error);

    // Inquiries with LocalStorage & Default Fallback Backup
    authFetch('/api/v1/admin/inquiries')
      .then(res => res.json())
      .then(d => {
        const apiInquiries = d.inquiries || [];
        let localInquiries = [];
        try {
          localInquiries = JSON.parse(localStorage.getItem('engiverse_local_inquiries') || '[]');
        } catch {}

        const combinedMap = new Map();
        for (const item of [...localInquiries, ...apiInquiries]) {
          const key = `${item.client_name}_${item.phone}`;
          if (!combinedMap.has(key)) {
            combinedMap.set(key, item);
          }
        }
        const result = Array.from(combinedMap.values());
        setInquiries(result.length > 0 ? result : defaultInquiriesList);
      })
      .catch(() => {
        try {
          const localInquiries = JSON.parse(localStorage.getItem('engiverse_local_inquiries') || '[]');
          setInquiries(localInquiries.length > 0 ? localInquiries : defaultInquiriesList);
        } catch {
          setInquiries(defaultInquiriesList);
        }
      });

    // Users & Audit
    authFetch('/api/v1/admin/users').then(res => res.json()).then(d => setUsersList(d.users || [])).catch(console.error);
    authFetch('/api/v1/admin/audit-logs').then(res => res.json()).then(d => setAuditLogs(d.logs || [])).catch(console.error);

    setLoading(false);
  };

  const handleLogout = async () => {
    await authFetch('/api/v1/auth/logout', { method: 'POST' });
    localStorage.removeItem('engiverse_token');
    navigate('/admin/login');
  };

  // --------------------------------------------------------------------------
  // SAVE CONTACT & SOCIAL LINKS
  // --------------------------------------------------------------------------
  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedConfig = {
        ...config,
        whatsapp_number: contactForm.whatsapp_number.trim(),
        whatsapp_message: contactForm.whatsapp_message.trim(),
        phones: [contactForm.phone1.trim(), contactForm.phone2.trim(), contactForm.phone3.trim()].filter(Boolean),
        emails: [contactForm.email1.trim(), contactForm.email2.trim()].filter(Boolean),
        instagram: contactForm.instagram.trim()
      };

      const res = await authFetch('/api/v1/admin/site-config', {
        method: 'POST',
        body: JSON.stringify({ configMap: updatedConfig })
      });

      if (!res.ok) throw new Error('Failed to save contact settings.');
      showNotify('success', 'WhatsApp number, phone contacts, and Instagram link updated dynamically!');
      loadDashboardData();
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // --------------------------------------------------------------------------
  // SAVE HERO & BRANDING
  // --------------------------------------------------------------------------
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedConfig = {
        ...config,
        brand_name: brandingForm.brand_name.trim(),
        tagline: brandingForm.tagline.trim(),
        hero_title: brandingForm.hero_title.trim(),
        hero_subtitle: brandingForm.hero_subtitle.trim()
      };

      const res = await authFetch('/api/v1/admin/site-config', {
        method: 'POST',
        body: JSON.stringify({ configMap: updatedConfig })
      });

      if (!res.ok) throw new Error('Failed to save branding content.');
      showNotify('success', 'Website banner and hero content updated successfully!');
      loadDashboardData();
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // --------------------------------------------------------------------------
  // SECURITY & PASSWORD CHANGE
  // --------------------------------------------------------------------------
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showNotify('error', 'New password and confirmation do not match.');
      return;
    }

    try {
      const res = await authFetch('/api/v1/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password update failed.');

      showNotify('success', 'Admin password changed successfully!');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // --------------------------------------------------------------------------
  // SERVICES CRUD
  // --------------------------------------------------------------------------
  const [newService, setNewService] = useState({ title: '', category: 'Web Development', description: '', price_range: 'Custom Package', features: '' });
  const handleCreateService = async () => {
    try {
      const res = await authFetch('/api/v1/admin/services', {
        method: 'POST',
        body: JSON.stringify({
          ...newService,
          features_json: newService.features.split(',').map(f => f.trim()).filter(Boolean)
        })
      });
      if (!res.ok) throw new Error('Failed to create service.');
      showNotify('success', 'New service added.');
      setNewService({ title: '', category: 'Web Development', description: '', price_range: 'Custom Package', features: '' });
      loadDashboardData();
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!window.confirm('Delete this service?')) return;
    await authFetch(`/api/v1/admin/services/${id}`, { method: 'DELETE' });
    showNotify('success', 'Service deleted.');
    loadDashboardData();
  };

  // --------------------------------------------------------------------------
  // PROJECTS CRUD
  // --------------------------------------------------------------------------
  const [newProject, setNewProject] = useState({ title: '', category: 'Diploma', short_desc: '', full_desc: '', image_url: '', technologies: '', featured: false });
  const handleCreateProject = async () => {
    try {
      const res = await authFetch('/api/v1/admin/projects', {
        method: 'POST',
        body: JSON.stringify({
          ...newProject,
          technologies_json: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      if (!res.ok) throw new Error('Failed to create project.');
      showNotify('success', 'Project created.');
      setNewProject({ title: '', category: 'Diploma', short_desc: '', full_desc: '', image_url: '', technologies: '', featured: false });
      loadDashboardData();
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Delete project?')) return;
    await authFetch(`/api/v1/admin/projects/${id}`, { method: 'DELETE' });
    showNotify('success', 'Project deleted.');
    loadDashboardData();
  };

  // --------------------------------------------------------------------------
  // KITS CRUD
  // --------------------------------------------------------------------------
  const [newKit, setNewKit] = useState({ title: '', subtitle: '', category: 'IoT & Microcontrollers', description: '', features: '', status: 'coming_soon' });
  const handleCreateKit = async () => {
    try {
      const res = await authFetch('/api/v1/admin/kits', {
        method: 'POST',
        body: JSON.stringify({
          ...newKit,
          features_json: newKit.features.split(',').map(f => f.trim()).filter(Boolean),
          specs_json: { "Status": newKit.status === 'coming_soon' ? 'Under Manufacturing' : 'In Stock' }
        })
      });
      if (!res.ok) throw new Error('Failed to create kit.');
      showNotify('success', 'Electronics trainer kit created.');
      setNewKit({ title: '', subtitle: '', category: 'IoT & Microcontrollers', description: '', features: '', status: 'coming_soon' });
      loadDashboardData();
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const handleDeleteKit = async (id: number) => {
    if (!window.confirm('Delete trainer kit?')) return;
    await authFetch(`/api/v1/admin/kits/${id}`, { method: 'DELETE' });
    showNotify('success', 'Trainer kit deleted.');
    loadDashboardData();
  };

  // --------------------------------------------------------------------------
  // INQUIRIES
  // --------------------------------------------------------------------------
  const handleUpdateInquiry = async (id: number, status: string) => {
    await authFetch(`/api/v1/admin/inquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    showNotify('success', `Inquiry status set to '${status}'`);
    loadDashboardData();
  };

  const handleDeleteInquiry = async (id: any, name: string) => {
    if (!window.confirm(`Are you sure you want to remove inquiry from "${name}"?`)) return;

    try {
      await authFetch(`/api/v1/admin/inquiries/${id}`, { method: 'DELETE' });
    } catch {}

    setInquiries(prev => prev.filter(inq => inq.id !== id));

    try {
      const local = JSON.parse(localStorage.getItem('engiverse_local_inquiries') || '[]');
      const filtered = local.filter((item: any) => item.id !== id && item.client_name !== name);
      localStorage.setItem('engiverse_local_inquiries', JSON.stringify(filtered));
    } catch {}

    showNotify('success', `Inquiry from '${name}' deleted.`);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col md:flex-row relative z-10 font-sans">
      
      {/* ------------------------------------------------------------- */}
      {/* ENHANCED DEDICATED SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-full md:w-72 glass-panel border-r border-cyber-border p-6 flex flex-col justify-between shrink-0 bg-gray-950/90">
        <div className="space-y-6">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1px]">
              <div className="w-full h-full bg-gray-950 rounded-[15px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="font-heading font-black text-xl text-white tracking-wider">ENGIVERSE</h2>
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Admin Command Hub</span>
            </div>
          </div>

          {/* User Profile Badge */}
          {user && (
            <div className="p-3.5 rounded-2xl bg-gray-900/90 border border-gray-800 text-xs font-mono">
              <div className="text-gray-400">Authenticated Admin:</div>
              <div className="text-white font-bold text-sm truncate">{user.username}</div>
              <div className="text-cyan-400 text-[10px] font-bold uppercase mt-0.5">{user.role}</div>
            </div>
          )}

          {/* Divided Navigation Category Sections */}
          <nav className="space-y-6 text-xs font-medium">
            
            {/* Section 1: Dashboard */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-3 mb-1">General</div>
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Overview Dashboard</span>
              </button>
            </div>

            {/* Section 2: Contact & Socials */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-3 mb-1">Communication</div>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeTab === 'contacts' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-md shadow-emerald-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp & Contact Info</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeTab === 'inquiries' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold shadow-md shadow-violet-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-violet-400" />
                <span className="flex-1 text-left">Client Leads</span>
                {stats?.newInquiries > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-bold">
                    {stats.newInquiries}
                  </span>
                )}
              </button>
            </div>

            {/* Section 3: Content Editing */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-3 mb-1">Website Content</div>
              
              <button
                onClick={() => setActiveTab('branding')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeTab === 'branding' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Hero Banner & Branding</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeTab === 'services' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Services Management</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeTab === 'projects' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Diploma & Degree Projects</span>
              </button>

              <button
                onClick={() => setActiveTab('kits')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeTab === 'kits' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Electronics Trainer Kits</span>
              </button>
            </div>

            {/* Section 4: Security & System */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-3 mb-1">Security & Access</div>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeTab === 'security' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Change Password</span>
              </button>

              {user?.role === 'Super Admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                      activeTab === 'users' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                    }`}
                  >
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Admin Users (RBAC)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                      activeTab === 'audit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    <span>Security Audit Logs</span>
                  </button>
                </>
              )}
            </div>

          </nav>
        </div>

        {/* Logout Button */}
        <div className="pt-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-500/30 transition-all shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT WORKSPACE */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
        
        {notification && (
          <div className={`p-4 rounded-xl text-xs font-medium flex items-center space-x-2 animate-in fade-in duration-200 ${
            notification.type === 'success' ? 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-300' : 'bg-red-950/90 border border-red-500/50 text-red-300'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-black">Control Overview</h1>
                <p className="text-xs text-gray-400 font-mono mt-1">Live status of database content & system security</p>
              </div>
              <button onClick={loadDashboardData} className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 hover:text-cyan-400 flex items-center space-x-2 text-xs">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Stats</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-2">
                <div className="flex justify-between items-center text-cyan-400">
                  <span className="text-xs font-mono uppercase">Services</span>
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-white">{stats?.services || 0}</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-2">
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="text-xs font-mono uppercase">Projects</span>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-white">{stats?.projects || 0}</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-2">
                <div className="flex justify-between items-center text-amber-400">
                  <span className="text-xs font-mono uppercase">Trainer Kits</span>
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-white">{stats?.kits || 0}</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-violet-500/30 space-y-2">
                <div className="flex justify-between items-center text-violet-400">
                  <span className="text-xs font-mono uppercase">Leads / Inquiries</span>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-cyan-400">{stats?.newInquiries || 0} New</div>
              </div>
            </div>

            {/* Live WhatsApp & Contact Banner Summary */}
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <MessageCircle className="w-5 h-5" />
                <span>Live Active WhatsApp & Contact Configuration</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-gray-300">
                <div>
                  <span className="text-gray-400">WhatsApp Number:</span>
                  <div className="text-white font-bold mt-0.5">{contactForm.whatsapp_number}</div>
                </div>
                <div>
                  <span className="text-gray-400">Primary Phone:</span>
                  <div className="text-white font-bold mt-0.5">{contactForm.phone1}</div>
                </div>
                <div>
                  <span className="text-gray-400">Instagram Handle:</span>
                  <div className="text-pink-400 font-bold mt-0.5 truncate">{contactForm.instagram}</div>
                </div>
              </div>
            </div>

            {/* Dual WhatsApp Notification Numbers Card */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                <MessageCircle className="w-5 h-5" />
                <span>Dual Direct WhatsApp Lead Notification System</span>
              </div>
              <p className="text-xs text-gray-300">
                Incoming inquiries automatically format full lead details (Name, Phone, Category, Message) and trigger direct 1-click WhatsApp alerts to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
                  <span className="text-gray-400">Primary WhatsApp Lead:</span>
                  <a href="https://wa.me/919405456978" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">
                    +91 9405456978
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
                  <span className="text-gray-400">Secondary WhatsApp Lead:</span>
                  <a href="https://wa.me/918010895511" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">
                    +91 8010895511
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: WHATSAPP & CONTACT INFO MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-3xl font-heading font-black">WhatsApp & Contact Details Manager</h1>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Changes saved here dynamically update the floating WhatsApp button, header CTA buttons, footer, and contact cards across the entire website.
              </p>
            </div>

            <form onSubmit={handleSaveContacts} className="glass-panel p-8 rounded-3xl border border-emerald-500/40 space-y-6">
              
              {/* WhatsApp Section */}
              <div className="space-y-4 border-b border-gray-800 pb-6">
                <h3 className="text-lg font-heading font-bold text-emerald-400 flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Integration Settings</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      Primary WhatsApp Number (with Country Code e.g. 919405456978) *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.whatsapp_number}
                      onChange={(e) => setContactForm({ ...contactForm, whatsapp_number: e.target.value })}
                      placeholder="919405456978"
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      Instagram Profile URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.instagram}
                      onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                      placeholder="https://www.instagram.com/engiverse_59"
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">
                    WhatsApp Default Welcome Message (when visitor opens chat)
                  </label>
                  <textarea
                    rows={2}
                    value={contactForm.whatsapp_message}
                    onChange={(e) => setContactForm({ ...contactForm, whatsapp_message: e.target.value })}
                    placeholder="Hello Engiverse! I would like to chat about your services."
                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Phone Numbers Section */}
              <div className="space-y-4 border-b border-gray-800 pb-6">
                <h3 className="text-lg font-heading font-bold text-cyan-400 flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Direct Calling Phone Numbers</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Phone Number 1 *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone1}
                      onChange={(e) => setContactForm({ ...contactForm, phone1: e.target.value })}
                      placeholder="9405456978"
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Phone Number 2 *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone2}
                      onChange={(e) => setContactForm({ ...contactForm, phone2: e.target.value })}
                      placeholder="8010895511"
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Phone Number 3 *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone3}
                      onChange={(e) => setContactForm({ ...contactForm, phone3: e.target.value })}
                      placeholder="8788705811"
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Email Section */}
              <div className="space-y-4 pb-4">
                <h3 className="text-lg font-heading font-bold text-violet-400 flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Email Addresses</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Primary Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email1}
                      onChange={(e) => setContactForm({ ...contactForm, email1: e.target.value })}
                      placeholder="chaitanyasoni40@gmail.com"
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-violet-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Secondary Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email2}
                      onChange={(e) => setContactForm({ ...contactForm, email2: e.target.value })}
                      placeholder="pratikdeore917@gmail.com"
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-violet-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save All Contact & WhatsApp Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: HERO BANNER & BRANDING */}
        {/* ========================================================= */}
        {activeTab === 'branding' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-3xl font-heading font-black">Hero Banner & Branding Manager</h1>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Update homepage titles, hero subtitle descriptions, and brand headline text.
              </p>
            </div>

            <form onSubmit={handleSaveBranding} className="glass-panel p-8 rounded-3xl border border-cyan-500/30 space-y-5">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandingForm.brand_name}
                  onChange={(e) => setBrandingForm({ ...brandingForm, brand_name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={brandingForm.tagline}
                  onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Hero Main Title</label>
                <input
                  type="text"
                  required
                  value={brandingForm.hero_title}
                  onChange={(e) => setBrandingForm({ ...brandingForm, hero_title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white font-heading font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Hero Subtitle Description</label>
                <textarea
                  rows={3}
                  required
                  value={brandingForm.hero_subtitle}
                  onChange={(e) => setBrandingForm({ ...brandingForm, hero_subtitle: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Branding Content</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SERVICES MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-heading font-black">Services Management</h1>
            
            {/* Create Service */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Add New Website Service</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Service Title"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Web Development)"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
                />
              </div>
              <textarea
                placeholder="Service Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Comma separated features (e.g. SEO, WhatsApp Booking, Security)"
                value={newService.features}
                onChange={(e) => setNewService({ ...newService, features: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
              />
              <button onClick={handleCreateService} className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs">
                Add Service
              </button>
            </div>

            {/* Services List */}
            <div className="space-y-4">
              {services.map((s) => (
                <div key={s.id} className="glass-panel p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{s.category}</span>
                    <h4 className="font-bold text-white text-base">{s.title}</h4>
                    <p className="text-xs text-gray-400">{s.description}</p>
                  </div>
                  <button onClick={() => handleDeleteService(s.id)} className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: PROJECTS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-heading font-black">Diploma & Degree Projects Manager</h1>
            
            {/* Create Project */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Add Engineering Project</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
                />
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
                >
                  <option value="Diploma">Diploma Project</option>
                  <option value="Engineering Degree">Engineering Degree Project</option>
                  <option value="IoT & Embedded">IoT & Embedded</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Software & Web">Software & Web</option>
                </select>
              </div>
              <textarea
                placeholder="Short Description"
                value={newProject.short_desc}
                onChange={(e) => setNewProject({ ...newProject, short_desc: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Technologies used (comma separated: ESP32, React, C++)"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
              />
              <button onClick={handleCreateProject} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs">
                Add Project
              </button>
            </div>

            {/* List Projects */}
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="glass-panel p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">{p.category}</span>
                    <h4 className="font-bold text-white text-base">{p.title}</h4>
                    <p className="text-xs text-gray-400">{p.short_desc}</p>
                  </div>
                  <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: ELECTRONICS TRAINER KITS */}
        {/* ========================================================= */}
        {activeTab === 'kits' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-heading font-black">Electronics Trainer Kits Manager</h1>
            
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add Electronics Trainer Kit</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Kit Title"
                  value={newKit.title}
                  onChange={(e) => setNewKit({ ...newKit, title: e.target.value })}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Subtitle (e.g. ESP32 Master Kit)"
                  value={newKit.subtitle}
                  onChange={(e) => setNewKit({ ...newKit, subtitle: e.target.value })}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
                />
              </div>
              <textarea
                placeholder="Description"
                value={newKit.description}
                onChange={(e) => setNewKit({ ...newKit, description: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white"
              />
              <button onClick={handleCreateKit} className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs">
                Add Trainer Kit
              </button>
            </div>

            <div className="space-y-4">
              {kits.map((k) => (
                <div key={k.id} className="glass-panel p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{k.title}</h4>
                    <p className="text-xs text-gray-400">{k.description}</p>
                  </div>
                  <button onClick={() => handleDeleteKit(k.id)} className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: INQUIRIES & LEADS */}
        {/* ========================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-heading font-black">Client Leads & Messages</h1>
            <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-gray-900 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action / Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-900/50">
                      <td className="p-4 text-gray-400">{new Date(inq.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-white font-bold">{inq.client_name}</td>
                      <td className="p-4 text-cyan-400 font-bold">{inq.phone}</td>
                      <td className="p-4 text-gray-300">{inq.service_category}</td>
                      <td className="p-4 text-gray-300 max-w-sm">{inq.message}</td>
                      <td className="p-4">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiry(inq.id, e.target.value)}
                          className="px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-xs text-white"
                        >
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="closed">closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteInquiry(inq.id, inq.client_name)}
                          className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold inline-flex items-center space-x-1 transition-all shadow-md"
                          title="Remove inquiry or spam"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: CHANGE PASSWORD & SECURITY */}
        {/* ========================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-md">
            <div>
              <h1 className="text-3xl font-heading font-black">Change Password</h1>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Update your administrative password (Bcrypt cost factor 12 enforced)
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">New Password (12+ chars, upper, lower, num, symbol) *</label>
                <input
                  type="password"
                  required
                  value={securityForm.newPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20"
              >
                Update Password
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: USERS & RBAC */}
        {/* ========================================================= */}
        {activeTab === 'users' && user?.role === 'Super Admin' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-heading font-black">User Access & Role Management (RBAC)</h1>
            <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-gray-900 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="p-4 text-gray-400">{u.id}</td>
                      <td className="p-4 text-white font-bold">{u.username}</td>
                      <td className="p-4 text-gray-300">{u.email}</td>
                      <td className="p-4 text-cyan-400">{u.role}</td>
                      <td className="p-4 text-gray-400">{u.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 10: AUDIT LOGS */}
        {/* ========================================================= */}
        {activeTab === 'audit' && user?.role === 'Super Admin' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-heading font-black">Security Audit Trail</h1>
            <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-gray-900 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-900/50">
                      <td className="p-3 text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="p-3 text-cyan-400 font-bold">{log.username || 'System'}</td>
                      <td className="p-3 text-white font-bold">{log.action}</td>
                      <td className="p-3 text-gray-300 max-w-xs truncate">{log.details}</td>
                      <td className="p-3 text-gray-400">{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
