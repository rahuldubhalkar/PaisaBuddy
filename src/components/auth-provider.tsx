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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    const authInstance = getAuth(firebaseApp);
    const dbInstance = getFirestore(firebaseApp);
    setAuth(authInstance);
    setDb(dbInstance);

    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
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
    if (!auth) throw new Error("Auth not initialized");
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signUp = async (name: string, email: string, pass: string) => {
    if (!auth || !db) throw new Error("Auth or DB not initialized");
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
    if (!auth) throw new Error("Auth not initialized");
    return firebaseSignOut(auth);
  };

  const sendPasswordReset = (email: string) => {
    if (!auth) throw new Error("Auth not initialized");
    return sendPasswordResetEmail(auth, email);
  };

  const signInWithGoogle = async () => {
    if (!auth || !db) throw new Error("Auth or DB not initialized");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const userDocRef = doc(db, "users", result.user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            uid: result.user.uid,
            displayName: result.user.displayName,
            email: result.user.email,
            createdAt: new Date(),
            learningProgress: {},
            portfolio: {},
            budget: {},
        });
    }

    return result;
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
