import Link from 'next/link';
import { Button } from '@/components/ui/button';

/** Friendly 404 page with a link back home. */
export default function NotFound() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center"
      role="alert"
      aria-labelledby="not-found-title"
    >
      <p className="text-6xl font-bold text-muted-foreground" aria-hidden>
        404
      </p>
      <h1 id="not-found-title" className="text-xl font-semibold">
        Page not found
      </h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
