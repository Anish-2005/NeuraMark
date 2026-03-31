import { FirebaseError } from 'firebase/app';

export const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export const validateEmail = (email: string): string | null => {
  const value = normalizeEmail(email);
  if (!value) return 'Email is required.';
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return isValid ? null : 'Please enter a valid email address.';
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
};

export const validateName = (name: string): string | null => {
  const value = name.trim();
  if (!value) return 'Please enter your name.';
  if (value.length < 2) return 'Name must be at least 2 characters.';
  if (value.length > 60) return 'Name must be shorter than 60 characters.';
  return null;
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled.';
      case 'auth/popup-blocked':
        return 'Google sign-in popup was blocked. Please allow popups and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few minutes and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }

  if (error instanceof Error && error.message.trim()) return error.message;
  return 'Something went wrong. Please try again.';
};
