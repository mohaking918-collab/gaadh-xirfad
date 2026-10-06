import React, { useState } from 'react';
import { X, ShieldCheck, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginAsDemoAdmin, loginAsDemoStudent, isSupabaseActive } = useAuth();
  const [emailInput, setEmailInput] = useState('');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    if (emailInput.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      loginAsDemoAdmin();
    } else {
      loginAsDemoStudent(emailInput.split('@')[0], emailInput);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-500/20 mx-auto mb-3">
            <img src="/logo.jpg" alt="Gaadh Xirfad (GX)" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading">
            Ku Soo Dhowow Gaadh Xirfad
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gal koontadaada si aad u bilowdo barashada koorsooyinka
          </p>
        </div>

        {/* Option 1: Google OAuth Button (Supabase Auth) */}
        <div className="space-y-3 mb-6">
          <button
            onClick={async () => {
              await loginWithGoogle();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-95"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Ku Gal Google / Gmail</span>
          </button>
        </div>

        {/* Demo Fast Logins (Only visible in Local Development Mode) */}
        {!isSupabaseActive && (
          <>
            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Tijaabada Local Mode
              </span>
              <div className="border-t border-slate-800 w-full" />
            </div>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => {
                  loginAsDemoAdmin();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <p className="font-bold">Gal sidii Admin ({ADMIN_EMAIL})</p>
                    <p className="text-[10px] text-amber-400/80">Tijaabi maamulka dashboard-ka</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  loginAsDemoStudent();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <p className="font-bold">Gal sidii Arday (Demo Student)</p>
                    <p className="text-[10px] text-emerald-400/80">Tijaabi aragtida ardayda</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        )}

        {/* Email form */}
        <form onSubmit={handleCustomLogin} className="space-y-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Email Gaar ah:
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Geli email-kaaga..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            Gal Email-kan
          </button>
        </form>

      </div>
    </div>
  );
};
