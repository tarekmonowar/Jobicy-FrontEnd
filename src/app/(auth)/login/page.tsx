'use client';

// Login page — email/password form with optional `next` redirect after success.

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { loginSchema, useAuth, type LoginFormValues } from '@/hooks/useAuth';

/** Centered auth card shell shared by this page's layout. */
function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}

/** Login form — reads `next` from the URL and redirects there after auth. */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const { login, isAuthed, isBootstrapping, isLoginPending } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Already signed in — skip the login form.
  useEffect(() => {
    if (!isBootstrapping && isAuthed) {
      router.replace(next && next.startsWith('/') ? next : '/jobs');
    }
  }, [isAuthed, isBootstrapping, next, router]);

  const onSubmit = async (values: LoginFormValues) => {
    await login(values, next);
  };

  if (isBootstrapping || isAuthed) {
    return (
      <AuthShell>
        <Card className="w-full max-w-md">
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your Jobicy account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoginPending}>
              {isLoginPending ? 'Signing in…' : 'Sign in'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href={next ? `/register?next=${encodeURIComponent(next)}` : '/register'}
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}

/** Login route — Suspense boundary required for useSearchParams. */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </AuthShell>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
