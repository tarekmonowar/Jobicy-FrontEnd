'use client';

// Root error boundary — explicit client component avoids Turbopack builtin global-error manifest bug.

import { Button } from '@/components/ui/button';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Catches unhandled errors in the root layout and offers a retry. */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const isEnvError = error.message.includes('NEXT_PUBLIC_');

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold">
          {isEnvError ? 'Configuration error' : 'Something went wrong'}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {isEnvError
            ? error.message
            : 'An unexpected error occurred. You can try reloading the page.'}
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  );
}
