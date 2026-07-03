// Reads NEXT_PUBLIC_* env vars once at module load.
// Must use static process.env.NEXT_PUBLIC_* access so Next/Vercel inlines values at build time.
// Dynamic process.env[key] is NOT replaced in the browser bundle.

const DEV_DEFAULTS = {
  NEXT_PUBLIC_API_URL: 'http://localhost:4000/api/v1',
  NEXT_PUBLIC_SOCKET_URL: 'http://localhost:4000',
} as const;

type RequiredKey = keyof typeof DEV_DEFAULTS;

function readEnv(
  raw: string | undefined,
  key: RequiredKey,
): string {
  const value = (raw?.split('#')[0] ?? '').trim();
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
  apiUrl: readEnv(process.env.NEXT_PUBLIC_API_URL, 'NEXT_PUBLIC_API_URL'),
  socketUrl: readEnv(process.env.NEXT_PUBLIC_SOCKET_URL, 'NEXT_PUBLIC_SOCKET_URL'),
  usdToBdt: Number(process.env.NEXT_PUBLIC_USD_TO_BDT ?? 120),
  appName: (process.env.NEXT_PUBLIC_APP_NAME ?? 'Joblens').trim() || 'Joblens',
};
