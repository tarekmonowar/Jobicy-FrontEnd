'use client';

// Forgot-password page — requests a reset link (always shows success to avoid enumeration).

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
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
  useAuth,
  type ForgotPasswordFormValues,
} from '@/hooks/useAuth';

/** Request a password-reset email — shows a generic success message either way. */
export default function ForgotPasswordPage() {
  const { forgotPassword, isForgotPending } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await forgotPassword(values.email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-6 text-primary" />
            </div>
            <CardTitle>Check your inbox</CardTitle>
            <CardDescription>
              If an account exists for that email, we sent a password reset link. The
              link expires after a short time.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Back to login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot password?</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password
          </CardDescription>
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isForgotPending}>
              {isForgotPending ? 'Sending…' : 'Send reset link'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
