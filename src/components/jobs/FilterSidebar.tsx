'use client';

// Filter sidebar — Region, work type, source, role, experience, salary.

import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type {
  JobCategory,
  JobFilters,
  JobSource,
  JobType,
  LocationType,
  RegionFilter,
} from '@/types/job';

type FilterSidebarProps = {
  filters: JobFilters;
  onChange: (partial: Partial<JobFilters>) => void;
  onReset: () => void;
  className?: string;
};

const PRIMARY_CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: 'FULLSTACK', label: 'Fullstack' },
  { value: 'BACKEND', label: 'Backend' },
  { value: 'FRONTEND', label: 'Frontend' },
  { value: 'SOFTWARE_ENGINEER', label: 'Software Engineer' },
  { value: 'DEVOPS', label: 'DevOps' },
];

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const WORK_TYPES: { value: LocationType; label: string }[] = [
  { value: 'ONSITE', label: 'Onsite' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
];

const SOURCES: { value: JobSource; label: string }[] = [
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'INDEED', label: 'Indeed' },
  { value: 'GLASSDOOR', label: 'Glassdoor' },
  { value: 'BDJOBS', label: 'BDJobs' },
  { value: 'OTHER', label: 'Other' },
];

/** Single filter column with a title — used in the two-column grid rows. */
function FilterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="font-medium">{title}</p>
      {children}
    </div>
  );
}

/** Checkbox list for a multi-select filter field. */
function CheckboxFilterList<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: { value: T; label: string }[];
  selected: T[] | undefined;
  onToggle: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2">
          <Checkbox
            checked={selected?.includes(opt.value) ?? false}
            onCheckedChange={() => onToggle(opt.value)}
          />
          <span className="truncate">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

/** Toggle a value in a multi-select filter array. */
function toggleInArray<T>(current: T[] | undefined, value: T): T[] {
  const set = new Set(current ?? []);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return Array.from(set);
}

/** Job board filters — updates shareable URL via useJobFilters. */
export function FilterSidebar({ filters, onChange, onReset, className }: FilterSidebarProps) {
  const setRegion = (region: RegionFilter | undefined) => onChange({ region });

  const setWorkTypes = (locationType: LocationType[]) => {
    onChange({
      locationType: locationType.length ? locationType : undefined,
      remoteOnly: locationType.length === 1 && locationType[0] === 'REMOTE' ? true : undefined,
    });
  };

  const expMax = filters.experienceMax ?? 15;
  const salaryMin = filters.salaryMin ?? 0;
  const salaryMax = filters.salaryMax ?? 500000;

  return (
    <aside
      className={cn(
        'flex max-h-[calc(100vh-5rem)] flex-col rounded-xl border bg-card text-sm',
        className,
      )}
    >
      {/* Fixed header — filter body scrolls below */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <h2 className="font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4">
        {/* Region toggle — equal-width buttons so labels stay on one row */}
        <div className="space-y-2">
          <p className="font-medium">Region</p>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                { value: undefined, label: 'All' },
                { value: 'bangladesh' as RegionFilter, label: 'Bangladesh' },
                { value: 'worldwide' as RegionFilter, label: 'Worldwide' },
              ] as const
            ).map((opt) => (
              <Button
                key={opt.label}
                type="button"
                size="sm"
                variant={filters.region === opt.value ? 'default' : 'outline'}
                className="h-8 w-full whitespace-nowrap px-1 text-xs"
                onClick={() => setRegion(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Work type | Job type */}
        <div className="grid grid-cols-2 gap-4">
          <FilterColumn title="Work type">
            <CheckboxFilterList
              options={WORK_TYPES}
              selected={filters.locationType}
              onToggle={(value) =>
                setWorkTypes(toggleInArray(filters.locationType, value))
              }
            />
          </FilterColumn>
          <FilterColumn title="Job type">
            <CheckboxFilterList
              options={JOB_TYPES}
              selected={filters.jobType}
              onToggle={(value) =>
                onChange({ jobType: toggleInArray(filters.jobType, value) })
              }
            />
          </FilterColumn>
        </div>

        {/* Source | Role category */}
        <div className="grid grid-cols-2 gap-4">
          <FilterColumn title="Source">
            <CheckboxFilterList
              options={SOURCES}
              selected={filters.source}
              onToggle={(value) =>
                onChange({ source: toggleInArray(filters.source, value) })
              }
            />
          </FilterColumn>
          <FilterColumn title="Role category">
            <CheckboxFilterList
              options={PRIMARY_CATEGORIES}
              selected={filters.category}
              onToggle={(value) =>
                onChange({ category: toggleInArray(filters.category, value) })
              }
            />
          </FilterColumn>
        </div>

        {/* Experience + salary */}
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Max experience: {expMax} yrs</p>
            <Slider
              min={0}
              max={15}
              step={1}
              value={[expMax]}
              onValueChange={([v]) =>
                onChange({ experienceMax: v === 15 ? undefined : v })
              }
            />
          </div>
          <div className="space-y-2">
            <p className="font-medium">
              Salary (BDT): {salaryMin.toLocaleString()} – {salaryMax.toLocaleString()}
            </p>
            <Slider
              min={0}
              max={500000}
              step={10000}
              value={[salaryMin, salaryMax]}
              onValueChange={([lo, hi]) =>
                onChange({
                  salaryMin: lo === 0 ? undefined : lo,
                  salaryMax: hi === 500000 ? undefined : hi,
                })
              }
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
