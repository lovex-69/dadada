import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types';
import {
  loginAnonymously,
  getCurrentUser,
  loginWithEmail as authLoginWithEmail,
  signUpWithEmail as authSignUpWithEmail,
  logout as authLogout,
  updateUserProfile as authUpdateUserProfile,
  passwordReset as authPasswordReset,
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !auth) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser && mounted) {
          const anonUser = await loginAnonymously();
          setUser(anonUser);
        } else if (mounted) {
          setUser(currentUser);
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auth initialization error:', err);
        }
        if (mounted) {
          setError('Failed to initialize authentication');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && mounted) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          displayName: firebaseUser.displayName || undefined,
          isAnonymous: firebaseUser.isAnonymous,
          createdAt: Date.now(),
        });
        setLoading(false);
      } else if (!firebaseUser && mounted && !loading) {
        initializeAuth();
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const loggedInUser = await authLoginWithEmail(email, password);
      setUser(loggedInUser);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  const handleSignUpWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const newUser = await authSignUpWithEmail(email, password);
      setUser(newUser);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setError(null);
      await authLogout();
      const anonUser = await loginAnonymously();
      setUser(anonUser);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      throw err;
    }
  };

  const handleUpdateProfile = async (displayName: string): Promise<void> => {
    try {
      setError(null);
      await authUpdateUserProfile(displayName);
      if (user) {
        setUser({ ...user, displayName });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const handleResetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await authPasswordReset(email);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
      throw err;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    loginWithEmail: handleLoginWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    resetPassword: handleResetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
