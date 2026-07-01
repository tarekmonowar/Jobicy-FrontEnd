'use client';

// Register page — creates an account and prompts the user to verify email.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
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
import { registerSchema, useAuth, type RegisterFormValues } from '@/hooks/useAuth';

/** Registration form with a post-submit "check your email" success state. */
export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isAuthed, isBootstrapping, isRegisterPending } =
    useAuth();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  useEffect(() => {
    if (!isBootstrapping && isAuthed) {
      router.replace('/jobs');
    }
  }, [isAuthed, isBootstrapping, router]);

  const onSubmit = async (values: RegisterFormValues) => {
    await registerUser(values);
    setRegisteredEmail(values.email);
  };

  if (registeredEmail) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-6 text-success" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a verification link to{' '}
              <span className="font-medium text-foreground">{registeredEmail}</span>.
              Click the link to activate your account, then sign in.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/login">Go to login</Link>
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
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Join Jobicy to save jobs, set alerts, and track applications
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={!!errors.name}
                {...register('name')}
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
                aria-invalid={!!errors.email}
                {...register('email')}
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
                aria-invalid={!!errors.password}
                {...register('password')}
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
              {isRegisterPending ? 'Creating account…' : 'Create account'}
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
    </div>
  );
}
