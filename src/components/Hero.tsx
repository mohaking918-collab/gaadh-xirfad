import React from 'react';
import { Search, Sparkles, Play, Users, Award, Shield } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreClick
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-900">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Madasha Barashada Xirfadaha Dijitaalka ee Soomaalida</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Ku Baro <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Xirfado Casri ah</span> Afkaaga Hooyo
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Koorsooyin tayo sare leh oo ku saabsan <strong>Web Development</strong>, <strong>Graphic Design</strong>, <strong>Video Editing</strong>, iyo <strong>Office Skills</strong>. Is-diiwaangeli oo ku bixi Zaad, EVC Plus, ama Sahal.
          </p>

          {/* Search Box in Hero */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Raadi koorso (tusaale: Web Development, Figma, Premiere Pro)..."
                className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm sm:text-base shadow-xl"
              />
              <button
                onClick={onExploreClick}
                className="absolute right-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/30"
              >
                Raadi
              </button>
            </div>
            {searchQuery && (
              <p className="text-xs text-emerald-400 mt-2 text-left px-2">
                Natiijooyinka la xiriira: "{searchQuery}"
              </p>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="glass-card p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-lg sm:text-xl font-heading">
                <Users className="w-4 h-4" />
                <span>5,000+</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Arday Dhigatay</p>
            </div>

            <div className="glass-card p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-teal-400 font-bold text-lg sm:text-xl font-heading">
                <Play className="w-4 h-4" />
                <span>25+</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Koorsooyin Ficil ah</p>
            </div>

            <div className="glass-card p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-cyan-400 font-bold text-lg sm:text-xl font-heading">
                <Award className="w-4 h-4" />
                <span>99%</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Qanacsanaanta</p>
            </div>

            <div className="glass-card p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-lg sm:text-xl font-heading">
                <Shield className="w-4 h-4" />
                <span>24/7</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Taageero WhatsApp</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
