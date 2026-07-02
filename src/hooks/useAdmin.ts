'use client';

// Admin dashboard hooks — stats, fetch logs, queue monitor, manual ingestion trigger.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as adminApi from '@/lib/api/adminApi';
import { queryKeys } from '@/lib/queryClient';
import { getApiErrorMessage } from '@/hooks/useAuth';

/** Platform-wide counts for the admin dashboard. */
export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: () => adminApi.getStats(),
    staleTime: 60_000,
  });
}

/** Paginated ingestion fetch logs for the admin table. */
export function useFetchLogs(page = 1) {
  return useQuery({
    queryKey: queryKeys.admin.fetchLogs(page),
    queryFn: () => adminApi.getFetchLogs(page),
    staleTime: 30_000,
  });
}

/** BullMQ queue job counts — auto-refreshes every 10 seconds. */
export function useQueues() {
  return useQuery({
    queryKey: queryKeys.admin.queues(),
    queryFn: () => adminApi.getQueues(),
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
}

/** Paginated user list (safe shape) for admin user management. */
export function useAdminUsers(page = 1) {
  return useQuery({
    queryKey: queryKeys.admin.users(page),
    queryFn: () => adminApi.getUsers(page),
    staleTime: 60_000,
  });
}

/** Enqueue an immediate multi-source ingestion run. */
export function useTriggerFetch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminApi.triggerFetch(),
    onSuccess: (data) => {
      toast.success(`Ingestion enqueued (job ${data.jobId.slice(0, 8)}…)`);
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not trigger ingestion'));
    },
  });
}
