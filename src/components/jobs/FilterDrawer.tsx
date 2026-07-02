'use client';

// Slide-over filter panel opened from the "Filters" button on every screen size.

import { FilterSidebar } from '@/components/jobs/FilterSidebar';
import { Button } from '@/components/ui/button';
import type { JobFilters } from '@/types/job';

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  filters: JobFilters;
  onChange: (partial: Partial<JobFilters>) => void;
  onReset: () => void;
};

/**
 * Backdrop + left slide-over hosting the FilterSidebar. Closes on backdrop
 * click, the header X, or the "Show results" button.
 */
export function FilterDrawer({ open, onClose, filters, onChange, onReset }: FilterDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
        aria-label="Close filters overlay"
      />

      <div
        className="absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col bg-background shadow-xl animate-in slide-in-from-left duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Job filters"
      >
        <div className="min-h-0 flex-1 p-3">
          <FilterSidebar
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            onClose={onClose}
            className="h-full max-h-none rounded-none border-0"
          />
        </div>

        <div className="shrink-0 border-t p-3">
          <Button className="w-full" onClick={onClose}>
            Show results
          </Button>
        </div>
      </div>
    </div>
  );
}
