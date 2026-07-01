// Analytics API — one function per dashboard endpoint.

import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  AnalyticsRange,
  CompanyStatDto,
  DemandIndexDto,
  LocationStatDto,
  OverviewDto,
  SalaryByRoleDto,
  SkillTrendsDto,
  TimelinePointDto,
} from '@/types/analytics';

/** Dashboard overview cards. */
export async function getOverview(): Promise<OverviewDto> {
  const res = await api.get<ApiResponse<OverviewDto>>('/analytics/overview');
  return res.data.data;
}

/** Multi-skill trend lines over 7d or 30d. */
export async function getSkillTrends(params: {
  range: AnalyticsRange;
  skills?: string[];
}): Promise<SkillTrendsDto> {
  const res = await api.get<ApiResponse<SkillTrendsDto>>('/analytics/skills', {
    params: {
      range: params.range,
      skills: params.skills?.join(','),
    },
  });
  return res.data.data;
}

/** Top hiring companies. */
export async function getCompanies(limit = 10): Promise<CompanyStatDto[]> {
  const res = await api.get<ApiResponse<CompanyStatDto[]>>('/analytics/companies', {
    params: { limit },
  });
  return res.data.data;
}

/** Salary ranges grouped by role. */
export async function getSalaries(params: {
  currency: 'BDT' | 'USD';
  experience?: number;
}): Promise<SalaryByRoleDto[]> {
  const res = await api.get<ApiResponse<SalaryByRoleDto[]>>('/analytics/salaries', {
    params,
  });
  return res.data.data;
}

/** Job counts by Bangladesh location (for the map). */
export async function getLocations(): Promise<LocationStatDto[]> {
  const res = await api.get<ApiResponse<LocationStatDto[]>>('/analytics/locations');
  return res.data.data;
}

/** Daily job posting timeline. */
export async function getTimeline(range: AnalyticsRange): Promise<TimelinePointDto[]> {
  const res = await api.get<ApiResponse<TimelinePointDto[]>>('/analytics/timeline', {
    params: { range },
  });
  return res.data.data;
}

/** Demand index gauge + rising/declining skills. */
export async function getDemandIndex(): Promise<DemandIndexDto> {
  const res = await api.get<ApiResponse<DemandIndexDto>>('/analytics/demand-index');
  return res.data.data;
}
