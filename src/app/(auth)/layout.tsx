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
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    // Show a loading state or nothing while redirecting
    return <div className="flex h-screen w-screen items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}
