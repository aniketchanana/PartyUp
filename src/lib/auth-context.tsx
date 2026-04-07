"use client";

import { auth, db } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    getRedirectResult,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect, // Added this import
    type User
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const USERS_COLLECTION = "users";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Listen for standard login state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 2. Catch the Google redirect result (fires only in production/redirect flow)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return; // Skip checking for redirects entirely on localhost
    }
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          const currentUser = result.user;
          await setDoc(
            doc(db, USERS_COLLECTION, currentUser.uid),
            { uid: currentUser.uid, email: currentUser.email ?? null },
            { merge: true }
          );
        }
      } catch (error) {
        console.error("Error during redirect:", error);
      }
    };
  
    handleRedirect();
  }, []);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, USERS_COLLECTION, cred.user.uid), {
      uid: cred.user.uid,
      email: cred.user.email,
    });
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    if (process.env.NODE_ENV === "development") {
      // Local: Use Popup to avoid cross-origin issues
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      
      // Save to Firestore immediately because getRedirectResult won't catch this
      await setDoc(
        doc(db, USERS_COLLECTION, currentUser.uid),
        { uid: currentUser.uid, email: currentUser.email ?? null },
        { merge: true }
      );
    } else {
      // Production: Use Redirect for better mobile support
      await signInWithRedirect(auth, provider);
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}