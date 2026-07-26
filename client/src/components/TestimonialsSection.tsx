import React from 'react';
import { Star, Quote, CheckCircle2, Building2, GraduationCap, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      client_name: "Shri Samarth Enterprises",
      role: "Local Business Owner",
      category: "Web Site Development",
      rating: 5,
      comment: "Engiverse designed an incredible custom modern website for our business. We started getting direct WhatsApp orders and Google customer calls within 2 weeks of launching!",
      icon: Building2,
      accentColor: "border-cyan-500/40"
    },
    {
      id: 2,
      client_name: "Polytechnic Electronics Team",
      role: "Diploma Engineering Students",
      category: "Engineering & Diploma Projects",
      rating: 5,
      comment: "Complete hardware schematic design, ESP32 IoT coding, and synopsis project report for our final year viva. Received top marks and zero errors during practical demonstration!",
      icon: GraduationCap,
      accentColor: "border-violet-500/40"
    },
    {
      id: 3,
      client_name: "Apex Tech Solutions",
      role: "Enterprise Web Client",
      category: "Web Site Management",
      rating: 5,
      comment: "Hassle-free monthly website management! Daily database backup monitoring, fast content updates, and 100% server uptime. Highly reliable engineering team.",
      icon: ShieldCheck,
      accentColor: "border-pink-500/40"
    }
  ];

  return (
    <section className="space-y-8 relative z-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Verified Client Reviews</span>
        <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
          Trusted By Local Enterprises & Engineering Talent
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm font-sans">
          Real feedback from local business owners and diploma/degree students who engineered their success with Engiverse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => {
          const IconComp = rev.icon;
          return (
            <div
              key={rev.id}
              className={`glass-panel p-6 sm:p-8 rounded-3xl border ${rev.accentColor} space-y-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
            >
              {/* Background Quote watermark */}
              <Quote className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-800/20 pointer-events-none group-hover:text-cyan-500/10 transition-colors" />

              {/* Star Rating */}
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans italic">
                "{rev.comment}"
              </p>

              {/* Client Info */}
              <div className="pt-4 border-t border-gray-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm font-heading flex items-center gap-1.5">
                    <span>{rev.client_name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 inline shrink-0" />
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono block">{rev.role} • {rev.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
