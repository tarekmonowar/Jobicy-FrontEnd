// Shared React Query cache patchers for job isSaved / isApplied flags.
// Handles flat paginated lists (useJobsPage), infinite lists (useJobs/useSearch),
// and plain JobCardDto[] caches (trending, similar, recommendations).

import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import type { AppliedJobDto } from '@/types/application';
import type { PaginatedMeta } from '@/types/api';
import type { JobCardDto, JobDetailDto, SavedJobDto } from '@/types/job';
import { queryKeys } from '@/lib/queryClient';

type JobsPage = { data: JobCardDto[]; meta: PaginatedMeta };
type JobsInfinite = InfiniteData<JobsPage>;

export type JobFlagPatch = {
  isSaved?: boolean;
  isApplied?: boolean;
};

function patchJobCard(
  job: JobCardDto,
  jobId: string,
  patch: JobFlagPatch,
): JobCardDto {
  if (job.id !== jobId) return job;
  return { ...job, ...patch };
}

/** Patch job flags inside any cached list shape (flat page, infinite, or array). */
function patchListCacheValue(
  old: unknown,
  jobId: string,
  patch: JobFlagPatch,
): unknown {
  if (!old) return old;

  if (
    typeof old === 'object' &&
    'pages' in old &&
    Array.isArray((old as JobsInfinite).pages)
  ) {
    const infinite = old as JobsInfinite;
    return {
      ...infinite,
      pages: infinite.pages.map((page) => ({
        ...page,
        data: page.data.map((job) => patchJobCard(job, jobId, patch)),
      })),
    };
  }

  if (
    typeof old === 'object' &&
    'data' in old &&
    'meta' in old &&
    Array.isArray((old as JobsPage).data)
  ) {
    const page = old as JobsPage;
    return {
      ...page,
      data: page.data.map((job) => patchJobCard(job, jobId, patch)),
    };
  }

  if (Array.isArray(old)) {
    return (old as JobCardDto[]).map((job) => patchJobCard(job, jobId, patch));
  }

  return old;
}

/** Update isSaved / isApplied on job detail and every cached job list. */
export function patchJobFlagsInCache(
  queryClient: QueryClient,
  jobId: string,
  patch: JobFlagPatch,
): void {
  queryClient.setQueryData<JobDetailDto>(queryKeys.job(jobId), (old) =>
    old ? { ...old, ...patch } : old,
  );

  queryClient.setQueriesData({ queryKey: ['jobs'] }, (old) =>
    patchListCacheValue(old, jobId, patch),
  );

  queryClient.setQueriesData({ queryKey: ['search'] }, (old) =>
    patchListCacheValue(old, jobId, patch),
  );

  queryClient.setQueryData(queryKeys.trending(), (old) =>
    patchListCacheValue(old, jobId, patch),
  );

  queryClient.setQueriesData({ queryKey: ['similar'] }, (old) =>
    patchListCacheValue(old, jobId, patch),
  );

  queryClient.setQueryData(queryKeys.recommendations(), (old) =>
    patchListCacheValue(old, jobId, patch),
  );
}

/** Snapshot every query cache that patchJobFlagsInCache may touch. */
export function snapshotJobFlagCaches(
  queryClient: QueryClient,
  jobId: string,
): Array<[QueryKey, unknown]> {
  const keys: QueryKey[] = [
    queryKeys.job(jobId),
    queryKeys.trending(),
    queryKeys.recommendations(),
  ];

  const snapshots: Array<[QueryKey, unknown]> = keys.map((key) => [
    key,
    queryClient.getQueryData(key),
  ]);

  for (const [key, data] of queryClient.getQueriesData({ queryKey: ['jobs'] })) {
    snapshots.push([key, data]);
  }
  for (const [key, data] of queryClient.getQueriesData({ queryKey: ['search'] })) {
    snapshots.push([key, data]);
  }
  for (const [key, data] of queryClient.getQueriesData({ queryKey: ['similar'] })) {
    snapshots.push([key, data]);
  }

  return snapshots;
}

/** Restore snapshots produced by snapshotJobFlagCaches. */
export function restoreJobFlagCaches(
  queryClient: QueryClient,
  snapshots: Array<[QueryKey, unknown]>,
): void {
  for (const [key, data] of snapshots) {
    queryClient.setQueryData(key, data);
  }
}

/** Remove a job from all saved-list caches (any sort key). */
export function removeFromSavedListCache(
  queryClient: QueryClient,
  jobId: string,
): void {
  queryClient.setQueriesData<SavedJobDto[]>({ queryKey: queryKeys.saved() }, (old) =>
    old?.filter((row) => row.job.id !== jobId),
  );
}

/** Remove a job from the applied-list cache. */
export function removeFromAppliedListCache(
  queryClient: QueryClient,
  jobId: string,
): void {
  queryClient.setQueryData<AppliedJobDto[]>(queryKeys.applied(), (old) =>
    old?.filter((row) => row.job.id !== jobId),
  );
}

/** Snapshot all saved-list caches (includes sort suffix). */
export function snapshotSavedListCaches(
  queryClient: QueryClient,
): Array<[QueryKey, unknown]> {
  return queryClient.getQueriesData({ queryKey: queryKeys.saved() });
}

/** Restore saved-list snapshots. */
export function restoreSavedListCaches(
  queryClient: QueryClient,
  snapshots: Array<[QueryKey, unknown]>,
): void {
  for (const [key, data] of snapshots) {
    queryClient.setQueryData(key, data);
  }
}
