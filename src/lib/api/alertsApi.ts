// Alerts API — CRUD, test email, preview match count.

import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { AlertDto, CreateAlertDto, UpdateAlertDto } from '@/types/alert';

/** List the authenticated user's job alerts. */
export async function getAlerts(): Promise<AlertDto[]> {
  const res = await api.get<ApiResponse<AlertDto[]>>('/alerts');
  return res.data.data;
}

/** Create a new job alert. */
export async function createAlert(dto: CreateAlertDto): Promise<AlertDto> {
  const res = await api.post<ApiResponse<AlertDto>>('/alerts', dto);
  return res.data.data;
}

/** Update an existing alert (owner only). */
export async function updateAlert(id: string, dto: UpdateAlertDto): Promise<AlertDto> {
  const res = await api.put<ApiResponse<AlertDto>>(`/alerts/${id}`, dto);
  return res.data.data;
}

/** Delete an alert. */
export async function deleteAlert(id: string): Promise<{ deleted: true }> {
  const res = await api.delete<ApiResponse<{ deleted: true }>>(`/alerts/${id}`);
  return res.data.data;
}

/** Send a test email with current matches. */
export async function testAlert(id: string): Promise<{ matched: number }> {
  const res = await api.post<ApiResponse<{ matched: number }>>(`/alerts/${id}/test`);
  return res.data.data;
}

/** Preview how many jobs matched this alert in the last 7 days. */
export async function previewAlert(id: string): Promise<{ matchedThisWeek: number }> {
  const res = await api.get<ApiResponse<{ matchedThisWeek: number }>>(
    `/alerts/${id}/preview`,
  );
  return res.data.data;
}
