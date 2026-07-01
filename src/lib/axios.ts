// Single Axios instance — auth header injection + single-flight token refresh on TOKEN_EXPIRED.

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/runtime';
import { useAuthStore } from '@/store/authStore';
import type { ApiError, ApiResponse } from '@/types/api';
import type { RefreshResponse } from '@/types/auth';

/** Extend Axios config so interceptors can mark retry/skip-refresh requests. */
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _skipRefresh?: boolean;
  }
}

/** In-flight refresh promise — concurrent 401s share one refresh call. */
let refreshPromise: Promise<string> | null = null;

/**
 * Exchange the httpOnly refresh cookie for a new access token.
 * Uses single-flight locking so parallel requests trigger exactly one refresh.
 */
async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<ApiResponse<RefreshResponse>>('/auth/refresh', {}, { _skipRefresh: true })
      .then((res) => res.data.data.accessToken)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/** The only Axios instance in the app — all API modules import this. */
export const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token from in-memory store on every outgoing request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On TOKEN_EXPIRED: refresh once, update store, retry the original request.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const original = error.config;

    if (!original || original._skipRefresh || original._retry) {
      return Promise.reject(error);
    }

    const code = error.response?.data?.error?.code;
    if (code !== 'TOKEN_EXPIRED') {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      useAuthStore.getState().setAccessToken(accessToken);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch {
      useAuthStore.getState().clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  },
);
