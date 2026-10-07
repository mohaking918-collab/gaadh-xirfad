import React, { useState } from 'react';
import {
  User,
  UserPlus,
  ShieldCheck,
  BookOpen,
  LogOut,
  Menu,
  X,
  Database,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../lib/supabase';

interface NavbarProps {
  activeTab: 'courses' | 'my-courses' | 'admin' | 'features';
  setActiveTab: (tab: 'courses' | 'my-courses' | 'admin' | 'features') => void;
  openAuthModal: (tab?: 'login' | 'signup') => void;
  openConfigModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  openConfigModal
}) => {
  const { user, isAdmin, logout, loginAsDemoAdmin, loginAsDemoStudent, isSupabaseActive } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('courses')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl overflow-hidden ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 group-hover:ring-emerald-400 transition-all">
              <img
                src="/logo.jpg"
                alt="Gaadh Xirfad (GX) Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  Gaadh Xirfad
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Baro Xirfado Casri ah</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'courses'
                  ? 'bg-slate-800/80 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Koorsooyinka
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'features'
                  ? 'bg-slate-800/80 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Faa'iidooyinka
            </button>

            {user && (
              <button
                onClick={() => setActiveTab('my-courses')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'my-courses'
                    ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Koorsooyinkayga</span>
              </button>
            )}

            {/* Admin Dashboard Tab (Strictly visible / highlighted for mohaking918@gmail.com) */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-400/40'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span>Maamulka (Admin)</span>
              </button>
            )}
          </div>

          {/* Right Action buttons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Supabase connection indicator button (Only visible to admin to keep public navbar clean) */}
            {isAdmin && (
              <button
                onClick={openConfigModal}
                title="Supabase Database Settings"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/70 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
              >
                <Database className={`w-3.5 h-3.5 ${isSupabaseActive ? 'text-emerald-400' : 'text-cyan-400'}`} />
                <span>{isSupabaseActive ? 'Supabase Live' : 'Database Settings'}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseActive ? 'bg-emerald-500 animate-ping' : 'bg-cyan-400'}`}></span>
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-white transition-all"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left max-w-[120px] truncate">
                    <p className="text-xs font-semibold truncate leading-tight">{user.full_name}</p>
                    <p className="text-[10px] text-slate-400 truncate leading-none">
                      {isAdmin ? 'Admin' : 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div 
                    onClick={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-medium text-slate-400">Ku soo dhowow</p>
                      <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                      <p className="text-xs text-emerald-400 truncate font-mono">{user.email}</p>
                    </div>

                    <button
                      onClick={() => setActiveTab('my-courses')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-slate-200 hover:bg-slate-800/80 transition-all text-left"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>Koorsooyinkayga</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => setActiveTab('admin')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 font-medium transition-all text-left my-1"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    {!isSupabaseActive && (
                      <>
                        <div className="my-1 border-t border-slate-800"></div>
                        <div className="px-3 py-1 text-[11px] text-slate-400 font-medium">Tijaabo (Local Dev):</div>
                        {!isAdmin ? (
                          <button
                            onClick={() => loginAsDemoAdmin()}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-amber-300 hover:bg-amber-500/10 transition-all text-left"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>U beddel Admin ({ADMIN_EMAIL})</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => loginAsDemoStudent()}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-sky-300 hover:bg-sky-500/10 transition-all text-left"
                          >
                            <User className="w-3.5 h-3.5 text-sky-400" />
                            <span>U beddel Arday (Student)</span>
                          </button>
                        )}
                      </>
                    )}

                    <div className="my-1 border-t border-slate-800"></div>

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Ka Bax (Sign Out)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white font-semibold text-xs sm:text-sm hover:bg-slate-800/60 transition-all cursor-pointer"
                >
                  Gal Koontada
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-xs sm:text-sm hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Is Diiwaangeli</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => { setActiveTab('courses'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
              activeTab === 'courses' ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-300'
            }`}
          >
            Koorsooyinka
          </button>
          
          <button
            onClick={() => { setActiveTab('features'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
              activeTab === 'features' ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-300'
            }`}
          >
            Faa'iidooyinka
          </button>

          {user && (
            <button
              onClick={() => { setActiveTab('my-courses'); setMobileMenuOpen(false); }}
              className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'my-courses' ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Koorsooyinkayga</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'admin' ? 'bg-emerald-600 text-white' : 'bg-emerald-500/15 text-emerald-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Maamulka (Admin Dashboard)</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-2 py-1 text-xs text-slate-400">
                  Logged as <strong className="text-white">{user.email}</strong>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-rose-400 bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Ka Bax (Logout)</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Gal Koontada</span>
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Is Diiwaangeli</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
