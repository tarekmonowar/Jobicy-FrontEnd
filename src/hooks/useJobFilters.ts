'use client';

// URL-as-state for the jobs board — shareable filter query strings.

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type {
  DatePostedFilter,
  JobCategory,
  JobFilters,
  JobSort,
  JobSource,
  JobType,
  LocationType,
  RegionFilter,
} from '@/types/job';

const DEFAULT_SORT: JobSort = 'latest';

/** Parse comma-separated enum values from the URL. */
function parseCsv<T extends string>(value: string | null): T[] | undefined {
  if (!value) return undefined;
  const items = value.split(',').map((s) => s.trim()).filter(Boolean) as T[];
  return items.length > 0 ? items : undefined;
}

/** Parse numeric query param when present. */
function parseNum(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Parse boolean query param. */
function parseBool(value: string | null): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

/** Build JobFilters from the current URL search params. */
export function parseJobFilters(searchParams: URLSearchParams): JobFilters {
  const sort = (searchParams.get('sort') as JobSort | null) ?? DEFAULT_SORT;
  const region = searchParams.get('region') as RegionFilter | null;
  const datePosted = searchParams.get('datePosted') as DatePostedFilter | null;

  return {
    q: searchParams.get('q') ?? undefined,
    skills: parseCsv(searchParams.get('skills')),
    location: searchParams.get('location') ?? undefined,
    jobType: parseCsv<JobType>(searchParams.get('jobType')),
    category: parseCsv<JobCategory>(searchParams.get('category')),
    locationType: parseCsv<LocationType>(searchParams.get('locationType')),
    remoteOnly: parseBool(searchParams.get('remoteOnly')),
    region: region === 'bangladesh' || region === 'worldwide' ? region : undefined,
    salaryMin: parseNum(searchParams.get('salaryMin')),
    salaryMax: parseNum(searchParams.get('salaryMax')),
    experienceMax: parseNum(searchParams.get('experienceMax')),
    source: parseCsv<JobSource>(searchParams.get('source')),
    datePosted:
      datePosted === 'today' || datePosted === 'week' || datePosted === 'month'
        ? datePosted
        : undefined,
    sort: sort === 'latest' || sort === 'most_viewed' || sort === 'salary_desc' ? sort : DEFAULT_SORT,
  };
}

/** Serialize JobFilters into a query string (omits defaults/empties). */
function stringifyJobFilters(filters: JobFilters): string {
  const params = new URLSearchParams();

  if (filters.q) params.set('q', filters.q);
  if (filters.skills?.length) params.set('skills', filters.skills.join(','));
  if (filters.location) params.set('location', filters.location);
  if (filters.jobType?.length) params.set('jobType', filters.jobType.join(','));
  if (filters.category?.length) params.set('category', filters.category.join(','));
  if (filters.locationType?.length) params.set('locationType', filters.locationType.join(','));
  if (filters.remoteOnly) params.set('remoteOnly', 'true');
  if (filters.region) params.set('region', filters.region);
  if (filters.salaryMin != null) params.set('salaryMin', String(filters.salaryMin));
  if (filters.salaryMax != null) params.set('salaryMax', String(filters.salaryMax));
  if (filters.experienceMax != null) params.set('experienceMax', String(filters.experienceMax));
  if (filters.source?.length) params.set('source', filters.source.join(','));
  if (filters.datePosted) params.set('datePosted', filters.datePosted);
  if (filters.sort && filters.sort !== DEFAULT_SORT) params.set('sort', filters.sort);

  return params.toString();
}

/**
 * Read/write job filters via the URL so filtered views are shareable.
 */
export function useJobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseJobFilters(searchParams),
    [searchParams],
  );

  const setFilter = useCallback(
    (partial: Partial<JobFilters>) => {
      const next = { ...filters, ...partial, page: undefined };
      const qs = stringifyJobFilters(next);
      router.replace(qs ? `/jobs?${qs}` : '/jobs', { scroll: false });
    },
    [filters, router],
  );

  const reset = useCallback(() => {
    router.replace('/jobs', { scroll: false });
  }, [router]);

  return { filters, setFilter, reset };
}
