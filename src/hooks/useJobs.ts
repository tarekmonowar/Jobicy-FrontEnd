'use client';

// Job list/detail queries — wraps React Query + jobsApi.

import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as jobsApi from '@/lib/api/jobsApi';
import { queryKeys } from '@/lib/queryClient';
import type { JobFilters } from '@/types/job';

/**
 * Infinite-scroll job list — one page per fetch (kept for consumers that page
 * by scrolling rather than numbered pages).
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

/**
 * Numbered-pagination job list for the LinkedIn-style board.
 * Keeps the previous page's data while fetching so the list doesn't flash.
 */
export function useJobsPage(filters: JobFilters, page: number, limit = 30) {
  return useQuery({
    queryKey: queryKeys.jobs({ ...filters, page, limit }),
    queryFn: () => jobsApi.getJobs({ ...filters, page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnMount: 'always',
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
