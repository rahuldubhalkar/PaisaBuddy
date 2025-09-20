'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function FinishLoginPage() {
  const router = useRouter();
  const { handleSignInWithEmailLink, user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
        router.push('/');
        return;
    }
    
    const signIn = async () => {
      try {
        await handleSignInWithEmailLink(window.location.href);
        router.push('/');
      } catch (err: any) {
        setError('Invalid or expired sign-in link. Please try again.');
        console.error(err);
      }
    };
    signIn();
  }, [handleSignInWithEmailLink, router, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo className="h-10 w-10" />
          </div>
          <CardTitle>Finishing Sign In</CardTitle>
          <CardDescription>
            Please wait while we securely sign you in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 animate-pulse" />
                <p>Verifying link and redirecting...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
