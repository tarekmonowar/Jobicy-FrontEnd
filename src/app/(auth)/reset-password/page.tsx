'use client';

// Reset-password page — sets a new password using the token from the email link.

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
import {
  resetPasswordSchema,
  toastFormErrors,
  useAuth,
  type ResetPasswordFormValues,
} from '@/hooks/useAuth';

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-muted/30 px-4 py-12">
      {children}
    </div>
  );
}

/** Reset form — token comes from `?token=` in the email link. */
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isResetPending } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;
    try {
      await resetPassword({ token, password: values.password });
      router.push('/login');
    } catch {
      // Error toast is shown by useAuth.
    }
  };

  if (!token) {
    return (
      <AuthShell>
        <Card className="w-full max-w-md text-center shadow-md">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl">Invalid reset link</CardTitle>
            <CardDescription>
              This password reset link is missing or invalid. Request a new one below.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3 border-t bg-muted/20 py-5">
            <Button asChild className="h-11 w-full">
              <Link href="/forgot-password">Request new link</Link>
            </Button>
            <Button variant="outline" asChild className="h-11 w-full">
              <Link href="/login">Back to login</Link>
            </Button>
          </CardFooter>
        </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl">Set a new password</CardTitle>
          <CardDescription>Choose a strong password for your account</CardDescription>
        </CardHeader>
        <form
          method="post"
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmit, toastFormErrors)}
          noValidate
        >
          <CardContent className="space-y-5 pb-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                New password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                disabled={isResetPending}
                aria-invalid={!!errors.password}
                className="h-11 bg-background"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                disabled={isResetPending}
                aria-invalid={!!errors.confirmPassword}
                className="h-11 bg-background"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-1 h-11 w-full"
              disabled={isResetPending}
            >
              {isResetPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating…
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </CardContent>

          <CardFooter className="justify-center border-t bg-muted/20 py-5">
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="font-medium text-primary hover:underline">
                Back to login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}

/** Reset-password route — Suspense boundary required for useSearchParams. */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <Card className="w-full max-w-md shadow-md">
            <CardContent className="pt-6">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </AuthShell>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
