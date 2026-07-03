'use client';

// Register page — creates an account and prompts the user to verify email.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Mail, Loader2 } from 'lucide-react';
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
import { env } from '@/config/runtime';
import {
  getApiErrorMessage,
  registerSchema,
  toastFormErrors,
  useAuth,
  type RegisterFormValues,
} from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { AuthShell } from '@/components/auth/AuthShell';

const REGISTER_SUCCESS_KEY = 'joblens_register_success_email';

/** Inline alert — visible even if toast notifications fail to render. */
function FormAlert({ message, variant }: { message: string; variant: 'error' | 'success' }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-md border px-3 py-2 text-sm',
        variant === 'error'
          ? 'border-destructive/40 bg-destructive/10 text-destructive'
          : 'border-success/40 bg-success/10 text-success',
      )}
    >
      {variant === 'error' ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

/** Registration form with a post-submit "check your email" success state. */
export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAccount, isAuthed, isRegisterPending } = useAuth();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(REGISTER_SUCCESS_KEY);
    if (saved) {
      setRegisteredEmail(saved);
    }
  }, []);

  useEffect(() => {
    if (isAuthed) {
      router.replace('/jobs');
    }
  }, [isAuthed, router]);

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError(null);
    try {
      await registerAccount(values);
      sessionStorage.setItem(REGISTER_SUCCESS_KEY, values.email);
      setRegisteredEmail(values.email);
    } catch (error) {
      const msg = getApiErrorMessage(error, 'Registration failed. Please try again.');
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  if (registeredEmail) {
    return (
      <AuthShell>
        <Card className="w-full max-w-md text-center shadow-md">
          <CardHeader>
            <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-7 text-success" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>
              Your account was created. We sent a verification link to the address below.
            </CardDescription>
            <FormAlert
              variant="success"
              message={`Verification email sent to ${registeredEmail}. Open your inbox and click the link.`}
            />
            <div className="space-y-3 pt-1 text-left text-sm text-muted-foreground">
              <p className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 font-medium text-foreground">
                <Mail className="size-4 shrink-0 text-primary" />
                {registeredEmail}
              </p>
              <p>
                Click <strong className="text-foreground">Verify email</strong> in that message
                to activate your account. Check spam if you don&apos;t see it within a few
                minutes.
              </p>
            </div>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link
                href="/login"
                onClick={() => sessionStorage.removeItem(REGISTER_SUCCESS_KEY)}
              >
                Go to login
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => {
                sessionStorage.removeItem(REGISTER_SUCCESS_KEY);
                setRegisteredEmail(null);
              }}
            >
              Register a different email
            </Button>
          </CardFooter>
        </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Join {env.appName} to save jobs, set alerts, and track applications
          </CardDescription>
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
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Your name"
                disabled={isRegisterPending}
                aria-invalid={!!errors.name}
                {...registerField('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isRegisterPending}
                aria-invalid={!!errors.email}
                {...registerField('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                disabled={isRegisterPending}
                aria-invalid={!!errors.password}
                {...registerField('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                At least 8 characters with one uppercase letter and one number
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isRegisterPending}>
              {isRegisterPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
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
