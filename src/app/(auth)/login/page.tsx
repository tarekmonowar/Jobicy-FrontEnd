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
import { AuthShell } from '@/components/auth/AuthShell';

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
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your Jobicy account</CardDescription>
        </CardHeader>
        <form
          method="post"
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit, toastFormErrors)(e);
          }}
          noValidate
        >
          <CardContent className="space-y-5 pb-6">
            {submitError && <FormAlert message={submitError} variant="error" />}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isLoginPending}
                aria-invalid={!!errors.email}
                className="h-11 bg-background"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">
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
                placeholder="Enter your password"
                disabled={isLoginPending}
                aria-invalid={!!errors.password}
                className="h-11 bg-background"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-1 h-11 w-full"
              disabled={isLoginPending}
            >
              {isLoginPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </CardContent>

          <CardFooter className="justify-center border-t bg-muted/20 py-5">
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
