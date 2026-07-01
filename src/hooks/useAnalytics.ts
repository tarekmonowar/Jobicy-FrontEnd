'use client';

// Analytics dashboard queries — subset used by the landing page (full set in Phase 12).

import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '@/lib/api/analyticsApi';
import { queryKeys } from '@/lib/queryClient';
import type { AnalyticsRange } from '@/types/analytics';

/** Dashboard overview cards — total jobs, demand index, etc. */
export function useOverview() {
  return useQuery({
    queryKey: queryKeys.analytics.overview(),
    queryFn: () => analyticsApi.getOverview(),
    staleTime: 5 * 60_000,
  });
}

/** Multi-skill trend lines — used by TopSkillsPreview on the landing page. */
export function useSkillTrends(params: { range: AnalyticsRange; skills?: string[] }) {
  return useQuery({
    queryKey: queryKeys.analytics.skills(params),
    queryFn: () => analyticsApi.getSkillTrends(params),
    staleTime: 5 * 60_000,
  });
}
