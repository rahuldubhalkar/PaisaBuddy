'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    User, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    isSignInWithEmailLink,
    signInWithEmailLink as firebaseSignInWithEmailLink,
    sendEmailVerification,
    applyActionCode,
} from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (name: string, email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerificationEmail: (user: User) => Promise<void>;
  verifyEmailAction: (actionCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signUp = async (name: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    
    const verificationUrl = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email` : 'http://localhost:9002/verify-email';
    // Send verification email
    await sendEmailVerification(userCredential.user, {
      url: verificationUrl, 
    });

    await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: name,
        email: email,
        createdAt: new Date(),
        learningProgress: {}, 
        portfolio: {},
        budget: {},
    });
    
    return userCredential;
  };

  const sendVerificationEmail = (user: User) => {
    const verificationUrl = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email` : 'http://localhost:9002/verify-email';
    return sendEmailVerification(user, {
        url: verificationUrl,
    });
  }

  const verifyEmailAction = (actionCode: string) => {
    return applyActionCode(auth, actionCode);
  }

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const sendPasswordReset = (email: string) => {
    const resetUrl = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/login` : 'http://localhost:9002/login';
    return sendPasswordResetEmail(auth, email, {
        url: resetUrl,
    });
  };

  const value = { 
    user, 
    loading, 
    signIn, 
    signUp, 
    signOut, 
    sendPasswordReset, 
    sendVerificationEmail,
    verifyEmailAction
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
