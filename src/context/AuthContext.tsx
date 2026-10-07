import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Profile, UserRole } from '../types';
import {
  ADMIN_EMAIL,
  getSupabase,
  getActiveMockUser,
  setActiveMockUser,
  signInWithGoogle as supabaseGoogleSignIn,
  signInWithEmail as supabaseSignInWithEmail,
  signUpWithEmail as supabaseSignUpWithEmail,
  sendMagicLink as supabaseSendMagicLink,
  resetPassword as supabaseResetPassword,
  upsertUserProfile,
  isSupabaseConnected
} from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseActive: boolean;
  loginWithGoogle: () => Promise<{ error: Error | null }>;
  loginWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: Error | null; user?: unknown; requiresEmailConfirmation?: boolean }>;
  sendMagicLink: (email: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
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
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const email = session.user.email || '';
          const role: UserRole = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student';
          const profile: Profile = {
            id: session.user.id,
            email: email,
            full_name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              email.split('@')[0],
            avatar_url:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              '',
            role: role,
            created_at: session.user.created_at
          };
          setUser(profile);
          setActiveMockUser(profile);
          await upsertUserProfile(profile);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      // 2. Subscribe to auth changes
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const email = session.user.email || '';
          const role: UserRole = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student';
          const profile: Profile = {
            id: session.user.id,
            email: email,
            full_name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              email.split('@')[0],
            avatar_url:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              '',
            role: role,
            created_at: session.user.created_at
          };
          setUser(profile);
          setActiveMockUser(profile);
          await upsertUserProfile(profile);
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

  const loginWithGoogle = async (): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabaseGoogleSignIn();
      if (error) {
        console.error('Google sign-in error:', error);
        return { error: new Error(error.message) };
      }
      return { error: null };
    } else {
      return {
        error: new Error(
          'Supabase lama habayn. Fadlan geli Supabase URL & Anon Key ama isticmaal habka demo-ga.'
        )
      };
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabaseSignInWithEmail(email, password);
      if (error) {
        return { error: new Error(error.message) };
      }
      if (data?.user) {
        const userEmail = data.user.email || email;
        const role: UserRole = userEmail.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student';
        const profile: Profile = {
          id: data.user.id,
          email: userEmail,
          full_name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            userEmail.split('@')[0],
          avatar_url:
            data.user.user_metadata?.avatar_url ||
            data.user.user_metadata?.picture ||
            '',
          role: role,
          created_at: data.user.created_at
        };
        setUser(profile);
        setActiveMockUser(profile);
        await upsertUserProfile(profile);
      }
      return { error: null };
    } else {
      // Offline / demo fallback
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        loginAsDemoAdmin();
      } else {
        loginAsDemoStudent(email.split('@')[0], email);
      }
      return { error: null };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: Error | null; user?: unknown; requiresEmailConfirmation?: boolean }> => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabaseSignUpWithEmail(email, password, fullName);
      if (error) {
        return { error: new Error(error.message) };
      }
      if (data?.user) {
        const cleanEmail = email.trim().toLowerCase();
        const role: UserRole = cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student';
        const profile: Profile = {
          id: data.user.id,
          email: cleanEmail,
          full_name: fullName.trim() || cleanEmail.split('@')[0],
          avatar_url: '',
          role: role,
          created_at: data.user.created_at
        };
        if (data.session) {
          setUser(profile);
          setActiveMockUser(profile);
          await upsertUserProfile(profile);
        }
        return {
          error: null,
          user: data.user,
          requiresEmailConfirmation: !data.session
        };
      }
      return { error: null };
    } else {
      // Offline fallback
      loginAsDemoStudent(fullName, email);
      return { error: null };
    }
  };

  const sendMagicLink = async (email: string): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabaseSendMagicLink(email);
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    }
    return { error: new Error('Supabase lama xirin.') };
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabaseResetPassword(email);
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    }
    return { error: new Error('Supabase lama xirin.') };
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
    upsertUserProfile(adminUser).catch(() => {});
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
    upsertUserProfile(studentUser).catch(() => {});
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
        loginWithEmail,
        signUpWithEmail,
        sendMagicLink,
        resetPassword,
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
