'use client';

// Jobs board — filters in URL, infinite scroll list.

import { Suspense, useState } from 'react';
import { Filter, PanelLeftClose } from 'lucide-react';
import { useJobFilters } from '@/hooks/useJobFilters';
import { useJobs } from '@/hooks/useJobs';
import { FilterSidebar } from '@/components/jobs/FilterSidebar';
import { PostedDropdown } from '@/components/jobs/PostedDropdown';
import { SortDropdown } from '@/components/jobs/SortDropdown';
import { JobList } from '@/components/jobs/JobList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function JobsBoardContent() {
  const { filters, setFilter, reset } = useJobFilters();
  const jobsQuery = useJobs(filters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const sort = filters.sort ?? 'latest';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Developer jobs</h1>
          <p className="text-sm text-muted-foreground">
            Bangladesh &amp; worldwide remote roles — updated daily
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <Filter className="size-4" />
          Filters
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <div className="hidden w-72 shrink-0 lg:block">
          <FilterSidebar
            filters={filters}
            onChange={setFilter}
            onReset={reset}
            className="sticky top-20"
          />
        </div>

        {/* Mobile drawer — slide-over filter panel */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters overlay"
            />
            <div
              className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-background shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-label="Job filters"
            >
              <div className="flex shrink-0 justify-end p-4 pb-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                >
                  <PanelLeftClose className="size-4" />
                </Button>
              </div>
              <div className="min-h-0 flex-1 px-4 pb-4">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilter}
                  onReset={reset}
                  className="h-full max-h-none"
                />
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 space-y-4" aria-label="Job listings">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3">
            <SortDropdown value={sort} onChange={(s) => setFilter({ sort: s })} />
            <PostedDropdown
              value={filters.datePosted}
              onChange={(datePosted) => setFilter({ datePosted })}
            />
          </div>

          <JobList query={jobsQuery} onResetFilters={reset} />
        </main>
      </div>
    </div>
  );
}

function JobsBoardFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

/** Jobs listing page with URL-driven filters and infinite scroll. */
export default function JobsPage() {
  return (
    <Suspense fallback={<JobsBoardFallback />}>
      <JobsBoardContent />
    </Suspense>
  );
}
