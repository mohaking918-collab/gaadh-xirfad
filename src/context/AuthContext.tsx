import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Profile } from '../types';
import {
  ADMIN_EMAIL,
  getSupabase,
  getActiveMockUser,
  setActiveMockUser,
  signInWithGoogle as supabaseGoogleSignIn,
  isSupabaseConnected
} from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseActive: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoAdmin: () => void;
  loginAsDemoStudent: (name?: string, email?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    setIsSupabaseActive(isSupabaseConnected());

    if (supabase) {
      // 1. Check existing Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const email = session.user.email || '';
          const profile: Profile = {
            id: session.user.id,
            email: email,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
            role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student',
            created_at: session.user.created_at
          };
          setUser(profile);
        } else {
          // In real Supabase mode, do not force mock user
          setUser(null);
        }
        setIsLoading(false);
      });

      // 2. Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const email = session.user.email || '';
          const profile: Profile = {
            id: session.user.id,
            email: email,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
            role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student',
            created_at: session.user.created_at
          };
          setUser(profile);
          setActiveMockUser(profile);
        } else {
          setUser(null);
          setActiveMockUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      const mockUser = getActiveMockUser();
      if (mockUser) {
        setUser(mockUser);
      }
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabaseGoogleSignIn();
      if (error) {
        console.error('Google sign-in error:', error);
        alert('Khalad ayaa ka dhacay Google sign-in: ' + error.message);
      }
    } else {
      alert('Fadlan geli Supabase Project URL iyo Anon Key (faylka .env.local ama badhanka Database Settings) si Google OAuth toos ugu xirmo Supabase.');
    }
  };

  const loginAsDemoAdmin = () => {
    const adminUser: Profile = {
      id: 'admin-mohaking',
      email: ADMIN_EMAIL,
      full_name: 'Mohamed Admin (Gaadh Xirfad)',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      role: 'admin',
      created_at: new Date().toISOString()
    };
    setUser(adminUser);
    setActiveMockUser(adminUser);
  };

  const loginAsDemoStudent = (name = 'Liibaan Cumar', email = 'liibaan@example.com') => {
    const studentUser: Profile = {
      id: 'student-' + Date.now(),
      email: email,
      full_name: name,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      role: 'student',
      created_at: new Date().toISOString()
    };
    setUser(studentUser);
    setActiveMockUser(studentUser);
  };

  const logout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setUser(null);
    setActiveMockUser(null);
  };

  const isAdmin = user?.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        isSupabaseActive,
        loginWithGoogle,
        loginAsDemoAdmin,
        loginAsDemoStudent,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
