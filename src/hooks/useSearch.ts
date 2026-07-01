'use client';

// Search page — debounced query, recent searches (localStorage), infinite results.

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as jobsApi from '@/lib/api/jobsApi';
import { queryKeys } from '@/lib/queryClient';
import { useDebounce } from '@/hooks/useDebounce';

const RECENT_STORAGE_KEY = 'jobicy_recent_searches';
const MAX_RECENT = 8;

/** Curated popular queries shown when the search box is empty. */
export const POPULAR_SEARCHES = [
  'React',
  'Node.js',
  'Fullstack',
  'Remote',
  'Backend Developer',
  'Frontend Engineer',
  'TypeScript',
  'DevOps',
] as const;

/** Read recent searches from localStorage (newest first). */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === 'string').slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

/** Persist a search term at the front of the recent list (deduped). */
export function addRecentSearch(query: string): void {
  const trimmed = query.trim();
  if (trimmed.length < 2) return;
  const next = [trimmed, ...getRecentSearches().filter((s) => s !== trimmed)].slice(
    0,
    MAX_RECENT,
  );
  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
}

/** Clear all stored recent searches. */
export function clearRecentSearches(): void {
  localStorage.removeItem(RECENT_STORAGE_KEY);
}

/**
 * URL-synced search input with debounce and recent-search helpers.
 * Updates `?q=` in the address bar when the debounced query changes.
 */
export function useSearchState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(urlQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [recent, setRecent] = useState<string[]>([]);

  // Hydrate recent list on mount (client-only).
  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  // Keep local input in sync when the user navigates with back/forward.
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Push debounced value to the URL so searches are shareable.
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    const current = searchParams.get('q') ?? '';
    if (trimmed === current) return;

    const params = new URLSearchParams(searchParams.toString());
    if (trimmed.length > 1) {
      params.set('q', trimmed);
      addRecentSearch(trimmed);
      setRecent(getRecentSearches());
    } else {
      params.delete('q');
    }
    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : '/search', { scroll: false });
  }, [debouncedQuery, router, searchParams]);

  const submitSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (trimmed.length < 2) return;
      setQuery(trimmed);
      addRecentSearch(trimmed);
      setRecent(getRecentSearches());
    },
    [],
  );

  const clearRecent = useCallback(() => {
    clearRecentSearches();
    setRecent([]);
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery: debouncedQuery.trim(),
    recent,
    popular: POPULAR_SEARCHES,
    submitSearch,
    clearRecent,
  };
}

/**
 * Infinite-scroll full-text search — enabled when query length > 1.
 */
export function useSearch(q: string) {
  const trimmed = q.trim();

  return useInfiniteQuery({
    queryKey: queryKeys.search(trimmed),
    queryFn: ({ pageParam }) => jobsApi.searchJobs(trimmed, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined,
    enabled: trimmed.length > 1,
  });
}
