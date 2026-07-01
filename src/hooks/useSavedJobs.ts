'use client';

// Saved jobs list + optimistic save/unsave mutations.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import * as savedApi from '@/lib/api/savedApi';
import { queryKeys } from '@/lib/queryClient';
import { getApiErrorMessage } from '@/hooks/useAuth';
import type { ApiError } from '@/types/api';
import type { JobCardDto, JobDetailDto } from '@/types/job';
import type { InfiniteData } from '@tanstack/react-query';
import type { PaginatedMeta } from '@/types/api';

type JobsPage = { data: JobCardDto[]; meta: PaginatedMeta };
type JobsInfinite = InfiniteData<JobsPage>;

/** Patch isSaved on every cached job list + detail entry. */
function patchJobSavedFlags(
  queryClient: ReturnType<typeof useQueryClient>,
  jobId: string,
  isSaved: boolean,
) {
  // Detail cache
  queryClient.setQueryData<JobDetailDto>(queryKeys.job(jobId), (old) =>
    old ? { ...old, isSaved } : old,
  );

  // All infinite job lists
  queryClient.setQueriesData<JobsInfinite>({ queryKey: ['jobs'] }, (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.map((j) => (j.id === jobId ? { ...j, isSaved } : j)),
      })),
    };
  });

  // Trending / similar / search caches
  const patchArray = (key: readonly unknown[]) => {
    queryClient.setQueryData<JobCardDto[]>(key, (old) =>
      old?.map((j) => (j.id === jobId ? { ...j, isSaved } : j)),
    );
  };
  patchArray(queryKeys.trending());
  queryClient.setQueriesData<JobCardDto[]>({ queryKey: ['similar'] }, (old) =>
    old?.map((j) => (j.id === jobId ? { ...j, isSaved } : j)),
  );
  queryClient.setQueriesData<JobsPage>({ queryKey: ['search'] }, (old) =>
    old
      ? { ...old, data: old.data.map((j) => (j.id === jobId ? { ...j, isSaved } : j)) }
      : old,
  );
}

/** List the user's saved jobs. */
export function useSaved(sort?: string) {
  return useQuery({
    queryKey: [...queryKeys.saved(), sort ?? 'latest'],
    queryFn: () => savedApi.getSaved(sort),
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
      const previousLists = queryClient.getQueriesData({ queryKey: ['jobs'] });
      const previousDetail = queryClient.getQueryData(queryKeys.job(jobId));
      patchJobSavedFlags(queryClient, jobId, true);
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
      if (code === 'ALREADY_SAVED') {
        toast.error('Job already saved');
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
      const previousLists = queryClient.getQueriesData({ queryKey: ['jobs'] });
      const previousDetail = queryClient.getQueryData(queryKeys.job(jobId));
      const previousSaved = queryClient.getQueryData(queryKeys.saved());
      patchJobSavedFlags(queryClient, jobId, false);
      return { previousLists, previousDetail, previousSaved, jobId };
    },
    onError: (_error, jobId, context) => {
      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          queryClient.setQueryData(key, data);
        }
      }
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(queryKeys.job(jobId), context.previousDetail);
      }
      if (context?.previousSaved !== undefined) {
        queryClient.setQueryData(queryKeys.saved(), context.previousSaved);
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
