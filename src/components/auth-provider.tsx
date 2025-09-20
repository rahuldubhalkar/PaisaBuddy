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
    Auth,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink as firebaseSignInWithEmailLink,
    sendEmailVerification,
    applyActionCode,
} from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (name: string, email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signInWithEmailLink: (email: string) => Promise<void>;
  handleSignInWithEmailLink: (url: string) => Promise<any>;
  sendVerificationEmail: (user: User) => Promise<void>;
  verifyEmailAction: (actionCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const actionCodeSettings = {
  url: process.env.NEXT_PUBLIC_BASE_URL + '/finish-login',
  handleCodeInApp: true,
};


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
    
    // Send verification email
    await sendEmailVerification(userCredential.user, {
      url: process.env.NEXT_PUBLIC_BASE_URL + '/login', // Redirect here after verification
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
    return sendEmailVerification(user, {
        url: process.env.NEXT_PUBLIC_BASE_URL + '/login',
    });
  }

  const verifyEmailAction = (actionCode: string) => {
    return applyActionCode(auth, actionCode);
  }

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const sendPasswordReset = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const signInWithEmailLink = async (email: string) => {
    window.localStorage.setItem('emailForSignIn', email);
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  };

  const handleSignInWithEmailLink = async (url: string) => {
    if (isSignInWithEmailLink(auth, url)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
        if (!email) {
          throw new Error('Email is required to complete sign-in.');
        }
      }
      const result = await firebaseSignInWithEmailLink(auth, email, url);
      window.localStorage.removeItem('emailForSignIn');

      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
          await setDoc(userDocRef, {
              uid: result.user.uid,
              displayName: result.user.displayName || email.split('@')[0],
              email: result.user.email,
              photoURL: result.user.photoURL,
              createdAt: new Date(),
              learningProgress: {},
              portfolio: {},
              budget: {},
          });
      }
      return result;
    }
  };

  const value = { 
    user, 
    loading, 
    signIn, 
    signUp, 
    signOut, 
    sendPasswordReset, 
    signInWithEmailLink, 
    handleSignInWithEmailLink,
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
