'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { getAuthErrorMessage } from '../lib/auth-utils';

export interface UserProfile {
  name: string;
  email: string | null;
  photoURL?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  needsProfile: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  completeProfile: (name: string) => Promise<UserProfile | null>;
  updateUserProfile: (profileData: Record<string, unknown>) => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [needsProfile, setNeedsProfile] = useState<boolean>(false);

  const checkUserProfile = useCallback(async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
  }, []);

  const createUserProfile = useCallback(async (firebaseUser: User, name: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userRef, {
      name,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return checkUserProfile(firebaseUser.uid);
  }, [checkUserProfile]);

  const updateUserProfile = async (profileData: Record<string, unknown>): Promise<UserProfile | null> => {
    if (!user) throw new Error('No user is logged in.');
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          ...profileData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      const updatedProfile = await checkUserProfile(user.uid);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setUserProfile(null);
        setNeedsProfile(false);
        setLoading(false);
        return;
      }

      try {
        const profile = await checkUserProfile(firebaseUser.uid);
        setUser(firebaseUser);
        setUserProfile(profile);
        setNeedsProfile(!profile);
      } catch (error) {
        // Keep user signed in even if profile fetch fails.
        console.error('Failed to load user profile:', error);
        setUser(firebaseUser);
        setUserProfile(null);
        setNeedsProfile(!firebaseUser.displayName);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [checkUserProfile]);

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const profile = await checkUserProfile(userCredential.user.uid);
      setNeedsProfile(!profile);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await checkUserProfile(userCredential.user.uid);
      setNeedsProfile(!profile);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const googleSignIn = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const profile = await checkUserProfile(result.user.uid);
      setNeedsProfile(!profile);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const completeProfile = async (name: string): Promise<UserProfile | null> => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No user is logged in.');

    try {
      await updateProfile(currentUser, { displayName: name });
      const profile = await createUserProfile(currentUser, name);

      setUser(auth.currentUser);
      setUserProfile(profile);
      setNeedsProfile(false);

      return profile;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        needsProfile,
        signup,
        login,
        logout,
        resetPassword,
        googleSignIn,
        completeProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
