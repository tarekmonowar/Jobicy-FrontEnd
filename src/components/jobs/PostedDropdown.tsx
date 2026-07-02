'use client';

// Posted-date filter for the jobs board toolbar.

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DatePostedFilter } from '@/types/job';

type PostedDropdownProps = {
  value?: DatePostedFilter;
  onChange: (datePosted: DatePostedFilter | undefined) => void;
};

const POSTED_OPTIONS: { value: DatePostedFilter | 'any'; label: string }[] = [
  { value: 'any', label: 'Any time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
];

/** Updates the date-posted filter in the URL — sits beside sort on the jobs toolbar. */
export function PostedDropdown({ value, onChange }: PostedDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Posted</span>
      <Select
        value={value ?? 'any'}
        onValueChange={(v) =>
          onChange(v === 'any' ? undefined : (v as DatePostedFilter))
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {POSTED_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
