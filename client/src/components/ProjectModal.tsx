import React from 'react';
import { X, ExternalLink, Cpu, CheckCircle2, MessageCircle, Layers, Sparkles } from 'lucide-react';

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  short_desc: string;
  full_desc?: string;
  image_url?: string;
  demo_url?: string;
  technologies_json?: string | string[];
  features_json?: string | string[];
  featured?: number | boolean;
}

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenInquiry: (category?: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenInquiry }) => {
  if (!project) return null;

  let techList: string[] = [];
  if (Array.isArray(project.technologies_json)) {
    techList = project.technologies_json;
  } else if (typeof project.technologies_json === 'string') {
    try { techList = JSON.parse(project.technologies_json); } catch { techList = project.technologies_json.split(','); }
  }

  let featureList: string[] = [];
  if (Array.isArray(project.features_json)) {
    featureList = project.features_json;
  } else if (typeof project.features_json === 'string') {
    try { featureList = JSON.parse(project.features_json); } catch { featureList = project.features_json.split(','); }
  }

  const waMessage = `Hello Engiverse! I am interested in your project: "${project.title}" (${project.category}). Please share details and pricing.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-panel border border-cyan-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 bg-gray-950 max-h-[90vh] overflow-y-auto">
        
        {/* Glow pill */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-xl bg-gray-900 border border-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured Project
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            {project.title}
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {project.short_desc}
          </p>
        </div>

        {/* Tech Stack Badges */}
        {techList.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Technologies & Hardware Stack:</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {techList.map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-gray-900 border border-gray-800 text-xs font-mono text-cyan-300">
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full Overview Description */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3 mb-6 bg-gray-900/60">
          <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span>Project Architecture & Overview</span>
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            {project.full_desc || project.short_desc}
          </p>
        </div>

        {/* Key Features Checklist */}
        {featureList.length > 0 && (
          <div className="space-y-3 mb-8">
            <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Key Specifications & Features:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {featureList.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-gray-300 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenInquiry(project.category);
            }}
            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <span>Inquire About This Project</span>
          </button>

          <a
            href={`https://wa.me/919405456978?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
