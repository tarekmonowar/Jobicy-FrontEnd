// Reads NEXT_PUBLIC_* env vars once at module load.

const DEV_DEFAULTS = {
  NEXT_PUBLIC_API_URL: 'http://localhost:4000/api/v1',
  NEXT_PUBLIC_SOCKET_URL: 'http://localhost:4000',
} as const;

type RequiredKey = keyof typeof DEV_DEFAULTS;

function requireEnv(key: RequiredKey): string {
  const value = (process.env[key]?.split('#')[0] ?? '').trim();
  if (value) {
    return value;
  }
  if (process.env.NODE_ENV === 'development') {
    return DEV_DEFAULTS[key];
  }
  throw new Error(
    `Missing ${key}. Vercel → Settings → Environment Variables → enable Production → Redeploy.`,
  );
}

/** Typed public runtime config consumed by the API layer, socket, and UI helpers. */
export const env = {
  apiUrl: requireEnv('NEXT_PUBLIC_API_URL'),
  socketUrl: requireEnv('NEXT_PUBLIC_SOCKET_URL'),
  usdToBdt: Number(process.env.NEXT_PUBLIC_USD_TO_BDT ?? 120),
  appName: (process.env.NEXT_PUBLIC_APP_NAME ?? 'Joblens').trim() || 'Joblens',
};
