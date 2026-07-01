// Reads NEXT_PUBLIC_* env vars once at module load — fail fast if required keys are missing.

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
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
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Jobicy',
};
