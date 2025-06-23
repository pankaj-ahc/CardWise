'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { SplashScreen } from '@/components/splash-screen';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000); // Minimum splash screen time

    return () => {
      unsubscribe();
      clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isInitializing) return; // Wait until initialization is complete

    // If we are done loading, and there's no user, and we are not on the login page
    if (!user && pathname !== '/') {
        router.push('/');
    }
    // If we are done loading, and there's a user, and we are on the login page
    if (user && pathname === '/') {
        router.push('/dashboard');
    }
  }, [isInitializing, user, router, pathname]);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, loading: isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
