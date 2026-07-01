'use client';

// Sort control for the jobs board — latest, most viewed, salary.

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { JobSort } from '@/types/job';

type SortDropdownProps = {
  value: JobSort;
  onChange: (sort: JobSort) => void;
};

const SORT_OPTIONS: { value: JobSort; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'most_viewed', label: 'Most viewed' },
  { value: 'salary_desc', label: 'Salary (high to low)' },
];

/** Updates the sort filter in the URL. */
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by</span>
      <Select value={value} onValueChange={(v) => onChange(v as JobSort)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
