'use client';

// Applied jobs tracker — apply/unapply with optimistic UI updates.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import * as applicationsApi from '@/lib/api/applicationsApi';
import { queryKeys } from '@/lib/queryClient';
import { getApiErrorMessage } from '@/hooks/useAuth';
import type { ApiError } from '@/types/api';
import type { JobCardDto, JobDetailDto } from '@/types/job';
import type { InfiniteData } from '@tanstack/react-query';
import type { PaginatedMeta } from '@/types/api';

type JobsPage = { data: JobCardDto[]; meta: PaginatedMeta };
type JobsInfinite = InfiniteData<JobsPage>;

/** Patch isApplied across cached job queries. */
function patchJobAppliedFlags(
  queryClient: ReturnType<typeof useQueryClient>,
  jobId: string,
  isApplied: boolean,
) {
  queryClient.setQueryData<JobDetailDto>(queryKeys.job(jobId), (old) =>
    old ? { ...old, isApplied } : old,
  );

  queryClient.setQueriesData<JobsInfinite>({ queryKey: ['jobs'] }, (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.map((j) => (j.id === jobId ? { ...j, isApplied } : j)),
      })),
    };
  });

  queryClient.setQueryData<JobCardDto[]>(queryKeys.trending(), (old) =>
    old?.map((j) => (j.id === jobId ? { ...j, isApplied } : j)),
  );
  queryClient.setQueriesData<JobCardDto[]>({ queryKey: ['similar'] }, (old) =>
    old?.map((j) => (j.id === jobId ? { ...j, isApplied } : j)),
  );
}

/** List jobs the user marked as applied. */
export function useApplied() {
  return useQuery({
    queryKey: queryKeys.applied(),
    queryFn: () => applicationsApi.getApplied(),
  });
}

/**
 * Record apply intent, optimistically hide CTA, open source URL on success.
 */
export function useApply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId }: { jobId: string; sourceUrl: string }) =>
      applicationsApi.apply(jobId),
    onMutate: async ({ jobId }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const previousLists = queryClient.getQueriesData({ queryKey: ['jobs'] });
      const previousDetail = queryClient.getQueryData(queryKeys.job(jobId));
      patchJobAppliedFlags(queryClient, jobId, true);
      return { previousLists, previousDetail, jobId };
    },
    onError: (error, { jobId }, context) => {
      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          queryClient.setQueryData(key, data);
        }
      }
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(queryKeys.job(jobId), context.previousDetail);
      }
      const code = isAxiosError<ApiError>(error)
        ? error.response?.data?.error?.code
        : undefined;
      if (code === 'ALREADY_APPLIED') {
        toast.error('You already applied to this job');
      } else {
        toast.error(getApiErrorMessage(error, 'Could not record application'));
      }
    },
    onSuccess: (_data, { sourceUrl }) => {
      toast.success('Application recorded');
      window.open(sourceUrl, '_blank', 'noopener,noreferrer');
      void queryClient.invalidateQueries({ queryKey: queryKeys.applied() });
    },
  });
}

/** Remove an applied-job record. */
export function useUnapply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => applicationsApi.unapply(jobId),
    onMutate: async (jobId) => {
      const previousApplied = queryClient.getQueryData(queryKeys.applied());
      const previousDetail = queryClient.getQueryData(queryKeys.job(jobId));
      patchJobAppliedFlags(queryClient, jobId, false);
      return { previousApplied, previousDetail, jobId };
    },
    onError: (_error, jobId, context) => {
      if (context?.previousApplied !== undefined) {
        queryClient.setQueryData(queryKeys.applied(), context.previousApplied);
      }
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(queryKeys.job(jobId), context.previousDetail);
      }
      toast.error('Could not remove application');
    },
    onSuccess: () => {
      toast.success('Application removed');
      void queryClient.invalidateQueries({ queryKey: queryKeys.applied() });
    },
  });
}
