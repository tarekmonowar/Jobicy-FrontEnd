'use client';

// Job alerts — list query plus create/update/delete/test/preview mutations.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as alertsApi from '@/lib/api/alertsApi';
import { queryKeys } from '@/lib/queryClient';
import { getApiErrorMessage } from '@/hooks/useAuth';
import type { CreateAlertDto, UpdateAlertDto } from '@/types/alert';

/** List the authenticated user's job alerts. */
export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.alerts(),
    queryFn: () => alertsApi.getAlerts(),
  });
}

/** Preview how many jobs matched an alert in the last 7 days. */
export function useAlertPreview(alertId: string) {
  return useQuery({
    queryKey: [...queryKeys.alerts(), alertId, 'preview'] as const,
    queryFn: () => alertsApi.previewAlert(alertId),
    staleTime: 60_000,
  });
}

/** Create a new job alert. */
export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateAlertDto) => alertsApi.createAlert(dto),
    onSuccess: () => {
      toast.success('Alert created');
      void queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not create alert'));
    },
  });
}

/** Update an existing alert (toggle, edit criteria). */
export function useUpdateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAlertDto }) =>
      alertsApi.updateAlert(id, dto),
    onSuccess: () => {
      toast.success('Alert updated');
      void queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not update alert'));
    },
  });
}

/** Delete a job alert. */
export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertsApi.deleteAlert(id),
    onSuccess: () => {
      toast.success('Alert deleted');
      void queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not delete alert'));
    },
  });
}

/** Send a test email with current matches for an alert. */
export function useTestAlert() {
  return useMutation({
    mutationFn: (id: string) => alertsApi.testAlert(id),
    onSuccess: (data) => {
      toast.success(`Test email sent — ${data.matched} matching job(s)`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not send test email'));
    },
  });
}
