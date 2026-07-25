import React, { useEffect, useState } from 'react';
import { Search, Filter, GraduationCap, ArrowRight, Code, Cpu, ExternalLink } from 'lucide-react';

interface ProjectsPageProps {
  onOpenInquiry: (category?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenInquiry }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('/api/v1/public/projects')
      .then(res => res.json())
      .then(data => setProjects(data.projects || []))
      .catch(console.error);
  }, []);

  const categories = ['All', 'IoT & Embedded', 'Robotics', 'Software & Web', 'Diploma', 'Engineering Degree'];

  const filteredProjects = projects.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.short_desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Innovation Gallery</span>
        <h1 className="text-4xl sm:text-6xl font-heading font-black text-white">
          Diploma & Degree Projects
        </h1>
        <p className="text-gray-300 text-base">
          Explore our real-world engineering project implementations covering Embedded Systems, IoT, Robotics, Web Applications, and Microcontroller projects.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((p) => (
          <div key={p.id} className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="relative h-52 overflow-hidden bg-gray-900">
                <img
                  src={p.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-mono">
                  {p.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-xl font-heading font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {p.short_desc}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {JSON.parse(p.technologies_json || '[]').map((t: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-cyan-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onOpenInquiry(`Engineering Project Inquiry: ${p.title}`)}
                className="w-full py-3 rounded-xl bg-gray-900 hover:bg-cyan-950 border border-gray-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
              >
                <span>Request Project Guidance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
