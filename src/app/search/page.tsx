import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Full-text search across developer jobs in Bangladesh.',
};

function SearchBarFallback() {
  return <Skeleton className="mx-auto h-12 w-full max-w-2xl rounded-lg" />;
}

function SearchResultsFallback() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  );
}

/** Full-text job search with debounce, recent searches, and infinite scroll. */
export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Search jobs</h1>
        <p className="mt-2 text-muted-foreground">
          Find roles by title, company name, or skill keywords
        </p>
      </div>

      <Suspense fallback={<SearchBarFallback />}>
        <SearchBar />
      </Suspense>

      <div className="mt-10">
        <Suspense fallback={<SearchResultsFallback />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
