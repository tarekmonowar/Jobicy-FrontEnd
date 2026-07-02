'use client';

// Forgot-password page — requests a reset link (always shows success to avoid enumeration).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2 } from 'lucide-react';
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
  forgotPasswordSchema,
  toastFormErrors,
  useAuth,
  type ForgotPasswordFormValues,
} from '@/hooks/useAuth';

const FORGOT_SUCCESS_KEY = 'jobicy_forgot_success_email';

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-muted/30 px-4 py-12">
      {children}
    </div>
  );
}

/** Request a password-reset email — shows a generic success message either way. */
export default function ForgotPasswordPage() {
  const { forgotPassword, isForgotPending } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(FORGOT_SUCCESS_KEY);
    if (saved) {
      setSubmittedEmail(saved);
    }
  }, []);

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(values.email);
      sessionStorage.setItem(FORGOT_SUCCESS_KEY, values.email);
      setSubmittedEmail(values.email);
    } catch {
      // Error toast is shown by useAuth.
    }
  };

  if (submittedEmail) {
    return (
      <AuthShell>
        <Card className="w-full max-w-md text-center shadow-md">
          <CardHeader className="space-y-3 pb-2">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check your inbox</CardTitle>
            <CardDescription>
              If an account exists for this address, we sent a password reset link.
            </CardDescription>
            <div className="space-y-3 pt-1 text-left text-sm text-muted-foreground">
              <p className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2.5 font-medium text-foreground">
                <Mail className="size-4 shrink-0 text-primary" />
                {submittedEmail}
              </p>
              <p>
                The link expires after a short time. Check spam if you don&apos;t see it within
                a few minutes.
              </p>
            </div>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3 border-t bg-muted/20 py-5">
            <Button variant="outline" asChild className="h-11 w-full">
              <Link
                href="/login"
                onClick={() => sessionStorage.removeItem(FORGOT_SUCCESS_KEY)}
              >
                Back to login
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => {
                sessionStorage.removeItem(FORGOT_SUCCESS_KEY);
                setSubmittedEmail(null);
              }}
            >
              Try a different email
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
          <CardTitle className="text-2xl">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <form
          method="post"
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmit, toastFormErrors)}
          noValidate
        >
          <CardContent className="space-y-5 pb-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isForgotPending}
                aria-invalid={!!errors.email}
                className="h-11 bg-background"
                {...registerField('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-1 h-11 w-full"
              disabled={isForgotPending}
            >
              {isForgotPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </CardContent>

          <CardFooter className="justify-center border-t bg-muted/20 py-5">
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
