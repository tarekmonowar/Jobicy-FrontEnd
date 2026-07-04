'use client';

// Analytics dashboard queries — one hook per chart endpoint (Phase 12).

import { useQueries, useQuery } from '@tanstack/react-query';
import * as analyticsApi from '@/lib/api/analyticsApi';
import { getJobs } from '@/lib/api/jobsApi';
import { queryKeys } from '@/lib/queryClient';
import type { AnalyticsRange } from '@/types/analytics';
import type { JobType, LocationType } from '@/types/job';

const STALE_MS = 5 * 60_000;

/** Dashboard overview cards — total jobs, demand index, average salary, etc. */
export function useOverview() {
  return useQuery({
    queryKey: queryKeys.analytics.overview(),
    queryFn: () => analyticsApi.getOverview(),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

/** Multi-skill trend lines over 7d or 30d (max 5 skills). */
export function useSkillTrends(params: { range: AnalyticsRange; skills?: string[] }) {
  return useQuery({
    queryKey: queryKeys.analytics.skills(params),
    queryFn: () => analyticsApi.getSkillTrends(params),
    staleTime: STALE_MS,
  });
}

/** Top hiring companies for the horizontal bar chart. */
export function useCompanies(limit = 10) {
  return useQuery({
    queryKey: queryKeys.analytics.companies(limit),
    queryFn: () => analyticsApi.getCompanies(limit),
    staleTime: STALE_MS,
  });
}

/** Salary min/avg/max grouped by developer role. */
export function useSalaries(params: { currency: 'BDT' | 'USD'; experience?: number }) {
  return useQuery({
    queryKey: queryKeys.analytics.salaries(params),
    queryFn: () => analyticsApi.getSalaries(params),
    staleTime: STALE_MS,
  });
}

/** Job counts by Bangladesh city — powers the location map bubbles. */
export function useLocations() {
  return useQuery({
    queryKey: queryKeys.analytics.locations(),
    queryFn: () => analyticsApi.getLocations(),
    staleTime: STALE_MS,
  });
}

/** Daily posting timeline with per-source breakdown. */
export function useTimeline(range: AnalyticsRange) {
  return useQuery({
    queryKey: queryKeys.analytics.timeline(range),
    queryFn: () => analyticsApi.getTimeline(range),
    staleTime: STALE_MS,
  });
}

/** Demand index gauge, history, and rising/declining skills. */
export function useDemandIndex() {
  return useQuery({
    queryKey: queryKeys.analytics.demandIndex(),
    queryFn: () => analyticsApi.getDemandIndex(),
    staleTime: STALE_MS,
  });
}

export type JobTypeBreakdownSlice = {
  name: string;
  value: number;
  group: 'work' | 'employment';
};

/** Live job counts by work arrangement + employment type (for the donut chart). */
export function useJobTypeBreakdown() {
  const filters: { key: string; name: string; group: 'work' | 'employment'; params: Record<string, unknown> }[] = [
    { key: 'remote', name: 'Remote', group: 'work', params: { locationType: ['REMOTE' as LocationType] } },
    { key: 'onsite', name: 'Onsite', group: 'work', params: { locationType: ['ONSITE' as LocationType] } },
    { key: 'hybrid', name: 'Hybrid', group: 'work', params: { locationType: ['HYBRID' as LocationType] } },
    { key: 'fullTime', name: 'Full-time', group: 'employment', params: { jobType: ['FULL_TIME' as JobType] } },
    { key: 'partTime', name: 'Part-time', group: 'employment', params: { jobType: ['PART_TIME' as JobType] } },
    { key: 'contract', name: 'Contract', group: 'employment', params: { jobType: ['CONTRACT' as JobType] } },
  ];

  const results = useQueries({
    queries: filters.map((f) => ({
      queryKey: ['an', 'jobTypeBreakdown', f.key] as const,
      queryFn: async () => {
        const { meta } = await getJobs({ ...f.params, page: 1, limit: 1 });
        return { name: f.name, value: meta.total, group: f.group };
      },
      staleTime: STALE_MS,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  const data: JobTypeBreakdownSlice[] = results
    .map((r) => r.data)
    .filter((d): d is JobTypeBreakdownSlice => d !== undefined);

  const refetch = () => {
    void Promise.all(results.map((r) => r.refetch()));
  };

  return { data, isLoading, isError, refetch };
}
