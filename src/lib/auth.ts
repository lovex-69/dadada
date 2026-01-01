import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';
import { User, AuthError } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const ANON_USER_KEY = 'anon-user-id';

export class AuthenticationError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
  }
}

function mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || undefined,
    displayName: firebaseUser.displayName || undefined,
    isAnonymous: firebaseUser.isAnonymous,
    createdAt: Date.now(),
  };
}

function getUserFriendlyErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address format';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email';
    case 'auth/weak-password':
      return 'Password should be at least 8 characters with 1 uppercase and 1 number';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please contact support';
    default:
      return 'An error occurred. Please try again';
  }
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function loginAnonymously(): Promise<User> {
  if (typeof window === 'undefined' || !auth) {
    const fallbackUid = `anon-${uuidv4()}`;
    return {
      uid: fallbackUid,
      isAnonymous: true,
      createdAt: Date.now(),
    };
  }

  try {
    const result = await signInAnonymously(auth);
    const user = mapFirebaseUserToUser(result.user);
    
    localStorage.setItem(ANON_USER_KEY, user.uid);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Anonymous login successful', user.uid);
    }
    
    return user;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Anonymous login failed, using fallback', error);
    }
    
    const fallbackUid = `anon-${uuidv4()}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem(ANON_USER_KEY, fallbackUid);
    }
    
    return {
      uid: fallbackUid,
      isAnonymous: true,
      createdAt: Date.now(),
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined' || !auth) {
    return null;
  }

  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        resolve(mapFirebaseUserToUser(firebaseUser));
      } else {
        const anonUserId = localStorage.getItem(ANON_USER_KEY);
        if (anonUserId) {
          resolve({
            uid: anonUserId,
            isAnonymous: true,
            createdAt: Date.now(),
          });
        } else {
          resolve(null);
        }
      }
    });
  });
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  if (typeof window === 'undefined' || !auth) {
    throw new AuthenticationError('auth/unavailable', 'Authentication is not available on the server');
  }

  try {
    if (!validateEmail(email)) {
      throw new AuthenticationError('auth/invalid-email', 'Invalid email address format');
    }

    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = mapFirebaseUserToUser(result.user);
    
    localStorage.removeItem(ANON_USER_KEY);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Email login successful', user.email);
    }
    
    return user;
  } catch (error: any) {
    const friendlyMessage = getUserFriendlyErrorMessage(error.code);
    throw new AuthenticationError(error.code, friendlyMessage);
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  if (typeof window === 'undefined' || !auth) {
    throw new AuthenticationError('auth/unavailable', 'Authentication is not available on the server');
  }

  try {
    if (!validateEmail(email)) {
      throw new AuthenticationError('auth/invalid-email', 'Invalid email address format');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new AuthenticationError('auth/weak-password', passwordValidation.message || 'Password is too weak');
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = mapFirebaseUserToUser(result.user);
    
    localStorage.removeItem(ANON_USER_KEY);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Sign up successful', user.email);
    }
    
    return user;
  } catch (error: any) {
    const friendlyMessage = getUserFriendlyErrorMessage(error.code);
    throw new AuthenticationError(error.code, friendlyMessage);
  }
}

export async function logout(): Promise<void> {
  if (typeof window === 'undefined' || !auth) {
    return;
  }

  try {
    await signOut(auth);
    localStorage.removeItem(ANON_USER_KEY);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Logout successful');
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Logout error:', error);
    }
    throw new AuthenticationError(error.code, 'Failed to sign out');
  }
}

export async function updateUserProfile(displayName: string): Promise<void> {
  if (typeof window === 'undefined' || !auth) {
    throw new AuthenticationError('auth/unavailable', 'Authentication is not available on the server');
  }

  try {
    if (!auth.currentUser) {
      throw new AuthenticationError('auth/no-user', 'No user is currently signed in');
    }

    await updateProfile(auth.currentUser, { displayName });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Profile updated', displayName);
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Profile update error:', error);
    }
    throw new AuthenticationError(error.code, 'Failed to update profile');
  }
}

export async function passwordReset(email: string): Promise<void> {
  if (typeof window === 'undefined' || !auth) {
    throw new AuthenticationError('auth/unavailable', 'Authentication is not available on the server');
  }

  try {
    if (!validateEmail(email)) {
      throw new AuthenticationError('auth/invalid-email', 'Invalid email address format');
    }

    await sendPasswordResetEmail(auth, email);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset email sent', email);
    }
  } catch (error: any) {
    const friendlyMessage = getUserFriendlyErrorMessage(error.code);
    throw new AuthenticationError(error.code, friendlyMessage);
  }
}
