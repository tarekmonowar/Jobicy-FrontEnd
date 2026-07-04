'use client';

// Applied jobs tracker — apply/unapply with optimistic UI updates.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import * as applicationsApi from '@/lib/api/applicationsApi';
import { queryKeys } from '@/lib/queryClient';
import {
  patchJobFlagsInCache,
  removeFromAppliedListCache,
  restoreJobFlagCaches,
  snapshotJobFlagCaches,
} from '@/lib/patchJobCache';
import { getApiErrorMessage } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/types/api';
import type { AppliedJobDto } from '@/types/application';

/** List jobs the user marked as applied (waits for auth bootstrap). */
export function useApplied() {
  const authStatus = useAuthStore((s) => s.status);

  return useQuery({
    queryKey: queryKeys.applied(),
    queryFn: () => applicationsApi.getApplied(),
    enabled: authStatus === 'authed',
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
    onMutate: async ({ jobId, sourceUrl }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const snapshots = snapshotJobFlagCaches(queryClient, jobId);
      patchJobFlagsInCache(queryClient, jobId, { isApplied: true });
      return { snapshots, jobId, sourceUrl };
    },
    onError: (error, { jobId }, context) => {
      if (context?.snapshots) {
        restoreJobFlagCaches(queryClient, context.snapshots);
      }
      const code = isAxiosError<ApiError>(error)
        ? error.response?.data?.error?.code
        : undefined;
      if (code === 'ALREADY_APPLIED') {
        toast.error('You already applied to this job');
        patchJobFlagsInCache(queryClient, jobId, { isApplied: true });
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
      const snapshots = snapshotJobFlagCaches(queryClient, jobId);
      const previousApplied = queryClient.getQueryData<AppliedJobDto[]>(
        queryKeys.applied(),
      );
      patchJobFlagsInCache(queryClient, jobId, { isApplied: false });
      removeFromAppliedListCache(queryClient, jobId);
      return { snapshots, previousApplied, jobId };
    },
    onError: (_error, _jobId, context) => {
      if (context?.snapshots) {
        restoreJobFlagCaches(queryClient, context.snapshots);
      }
      if (context?.previousApplied !== undefined) {
        queryClient.setQueryData(queryKeys.applied(), context.previousApplied);
      }
      toast.error('Could not remove application');
    },
    onSuccess: () => {
      toast.success('Application removed');
      void queryClient.invalidateQueries({ queryKey: queryKeys.applied() });
    },
  });
}
