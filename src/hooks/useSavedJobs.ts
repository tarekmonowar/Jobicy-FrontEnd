'use client';

// Saved jobs list + optimistic save/unsave mutations.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import * as savedApi from '@/lib/api/savedApi';
import { queryKeys } from '@/lib/queryClient';
import {
  patchJobFlagsInCache,
  removeFromSavedListCache,
  restoreJobFlagCaches,
  restoreSavedListCaches,
  snapshotJobFlagCaches,
  snapshotSavedListCaches,
} from '@/lib/patchJobCache';
import { getApiErrorMessage } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import type { ApiError } from '@/types/api';

/** List the user's saved jobs (waits for auth bootstrap). */
export function useSaved(sort?: string) {
  const authStatus = useAuthStore((s) => s.status);

  return useQuery({
    queryKey: [...queryKeys.saved(), sort ?? 'latest'],
    queryFn: () => savedApi.getSaved(sort),
    enabled: authStatus === 'authed',
  });
}

/** Optimistically toggle save on heart click. */
export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, note }: { jobId: string; note?: string }) =>
      savedApi.save(jobId, note),
    onMutate: async ({ jobId }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const snapshots = snapshotJobFlagCaches(queryClient, jobId);
      patchJobFlagsInCache(queryClient, jobId, { isSaved: true });
      return { snapshots, jobId };
    },
    onError: (error, { jobId }, context) => {
      if (context?.snapshots) {
        restoreJobFlagCaches(queryClient, context.snapshots);
      }
      const code = isAxiosError<ApiError>(error)
        ? error.response?.data?.error?.code
        : undefined;
      if (code === 'ALREADY_SAVED') {
        toast.error('Job already saved');
        patchJobFlagsInCache(queryClient, jobId, { isSaved: true });
      } else {
        toast.error(getApiErrorMessage(error, 'Could not save job'));
      }
    },
    onSuccess: () => {
      toast.success('Job saved');
      void queryClient.invalidateQueries({ queryKey: queryKeys.saved() });
    },
  });
}

/** Optimistically remove from saved list. */
export function useUnsaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => savedApi.unsave(jobId),
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const snapshots = snapshotJobFlagCaches(queryClient, jobId);
      const savedSnapshots = snapshotSavedListCaches(queryClient);
      patchJobFlagsInCache(queryClient, jobId, { isSaved: false });
      removeFromSavedListCache(queryClient, jobId);
      return { snapshots, savedSnapshots, jobId };
    },
    onError: (_error, _jobId, context) => {
      if (context?.snapshots) {
        restoreJobFlagCaches(queryClient, context.snapshots);
      }
      if (context?.savedSnapshots) {
        restoreSavedListCaches(queryClient, context.savedSnapshots);
      }
      toast.error('Could not unsave job');
    },
    onSuccess: () => {
      toast.success('Removed from saved');
      void queryClient.invalidateQueries({ queryKey: queryKeys.saved() });
    },
  });
}

/** Update note on a saved job. */
export function useUpdateSavedNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, note }: { jobId: string; note: string }) =>
      savedApi.updateNote(jobId, note),
    onSuccess: () => {
      toast.success('Note updated');
      void queryClient.invalidateQueries({ queryKey: queryKeys.saved() });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not update note'));
    },
  });
}
