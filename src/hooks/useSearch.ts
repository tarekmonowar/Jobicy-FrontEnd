'use client';

// Search page — debounced query, recent searches (localStorage), infinite results.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as jobsApi from '@/lib/api/jobsApi';
import { queryKeys } from '@/lib/queryClient';
import { useDebounce } from '@/hooks/useDebounce';

const RECENT_STORAGE_KEY = 'joblens_recent_searches';
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
 * Pass `initialQuery` from the URL; remount via `key={urlQuery}` on back/forward.
 */
export function useSearchState(initialQuery: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [recent, setRecent] = useState<string[]>(() => getRecentSearches());
  // Tracks the last query we pushed to the URL — avoids clobbering input while typing.
  const lastPushedRef = useRef(initialQuery.trim());

  // Sync input when the user navigates with back/forward (not our own router.replace).
  useEffect(() => {
    const onPopState = () => {
      const fromUrl = new URLSearchParams(window.location.search).get('q') ?? '';
      if (fromUrl !== lastPushedRef.current) {
        lastPushedRef.current = fromUrl.trim();
        setQuery(fromUrl);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Push debounced value to the URL so searches are shareable.
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    const current = searchParams.get('q') ?? '';
    if (trimmed === current) return;

    const params = new URLSearchParams(searchParams.toString());
    if (trimmed.length > 1) {
      params.set('q', trimmed);
      lastPushedRef.current = trimmed;
    } else {
      params.delete('q');
      lastPushedRef.current = '';
    }
    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : '/search', { scroll: false });
  }, [debouncedQuery, router, searchParams]);

  const submitSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (trimmed.length < 2) return;
    lastPushedRef.current = trimmed;
    setQuery(trimmed);
    addRecentSearch(trimmed);
    setRecent(getRecentSearches());
  }, []);

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
