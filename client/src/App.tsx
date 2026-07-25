import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CyberCanvas } from './components/CyberCanvas';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InquiryModal } from './components/InquiryModal';
import { WhatsAppButton } from './components/WhatsAppButton';

import { Home } from './pages/Home';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TrainerKitsPage } from './pages/TrainerKitsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage, TermsPage } from './pages/PrivacyPage';

import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryCategory, setInquiryCategory] = useState<string | undefined>();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleOpenInquiry = (category?: string) => {
    setInquiryCategory(category || 'Web Site Development for Local Business');
    setInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col relative font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Canvas */}
      <CyberCanvas />

      {/* Public Navbar (Hidden on /admin routes) */}
      {!isAdminRoute && <Navbar onOpenInquiry={handleOpenInquiry} />}

      {/* Main Content Routes */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/services" element={<ServicesPage onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/projects" element={<ProjectsPage onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/kits" element={<TrainerKitsPage onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Hidden Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Public Footer (Hidden on /admin routes) */}
      {!isAdminRoute && <Footer />}

      {/* Floating WhatsApp Action Button */}
      {!isAdminRoute && <WhatsAppButton />}

      {/* Global Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        defaultCategory={inquiryCategory}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};
