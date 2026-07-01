'use client';

// Login page — email/password form with optional `next` redirect after success.

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
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
import {
  getApiErrorMessage,
  loginSchema,
  toastFormErrors,
  useAuth,
  type LoginFormValues,
} from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

/** Centered auth card shell shared by this page's layout. */
function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}

/** Inline alert — visible even if toast notifications fail to render. */
function FormAlert({ message, variant }: { message: string; variant: 'error' | 'info' }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-md border px-3 py-2 text-sm',
        variant === 'error'
          ? 'border-destructive/40 bg-destructive/10 text-destructive'
          : 'border-primary/30 bg-primary/5 text-foreground',
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/** Login form — reads `next` from the URL and redirects there after auth. */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const { login, isAuthed, isLoginPending } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Already signed in — redirect away from login.
  useEffect(() => {
    if (isAuthed) {
      router.replace(next && next.startsWith('/') ? next : '/jobs');
    }
  }, [isAuthed, next, router]);

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    try {
      await login(values, next);
    } catch (error) {
      const msg = getApiErrorMessage(error, 'Sign in failed. Please try again.');
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  // Brief redirect state only — never block the form while bootstrap runs.
  if (isAuthed) {
    return (
      <AuthShell>
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Redirecting…
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
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit, toastFormErrors)(e);
          }}
          noValidate
        >
          <CardContent className="space-y-4">
            {submitError && <FormAlert message={submitError} variant="error" />}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isLoginPending}
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
                disabled={isLoginPending}
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
              {isLoginPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
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
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        </AuthShell>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
