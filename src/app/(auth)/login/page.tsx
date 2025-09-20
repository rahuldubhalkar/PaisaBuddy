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
import { XCircle, CheckCircle, Mail } from 'lucide-react';
import { Logo } from '@/components/logo';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }).optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithEmailLink } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

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
    try {
      if (loginMethod === 'password') {
        if (!values.password) {
          setError('Password is required.');
          return;
        }
        await signIn(values.email, values.password);
        router.push('/');
      } else {
        await signInWithEmailLink(values.email);
        setSuccess(`A sign-in link has been sent to ${values.email}. Please check your inbox.`);
        form.reset();
      }
    } catch (err: any) {
      handleAuthError(err);
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
            {loginMethod === 'password' ? 'Sign in to continue your financial journey.' : 'Enter your email to receive a secure sign-in link.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
               {success && (
                <Alert variant="default" className="border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>Check your Email</AlertTitle>
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
              {loginMethod === 'password' && (
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
              )}
              {loginMethod === 'password' && (
                <div className="text-right text-sm">
                  <Link href="/forgot-password" passHref>
                    <Button variant="link" className="px-0 h-auto">Forgot Password?</Button>
                  </Link>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting 
                  ? 'Sending...' 
                  : loginMethod === 'password' 
                  ? 'Sign In' 
                  : 'Send Sign-in Link'}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
        
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setLoginMethod(prev => prev === 'password' ? 'otp' : 'password')}>
            <Mail className="mr-2 h-4 w-4" />
            {loginMethod === 'password' ? 'Sign in with Email Link' : 'Sign in with Password'}
          </Button>
          

          <p className="mt-4 text-center text-sm text-muted-foreground">
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
