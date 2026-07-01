// Jobs read API — list, detail, search, trending, similar.

import { api } from '@/lib/axios';
import type { PaginatedMeta, PaginatedResponse, ApiResponse } from '@/types/api';
import type { JobCardDto, JobDetailDto, JobFilters } from '@/types/job';

/** Serialize array filters to CSV for the query string. */
function toParams(filters: JobFilters): Record<string, string | number | boolean | undefined> {
  return {
    q: filters.q,
    skills: filters.skills?.join(','),
    location: filters.location,
    jobType: filters.jobType?.join(','),
    category: filters.category?.join(','),
    locationType: filters.locationType?.join(','),
    remoteOnly: filters.remoteOnly,
    region: filters.region,
    salaryMin: filters.salaryMin,
    salaryMax: filters.salaryMax,
    experienceMax: filters.experienceMax,
    source: filters.source?.join(','),
    datePosted: filters.datePosted,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
  };
}

/** Paginated job list with optional filters. */
export async function getJobs(
  filters: JobFilters,
): Promise<{ data: JobCardDto[]; meta: PaginatedMeta }> {
  const res = await api.get<PaginatedResponse<JobCardDto>>('/jobs', {
    params: toParams(filters),
  });
  return { data: res.data.data, meta: res.data.meta };
}

/** Single job detail (increments view count on the server). */
export async function getJob(id: string): Promise<JobDetailDto> {
  const res = await api.get<ApiResponse<JobDetailDto>>(`/jobs/${id}`);
  return res.data.data;
}

/** Full-text search across title, company, and skills. */
export async function searchJobs(
  q: string,
  page = 1,
  limit = 20,
): Promise<{ data: JobCardDto[]; meta: PaginatedMeta }> {
  const res = await api.get<PaginatedResponse<JobCardDto>>('/jobs/search', {
    params: { q, page, limit },
  });
  return { data: res.data.data, meta: res.data.meta };
}

/** Top jobs today by views/recency (max 10). */
export async function getTrending(): Promise<JobCardDto[]> {
  const res = await api.get<ApiResponse<JobCardDto[]>>('/jobs/trending');
  return res.data.data;
}

/** Similar jobs by skills and category (max 6). */
export async function getSimilar(id: string, limit = 6): Promise<JobCardDto[]> {
  const res = await api.get<ApiResponse<JobCardDto[]>>(`/jobs/similar/${id}`, {
    params: { limit },
  });
  return res.data.data;
}
