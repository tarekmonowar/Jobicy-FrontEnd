// Admin API — stats, fetch logs, queue monitor, manual ingestion trigger.

import { api } from '@/lib/axios';
import type { ApiResponse, PaginatedMeta, PaginatedResponse } from '@/types/api';
import type { UserDto } from '@/types/auth';
import type { JobSource } from '@/types/job';

export type AdminStats = {
  users: number;
  jobs: number;
  activeJobs: number;
  alerts: number;
  applications: number;
};

export type FetchLogDto = {
  id: string;
  source: JobSource;
  status: 'RUNNING' | 'SUCCESS' | 'FAILED';
  jobsFetched: number;
  jobsNew: number;
  jobsDuplicate: number;
  errors: string[];
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
};

export type QueueStatusDto = {
  name: string;
  active: number;
  waiting: number;
  completed: number;
  failed: number;
};

/** Platform-wide counts for the admin dashboard. */
export async function getStats(): Promise<AdminStats> {
  const res = await api.get<ApiResponse<AdminStats>>('/admin/stats');
  return res.data.data;
}

/** Paginated ingestion fetch logs. */
export async function getFetchLogs(
  page = 1,
  limit = 20,
): Promise<{ data: FetchLogDto[]; meta: PaginatedMeta }> {
  const res = await api.get<PaginatedResponse<FetchLogDto>>('/admin/fetch/logs', {
    params: { page, limit },
  });
  return { data: res.data.data, meta: res.data.meta };
}

/** Enqueue an immediate ingestion run. */
export async function triggerFetch(): Promise<{ enqueued: true; jobId: string }> {
  const res = await api.post<ApiResponse<{ enqueued: true; jobId: string }>>(
    '/admin/fetch/trigger',
  );
  return res.data.data;
}

/** BullMQ queue job counts. */
export async function getQueues(): Promise<QueueStatusDto[]> {
  const res = await api.get<ApiResponse<QueueStatusDto[]>>('/admin/queues');
  return res.data.data;
}

/** Paginated user list (safe shape, no passwords). */
export async function getUsers(
  page = 1,
  limit = 20,
): Promise<{ data: UserDto[]; meta: PaginatedMeta }> {
  const res = await api.get<PaginatedResponse<UserDto>>('/admin/users', {
    params: { page, limit },
  });
  return { data: res.data.data, meta: res.data.meta };
}
