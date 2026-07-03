// Reads NEXT_PUBLIC_* env vars once at module load — fail fast if required keys are missing.

const DEV_DEFAULTS: Record<string, string> = {
  NEXT_PUBLIC_API_URL: 'http://localhost:4000/api/v1',
  NEXT_PUBLIC_SOCKET_URL: 'http://localhost:4000',
};

function requireEnv(key: string): string {
  const raw = process.env[key];
  if (!raw) {
    // Dev fallback when .env was not picked up by the client bundle yet.
    if (process.env.NODE_ENV === 'development' && DEV_DEFAULTS[key]) {
      return DEV_DEFAULTS[key];
    }
    throw new Error(
      `Missing required environment variable: ${key}. Copy frontend/.env.example to .env and fill in the values.`,
    );
  }
  // Trim whitespace; ignore accidental inline comments after the value in .env files.
  const value = raw.split('#')[0]?.trim() ?? '';
  if (!value) {
    if (process.env.NODE_ENV === 'development' && DEV_DEFAULTS[key]) {
      return DEV_DEFAULTS[key];
    }
    throw new Error(
      `Missing required environment variable: ${key}. Copy frontend/.env.example to .env and fill in the values.`,
    );
  }
  return value;
}

/** Typed public runtime config consumed by the API layer, socket, and UI helpers. */
export const env = {
  apiUrl: requireEnv('NEXT_PUBLIC_API_URL'),
  socketUrl: requireEnv('NEXT_PUBLIC_SOCKET_URL'),
  usdToBdt: Number(process.env.NEXT_PUBLIC_USD_TO_BDT ?? 120),
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Joblens',
};
