'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/logo';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmailAction } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const actionCode = searchParams.get('oobCode');

    if (actionCode) {
      const verify = async () => {
        try {
          await verifyEmailAction(actionCode);
          setSuccess('Your email has been verified! Redirecting you to the dashboard...');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } catch (err: any) {
          setError('Invalid or expired verification link. Please try signing up again.');
          console.error(err);
        }
      };
      verify();
    } else {
        setError('No verification code found. The link may be invalid.');
    }
  }, [searchParams, verifyEmailAction, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo className="h-10 w-10" />
          </div>
          <CardTitle>Verifying Your Email</CardTitle>
          <CardDescription>
            Please wait while we confirm your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
           {!error && !success && (
            <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 animate-pulse" />
                <p>Verifying link...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
