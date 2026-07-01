// Saved jobs API — save, unsave, list, note update, CSV export.

import { api } from '@/lib/axios';
import { env } from '@/config/runtime';
import type { ApiResponse } from '@/types/api';
import type { SavedJobDto } from '@/types/job';

/** List the authenticated user's saved jobs. */
export async function getSaved(sort?: string): Promise<SavedJobDto[]> {
  const res = await api.get<ApiResponse<SavedJobDto[]>>('/jobs/saved', {
    params: sort ? { sort } : undefined,
  });
  return res.data.data;
}

/** Save a job with an optional personal note. */
export async function save(
  id: string,
  note?: string,
): Promise<{ saved: true }> {
  const res = await api.post<ApiResponse<{ saved: true }>>(`/jobs/save/${id}`, {
    note,
  });
  return res.data.data;
}

/** Update the note on an already-saved job. */
export async function updateNote(id: string, note: string): Promise<{ saved: true }> {
  const res = await api.patch<ApiResponse<{ saved: true }>>(`/jobs/save/${id}`, {
    note,
  });
  return res.data.data;
}

/** Remove a job from the saved list. */
export async function unsave(id: string): Promise<{ saved: false }> {
  const res = await api.delete<ApiResponse<{ saved: false }>>(`/jobs/save/${id}`);
  return res.data.data;
}

/** Absolute URL for CSV export (caller must attach Bearer via fetch). */
export function exportCsvUrl(): string {
  return `${env.apiUrl}/jobs/saved/export`;
}
