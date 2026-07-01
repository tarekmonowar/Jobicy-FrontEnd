'use client';

// Job list/detail queries — wraps React Query + jobsApi.

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as jobsApi from '@/lib/api/jobsApi';
import { queryKeys } from '@/lib/queryClient';
import type { JobFilters } from '@/types/job';

/**
 * Infinite-scroll job list for the board — one page per fetch.
 */
export function useJobs(filters: JobFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.jobs(filters),
    queryFn: ({ pageParam }) =>
      jobsApi.getJobs({ ...filters, page: pageParam as number, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined,
  });
}

/** Single job detail — increments view count on the server. */
export function useJob(id: string) {
  return useQuery({
    queryKey: queryKeys.job(id),
    queryFn: () => jobsApi.getJob(id),
    enabled: Boolean(id),
  });
}

/** Top jobs today (max 10). */
export function useTrending() {
  return useQuery({
    queryKey: queryKeys.trending(),
    queryFn: () => jobsApi.getTrending(),
  });
}

/** Similar jobs by skills/category (max 6). */
export function useSimilar(id: string, limit = 6) {
  return useQuery({
    queryKey: queryKeys.similar(id),
    queryFn: () => jobsApi.getSimilar(id, limit),
    enabled: Boolean(id),
  });
}

/** Full-text search — enabled when query length > 1. */
export function useSearchJobs(q: string, page = 1) {
  return useQuery({
    queryKey: [...queryKeys.search(q), page],
    queryFn: () => jobsApi.searchJobs(q, page),
    enabled: q.trim().length > 1,
  });
}
