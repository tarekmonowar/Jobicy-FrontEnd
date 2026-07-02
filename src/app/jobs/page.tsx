'use client';

// Jobs board — LinkedIn-style split view: selectable list (left) + detail (right).
// Filters live in a slide-over drawer; selection and page are stored in the URL.

import { Suspense, useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useJobFilters } from '@/hooks/useJobFilters';
import { useJobsPage } from '@/hooks/useJobs';
import { FilterDrawer } from '@/components/jobs/FilterDrawer';
import { PostedDropdown } from '@/components/jobs/PostedDropdown';
import { SortDropdown } from '@/components/jobs/SortDropdown';
import { JobList } from '@/components/jobs/JobList';
import { JobDetailPanel } from '@/components/jobs/JobDetailPanel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { JobFilters } from '@/types/job';

const PAGE_SIZE = 30;

/** Count applied filters (everything except sort) for the button badge. */
function countActiveFilters(filters: JobFilters): number {
  let count = 0;
  if (filters.q) count += 1;
  if (filters.skills?.length) count += 1;
  if (filters.location) count += 1;
  if (filters.jobType?.length) count += 1;
  if (filters.category?.length) count += 1;
  if (filters.locationType?.length) count += 1;
  if (filters.remoteOnly) count += 1;
  if (filters.region) count += 1;
  if (filters.salaryMin != null) count += 1;
  if (filters.salaryMax != null) count += 1;
  if (filters.experienceMax != null) count += 1;
  if (filters.source?.length) count += 1;
  if (filters.datePosted) count += 1;
  return count;
}

function JobsBoardContent() {
  const { filters, page, selected, setFilter, setPage, setSelected, reset } = useJobFilters();
  const query = useJobsPage(filters, page, PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const jobs = query.data?.data ?? [];
  const meta = query.data?.meta;
  const activeCount = countActiveFilters(filters);
  const sort = filters.sort ?? 'latest';

  // On desktop, auto-open the first result so the detail pane is never empty.
  useEffect(() => {
    if (selected || jobs.length === 0) return;
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
      setSelected(jobs[0].id);
    }
  }, [jobs, selected, setSelected]);

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-[1600px] flex-col px-3 sm:px-5">
      {/* Toolbar: filters button + result count + posted/sort controls */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>

        <span className="hidden text-sm text-muted-foreground sm:inline">
          {meta ? `${meta.total.toLocaleString()} developer jobs` : 'Loading…'}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <PostedDropdown
            value={filters.datePosted}
            onChange={(datePosted) => setFilter({ datePosted })}
          />
          <SortDropdown value={sort} onChange={(s) => setFilter({ sort: s })} />
        </div>
      </div>

      {/* Split pane: list (left) + detail (right, desktop only) */}
      <div className="flex min-h-0 flex-1 gap-4 pb-3">
        <JobList
          query={query}
          selectedId={selected}
          onSelect={setSelected}
          page={page}
          onPageChange={setPage}
          onResetFilters={reset}
          className="w-full lg:w-[400px] lg:shrink-0 xl:w-[440px]"
        />
        <JobDetailPanel jobId={selected} className="hidden flex-1 lg:flex" />
      </div>

      {/* Mobile/tablet: detail opens as a full-screen overlay below the navbar */}
      {selected && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-40 bg-background lg:hidden">
          <JobDetailPanel
            jobId={selected}
            onBack={() => setSelected(null)}
            className="h-full rounded-none border-0"
          />
        </div>
      )}

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={setFilter}
        onReset={reset}
      />
    </div>
  );
}

function JobsBoardFallback() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4 px-3 py-8 sm:px-5">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-[70vh] w-full" />
    </div>
  );
}

/** Jobs board with URL-driven filters, pagination, and split-pane detail. */
export default function JobsPage() {
  return (
    <Suspense fallback={<JobsBoardFallback />}>
      <JobsBoardContent />
    </Suspense>
  );
}
