'use client';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user is logged in, redirect them away from auth pages.
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // While loading or if user is logged in (and redirecting), show a loading screen.
  if (loading || user) {
    return <div className="flex h-screen w-screen items-center justify-center">Loading...</div>;
  }

  // If not loading and no user, show the auth page (login/signup).
  return <>{children}</>;
}
