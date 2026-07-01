// Applications API — apply, unapply, list applied jobs.

import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { AppliedJobDto, ApplyResponse, UnapplyResponse } from '@/types/application';

/** Record that the user applied to a job. */
export async function apply(id: string): Promise<ApplyResponse> {
  const res = await api.post<ApiResponse<ApplyResponse>>(`/jobs/apply/${id}`);
  return res.data.data;
}

/** Remove an applied-job record. */
export async function unapply(id: string): Promise<UnapplyResponse> {
  const res = await api.delete<ApiResponse<UnapplyResponse>>(`/jobs/apply/${id}`);
  return res.data.data;
}

/** List jobs the user has marked as applied. */
export async function getApplied(): Promise<AppliedJobDto[]> {
  const res = await api.get<ApiResponse<AppliedJobDto[]>>('/jobs/applied');
  return res.data.data;
}
