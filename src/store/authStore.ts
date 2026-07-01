// In-memory auth session — access token never persisted to localStorage.

import { create } from 'zustand';
import * as authApi from '@/lib/api/authApi';
import type { UserDto } from '@/types/auth';

/** Max wait for silent refresh on app load — never leave status stuck on idle. */
const BOOTSTRAP_TIMEOUT_MS = 6_000;

type AuthStore = {
  accessToken: string | null;
  user: UserDto | null;
  status: 'idle' | 'authed' | 'guest';
  setAuth: (payload: { user: UserDto; accessToken: string }) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: UserDto) => void;
  clearSession: () => void;
  logout: () => Promise<void>;
  /** Try silent refresh on app load — sets authed or guest. */
  bootstrap: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  user: null,
  status: 'idle',

  setAuth: ({ user, accessToken }) =>
    set({ user, accessToken, status: 'authed' }),

  setAccessToken: (accessToken) => set({ accessToken }),

  setUser: (user) => set({ user }),

  /** Clear local session without calling the API (used by axios on refresh failure). */
  clearSession: () =>
    set({ accessToken: null, user: null, status: 'guest' }),

  /** Revoke refresh token server-side and clear local state. */
  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Cookie may already be cleared — still reset client state.
    }
    get().clearSession();
  },

  /**
   * Bootstrap session on app load: refresh cookie → access token → fetch /me.
   * Always ends as authed or guest (never stuck on idle).
   */
  bootstrap: async () => {
    const run = async () => {
      const { accessToken } = await authApi.refresh();
      set({ accessToken });
      const { user } = await authApi.me();
      set({ user, accessToken, status: 'authed' });
    };

    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Auth bootstrap timed out')), BOOTSTRAP_TIMEOUT_MS);
    });

    try {
      await Promise.race([run(), timeout]);
    } catch {
      set({ accessToken: null, user: null, status: 'guest' });
    }
  },
}));
