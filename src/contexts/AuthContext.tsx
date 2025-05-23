import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, AuthError, SupabaseClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  supabase: SupabaseClient;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const supabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        
        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session: session,
          loading: false,
        }));
      } catch (error) {
        setAuthState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to initialize auth',
          loading: false,
        }));
      }
    };

    initializeAuth();

    // Listen for changes on auth state
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session: session,
        loading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  const handleAuthError = (error: unknown) => {
    const message = error instanceof AuthError 
      ? error.message 
      : error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';

    setAuthState(prev => ({ ...prev, error: message }));
    throw error;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      handleAuthError(error);
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabaseClient.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      handleAuthError(error);
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleAuthError(error);
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      handleAuthError(error);
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
    } catch (error) {
      handleAuthError(error);
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value = {
    ...authState,
    supabase: supabaseClient,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 