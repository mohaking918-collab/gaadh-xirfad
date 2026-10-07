import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LogIn,
  UserPlus,
  KeyRound,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login'
}) => {
  const {
    user,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    sendMagicLink,
    resetPassword,
    loginAsDemoAdmin,
    loginAsDemoStudent,
    isSupabaseActive
  } = useAuth();

  // Tab state: 'login' | 'signup' | 'forgot' | 'magic'
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot' | 'magic'>(initialTab);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Interactive feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Demo section collapsed/expanded
  const [showDemoOptions, setShowDemoOptions] = useState(!isSupabaseActive);

  const modalRef = useRef<HTMLDivElement>(null);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsLoading(false);
      setIsGoogleLoading(false);
    }
  }, [isOpen, initialTab]);

  // Automatically close modal when user state becomes active
  useEffect(() => {
    if (isOpen && user) {
      setSuccessMessage(`Ku soo dhowow, ${user.full_name || user.email}!`);
      const timer = setTimeout(() => {
        onClose();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onClose]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Helper to translate common Supabase error messages into Somali
  const translateAuthError = (err: string): string => {
    const lower = err.toLowerCase();
    if (lower.includes('invalid login credentials')) {
      return 'Email-ka ama furaha sirta ah (password) ma saxna. Fadlan dib u hubi.';
    }
    if (lower.includes('user already registered') || lower.includes('already exists')) {
      return 'Email-kan horay ayaa loogu diiwaangeliyey koonto. Fadlan dooro "Gal Koontada".';
    }
    if (lower.includes('password should be at least')) {
      return 'Furaha sirta ah waa inuu ugu yaraan ka koobnaadaa 6 xaraf ama tiro.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Fadlan xaqiiji email-kaaga adoo gujinaya link-ga laguu soo diray.';
    }
    if (lower.includes('rate limit') || lower.includes('too many requests')) {
      return 'Isku dayo badan ayaa dhacay. Fadlan sug wax yar ka dibna mar kale tijaabi.';
    }
    if (lower.includes('invalid email')) {
      return 'Fadlan geli ciwaan email ah oo sax ah.';
    }
    return err || 'Khalad ayaa dhacay. Fadlan hubi macluumaadkaaga.';
  };

  // 1. Google OAuth Sign-In
  const handleGoogleSignIn = async () => {
    clearMessages();
    setIsGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result?.error) {
        setErrorMessage(translateAuthError(result.error.message));
        setIsGoogleLoading(false);
      }
      // If successful, user is redirected by Supabase OAuth
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Khalad ayaa dhacay.';
      setErrorMessage(translateAuthError(msg));
      setIsGoogleLoading(false);
    }
  };

  // 2. Email & Password Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Fadlan geli email-kaaga iyo furahaaga sirta ah.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithEmail(email, password);
      if (res.error) {
        setErrorMessage(translateAuthError(res.error.message));
      } else {
        setSuccessMessage('Si guul leh ayaad u gashay koontadaada!');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Khalad ayaa dhacay.';
      setErrorMessage(translateAuthError(msg));
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Email & Password Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!fullName.trim()) {
      setErrorMessage('Fadlan qor magacaaga oo buuxa.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Fadlan qor email-kaaga.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Furaha sirta ah waa inuu ugu yaraan ka koobnaadaa 6 xaraf/tiro.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Furayaasha sirta ah ee aad gelisay isma laha. Fadlan hubi.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUpWithEmail(email, password, fullName);
      if (res.error) {
        setErrorMessage(translateAuthError(res.error.message));
      } else {
        if (res.requiresEmailConfirmation) {
          setSuccessMessage(
            'Koontadaada si guul leh ayaa loo abuuray! Waxaan email-kaaga u dirnay link xaqiijin ah. Fadlan hubi sanduuqaaga (Inbox).'
          );
        } else {
          setSuccessMessage('Koontadaada si guul leh ayaa loo abuuray! Ku soo dhowow Gaadh Xirfad.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Khalad ayaa dhacay.';
      setErrorMessage(translateAuthError(msg));
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Magic Link
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setErrorMessage('Fadlan geli email-kaaga si lagugu soo diro link-ga gelitaanka.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendMagicLink(email);
      if (res.error) {
        setErrorMessage(translateAuthError(res.error.message));
      } else {
        setSuccessMessage(
          `Waxaan link-ga gelitaanka tooska ah u dirnay: ${email}. Fadlan hubi email-kaaga!`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Khalad ayaa dhacay.';
      setErrorMessage(translateAuthError(msg));
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Password Reset
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setErrorMessage('Fadlan geli email-kaaga si laguu soo diro link-ga cusboonaysiinta.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(email);
      if (res.error) {
        setErrorMessage(translateAuthError(res.error.message));
      } else {
        setSuccessMessage(
          `Waxaan link dib-u-dejinta furaha sirta ah u dirnay: ${email}. Fadlan hubi email-kaaga!`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Khalad ayaa dhacay.';
      setErrorMessage(translateAuthError(msg));
    } finally {
      setIsLoading(false);
    }
  };

  const isAdminTyping = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md backdrop-blur-xl bg-slate-900/90 border border-slate-700/50 shadow-2xl rounded-3xl p-6 sm:p-8 text-white overflow-hidden"
      >
        {/* Glow ambient background accents */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 right-0 w-64 h-64 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Xidh daaqadda"
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-200 active:scale-90 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Logo & Heading */}
        <div className="text-center mb-6 relative z-10">
          <div className="relative mx-auto mb-3.5 w-16 h-16">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 blur-md opacity-50 animate-pulse-slow" />
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-500/20 bg-slate-950">
              <img
                src="/logo.jpg"
                alt="Gaadh Xirfad"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h2
            id="auth-modal-title"
            className="text-2xl font-black font-heading tracking-tight text-white"
          >
            Ku Soo Dhowow Gaadh Xirfad
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {activeTab === 'login' && 'Gal koontadaada si aad u sii wadato barashada koorsooyinka'}
            {activeTab === 'signup' && 'Abuur koonto cusub oo bilaash ah si aad xirfado casri ah u barato'}
            {activeTab === 'forgot' && 'Dib u deji furahaaga sirta ah si aad dib ugu hesho koontadaada'}
            {activeTab === 'magic' && 'Geli email-kaaga si lagugu soo diro link toos ah oo bilaa password ah'}
          </p>
        </div>

        {/* Pill Navigation Tabs (Login / Sign Up) */}
        {(activeTab === 'login' || activeTab === 'signup') && (
          <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6 relative z-10">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                clearMessages();
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Gal Koontada</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                clearMessages();
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Is Diiwaangeli</span>
            </button>
          </div>
        )}

        {/* Inline Alerts / Feedback */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-200 relative z-10">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400/80 hover:text-rose-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in duration-200 relative z-10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{successMessage}</div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400/80 hover:text-emerald-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* PRIMARY AUTH PROVIDER: GOOGLE OAUTH */}
        {(activeTab === 'login' || activeTab === 'signup') && (
          <div className="space-y-3 mb-5 relative z-10">
            <button
              type="button"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 disabled:opacity-70 text-slate-900 font-bold text-xs sm:text-sm shadow-lg shadow-white/5 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 text-slate-900 animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
              )}
              <span>
                {isGoogleLoading
                  ? 'Fadlan sug, waxaa lagu xirayaa Google...'
                  : activeTab === 'signup'
                  ? 'Ku Diiwaangeli Google / Gmail'
                  : 'Ku Gal Google / Gmail'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center pt-2">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900/95 px-3 text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
                Ama Email iyo Password
              </span>
              <div className="border-t border-slate-800 w-full" />
            </div>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 relative z-10">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Email-kaaga:</span>
                {isAdminTyping && (
                  <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Koontada Admin-ka
                  </span>
                )}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="geli email-kaaga (tusaale: magac@gmail.com)"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-medium text-slate-300">
                  Furaha Sirta ah (Password):
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot');
                    clearMessages();
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                >
                  Ma ilowday furaha?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Waxaa la galayaa koontada...</span>
                </>
              ) : (
                <>
                  <span>Gal Koontadaada</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Switch to Magic Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('magic');
                  clearMessages();
                }}
                className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Ama ku gal <span className="underline font-semibold text-emerald-400">Magic Link</span> (Bilaa Password)
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3 relative z-10">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Magacaaga oo Buuxa:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="tusaale: Axmed Cali Xasan"
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center justify-between">
                <span>Email-kaaga:</span>
                {isAdminTyping && (
                  <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin Email
                  </span>
                )}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tusaale: magac@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Furaha Sirta ah:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 xaraf"
                    className="w-full pl-10 pr-8 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Xaqiiji Furaha:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ku celi furaha"
                    className="w-full pl-10 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Markaad is diiwaangeliso, waxaad si buuxda u aqbashay heshiiska iyo siyaasadda Gaadh Xirfad.
            </p>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Waxaa la abuurayaa koontada...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Abuur Koonto Cusub</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
                Email-ka Koontadaada:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="geli email-kaaga..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fadlan sug...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Ii Soo Dir Link Dib-u-dejin ah</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  clearMessages();
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Ku noqo <span className="text-emerald-400 font-semibold underline">Gal Koontada</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: MAGIC LINK */}
        {activeTab === 'magic' && (
          <form onSubmit={handleMagicLinkSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
                Email-ka aad ku galayso:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="geli email-kaaga..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Waxaan toos kuugu soo diri doonaa link aad ku furto koontada adigoon u baahnayn inaad xasuusato password.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Waxaa la dirayaa link-ga...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Dir Magic Link</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  clearMessages();
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Ku noqo <span className="text-emerald-400 font-semibold underline">Password Login</span>
              </button>
            </div>
          </form>
        )}

        {/* FAST TESTING / DEMO SECTION */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 relative z-10">
          <button
            type="button"
            onClick={() => setShowDemoOptions(!showDemoOptions)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 font-medium py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tijaabi Habka Fast-Track (Demo & Test Mode)</span>
            </span>
            {showDemoOptions ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showDemoOptions && (
            <div className="space-y-2 mt-2.5 animate-in fade-in duration-150">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoAdmin();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-[11px] leading-tight">
                      Gal sidii Admin ({ADMIN_EMAIL})
                    </p>
                    <p className="text-[10px] text-amber-400/80 leading-tight">
                      Toos u fur dashboard-ka maamulka
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsDemoStudent();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-[11px] leading-tight">
                      Gal sidii Arday (Demo Student)
                    </p>
                    <p className="text-[10px] text-emerald-400/80 leading-tight">
                      Arag dashboard-ka ardayda & koorsooyinka
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Informative Trust Badge */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-center relative z-10">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <p className="text-[11px] text-slate-400">
            Xogtaada iyo koontadaadu waa kuwo si buuxda loo xafiday
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
