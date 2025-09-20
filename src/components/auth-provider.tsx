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
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    Auth,
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
  signInWithGoogle: () => Promise<any>;
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
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: name,
        email: email,
        createdAt: new Date(),
        // Initialize other user-specific data
        learningProgress: {}, 
        portfolio: {},
        budget: {},
    });
    
    return userCredential;
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const sendPasswordReset = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);
  
      // Create a new user document in Firestore only if it doesn't already exist
      if (!userDoc.exists()) {
          await setDoc(userDocRef, {
              uid: result.user.uid,
              displayName: result.user.displayName,
              email: result.user.email,
              photoURL: result.user.photoURL,
              createdAt: new Date(),
              learningProgress: {},
              portfolio: {},
              budget: {},
          });
      }
      return result;
    } catch (error: any) {
      // Gracefully handle cases where the user closes the popup
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.warn('Google Sign-In popup was closed by the user.');
        return; // Return without throwing an error to prevent app crash
      }
      // For other errors, log them and re-throw so the UI can handle them
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const value = { user, loading, signIn, signUp, signOut, sendPasswordReset, signInWithGoogle };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
