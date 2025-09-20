'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/logo';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { signIn, sendVerificationEmail, user: authUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setSuccess(null);
    setShowResend(false);
    try {
      const userCredential = await signIn(values.email, values.password);

      if (!userCredential.user.emailVerified) {
          setError('Please verify your email address before signing in.');
          setShowResend(true);
          return;
      }
      
      router.push('/');
    } catch (err: any) {
      handleAuthError(err);
    }
  }

  const handleResendVerification = async () => {
    // This uses the user object from the time of the failed login attempt.
    const userToVerify = authUser;
     if (userToVerify) {
        setResendStatus('sending');
        try {
            await sendVerificationEmail(userToVerify);
            setResendStatus('sent');
            setSuccess('A new verification email has been sent.');
            setError(null);
        } catch (error) {
            setResendStatus('idle');
            setError('Failed to resend verification email. Please try again.');
        }
    } else {
        // Fallback for when the user might not be set in the context yet.
        // This is less likely with the check in onSubmit but serves as a safeguard.
        const email = form.getValues('email');
        if(email) {
            setError(`Could not resend email. Please try signing in again to trigger the verification prompt for ${email}.`);
        } else {
             setError('Please enter your email and try signing in again to resend the verification link.');
        }
    }
  }

  function handleAuthError(err: any) {
    switch (err.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        setError('Invalid email or password. Please try again.');
        break;
      default:
        setError('An unexpected error occurred. Please try again.');
        console.error(err);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo className="h-10 w-10" />
          </div>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>
            Sign in to continue your financial journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>
                    {error}
                    {showResend && (
                        <Button 
                            variant="link" 
                            className="p-0 h-auto mt-2 text-destructive-foreground"
                            onClick={handleResendVerification}
                            disabled={resendStatus === 'sending'}
                        >
                           {resendStatus === 'sending' ? 'Sending...' : 'Resend verification email'}
                        </Button>
                    )}
                  </AlertDescription>
                </Alert>
              )}
               {success && (
                <Alert variant="default" className="border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right text-sm">
                <Link href="/forgot-password" passHref>
                  <Button variant="link" className="px-0 h-auto">Forgot Password?</Button>
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" passHref>
                <Button variant="link" className="px-1 h-auto">Sign up</Button>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
