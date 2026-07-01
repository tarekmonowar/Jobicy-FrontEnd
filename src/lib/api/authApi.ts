// Auth API calls — the only place that hits /api/auth/*.

import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  LoginPayload,
  LoginResponse,
  RefreshResponse,
  RegisterPayload,
  UserDto,
} from '@/types/auth';

/** Register a new account (sends verification email). */
export async function register(payload: RegisterPayload): Promise<{ user: UserDto }> {
  const res = await api.post<ApiResponse<{ user: UserDto }>>('/auth/register', payload);
  return res.data.data;
}

/** Login with email/password — refresh cookie is set by the server. */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', payload);
  return res.data.data;
}

/** Silent refresh using the httpOnly cookie — returns a new access token. */
export async function refresh(): Promise<RefreshResponse> {
  const res = await api.post<ApiResponse<RefreshResponse>>(
    '/auth/refresh',
    {},
    { _skipRefresh: true },
  );
  return res.data.data;
}

/** Revoke refresh token and clear the cookie. */
export async function logout(): Promise<{ success: true }> {
  const res = await api.post<ApiResponse<{ success: true }>>('/auth/logout');
  return res.data.data;
}

/** Request a password-reset link (always succeeds from the client's perspective). */
export async function forgotPassword(email: string): Promise<{ success: true }> {
  const res = await api.post<ApiResponse<{ success: true }>>('/auth/forgot-password', {
    email,
  });
  return res.data.data;
}

/** Set a new password using a reset token. */
export async function resetPassword(
  token: string,
  password: string,
): Promise<{ success: true }> {
  const res = await api.post<ApiResponse<{ success: true }>>('/auth/reset-password', {
    token,
    password,
  });
  return res.data.data;
}

/** Verify email via token from the verification link. */
export async function verifyEmail(token: string): Promise<{ success: true }> {
  const res = await api.get<ApiResponse<{ success: true }>>(`/auth/verify-email/${token}`);
  return res.data.data;
}

/** Fetch the currently authenticated user. */
export async function me(): Promise<{ user: UserDto }> {
  const res = await api.get<ApiResponse<{ user: UserDto }>>('/auth/me');
  return res.data.data;
}
