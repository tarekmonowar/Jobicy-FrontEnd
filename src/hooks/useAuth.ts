'use client';

// Auth hook — wraps authStore + authApi mutations for login, register, and password flows.

import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';
import * as authApi from '@/lib/api/authApi';
import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/types/api';
import type { LoginPayload, RegisterPayload } from '@/types/auth';

/** Password rules — mirror backend register/reset DTO validation. */
export const passwordSchemaMessage =
  'Password must be at least 8 characters with one uppercase letter and one number';

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/(?=.*[A-Z])(?=.*\d)/, passwordSchemaMessage);

/** Zod schemas shared by auth pages — field rules match backend DTOs. */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: passwordField,
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/** Pull a user-facing message from the standard API error envelope. */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  if (isAxiosError<ApiError>(error)) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'Request timed out. Check that the backend is running on port 4000.';
      }
      return 'Cannot reach the server. Make sure the backend is running (npm run start:dev in backend/).';
    }
    const apiErr = error.response.data?.error;
    if (apiErr) {
      const { code, message } = apiErr;
      if (code === 'EMAIL_NOT_VERIFIED') {
        return 'Please verify your email first. Check your inbox (and spam) for the verification link.';
      }
      if (code === 'EMAIL_IN_USE') {
        return 'This email is already registered. Sign in or use a different email.';
      }
      if (code === 'INVALID_CREDENTIALS') {
        return 'Incorrect email or password. Please try again.';
      }
      return message || fallback;
    }
  }
  return fallback;
}

/** Show the first form validation error as a toast (used on failed submit). */
export function toastFormErrors(errors: Record<string, { message?: string }>): void {
  const first = Object.values(errors).find((e) => e?.message);
  if (first?.message) {
    toast.error(first.message);
  } else {
    toast.error('Please fix the highlighted fields');
  }
}

/**
 * Auth actions and session selectors for pages and components.
 * Login success stores the access token in memory and honors the `next` redirect.
 */
export function useAuth() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const setAuth = useAuthStore((s) => s.setAuth);
  const storeLogout = useAuthStore((s) => s.logout);

  const isAuthed = status === 'authed' && user !== null;
  const isBootstrapping = status === 'idle';

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (_data, variables) => {
      toast.success(`Verification email sent to ${variables.email}`);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (_data, email) => {
      toast.success(`If an account exists, we sent a reset link to ${email}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not send reset email'));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Password updated! You can sign in now.');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not reset password'));
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified! You can sign in now.');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Email verification failed'));
    },
  });

  /** Login, persist session, and redirect to `next` or the jobs board. */
  const login = async (payload: LoginPayload, next?: string | null) => {
    const data = await loginMutation.mutateAsync(payload);
    setAuth({ user: data.user, accessToken: data.accessToken });
    toast.success('Welcome back!');
    const destination =
      next && next.startsWith('/') && !next.startsWith('//') ? next : '/jobs';
    router.push(destination);
  };

  /** Revoke refresh token server-side and return to the landing page. */
  const logout = async () => {
    await storeLogout();
    toast.success('Logged out');
    router.push('/');
  };

  const loading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    forgotPasswordMutation.isPending ||
    resetPasswordMutation.isPending ||
    verifyEmailMutation.isPending;

  return {
    user,
    status,
    isAuthed,
    isBootstrapping,
    login,
    register: registerMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    verifyEmail: verifyEmailMutation.mutateAsync,
    logout,
    loading,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isForgotPending: forgotPasswordMutation.isPending,
    isResetPending: resetPasswordMutation.isPending,
    isVerifyPending: verifyEmailMutation.isPending,
  };
}
