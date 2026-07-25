import React, { useEffect, useState } from 'react';
import { Cpu, Sparkles, CheckCircle2, ArrowRight, Bell, Zap, Package } from 'lucide-react';

interface TrainerKitsPageProps {
  onOpenInquiry: (category?: string) => void;
}

export const TrainerKitsPage: React.FC<TrainerKitsPageProps> = ({ onOpenInquiry }) => {
  const [kits, setKits] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/v1/public/kits')
      .then(res => res.json())
      .then(data => setKits(data.kits || []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-16 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono animate-pulse">
          <Zap className="w-3.5 h-3.5" />
          <span>COMING SOON • PRE-ORDER WAITLIST OPEN</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-heading font-black text-white">
          Electronics Trainer Kits
        </h1>
        <p className="text-gray-300 text-base">
          Modular, robust educational hardware trainer kits engineered for electronics laboratories, robotics enthusiasts, and hands-on microcontroller experimentation.
        </p>
      </div>

      {/* Kits List */}
      <div className="space-y-12">
        {kits.map((kit) => (
          <div key={kit.id} className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/30 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase">
                  {kit.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">Status: {kit.status === 'coming_soon' ? 'Coming Soon' : 'Available'}</span>
              </div>

              <h2 className="text-3xl font-heading font-bold text-white">
                {kit.title}
              </h2>
              {kit.subtitle && (
                <p className="text-sm font-mono text-cyan-400">{kit.subtitle}</p>
              )}
              <p className="text-gray-300 text-sm leading-relaxed">
                {kit.description}
              </p>

              {/* Key Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider">Key Features:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {JSON.parse(kit.features_json || '[]').map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-gray-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications Card & Preorder */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 bg-gray-950/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400 uppercase">Kit Spec Overview</span>
                <Package className="w-5 h-5 text-amber-400" />
              </div>

              <div className="space-y-2 text-xs font-mono text-gray-300 border-t border-b border-gray-800 py-3">
                {Object.entries(JSON.parse(kit.specs_json || '{}')).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-gray-900 last:border-0">
                    <span className="text-gray-400">{k}:</span>
                    <span className="text-white text-right font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onOpenInquiry(`Electronics Trainer Kit Waitlist: ${kit.title}`)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span>Join Launch Notification List</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
