'use client';

// Compact LinkedIn-style job row for the board's left column.
// Clicking selects the job (detail opens in the right pane); the heart saves.

import { Briefcase, Clock, MapPin } from 'lucide-react';
import { cn, formatRelativeTime, isJobInactive } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SourceBadge } from '@/components/jobs/SourceBadge';
import { SalaryDisplay } from '@/components/jobs/SalaryDisplay';
import { SaveButton } from '@/components/jobs/SaveButton';
import type { JobCardDto, JobType, LocationType } from '@/types/job';

type JobListItemProps = {
  job: JobCardDto;
  selected: boolean;
  onSelect: (id: string) => void;
};

const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  REMOTE: 'Remote',
  ONSITE: 'Onsite',
  HYBRID: 'Hybrid',
};

/**
 * One selectable job row: title + company on the left, work/job type on the
 * right, then location, salary, source, and posted time. Highlights when open.
 */
export function JobListItem({ job, selected, onSelect }: JobListItemProps) {
  const inactive = isJobInactive(job);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={selected}
      onClick={() => onSelect(job.id)}
      onKeyDown={(e) => {
        // Keyboard users select with Enter/Space like a real button.
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(job.id);
        }
      }}
      className={cn(
        'relative cursor-pointer border-b px-4 py-3 transition-colors focus:outline-none',
        selected
          ? 'bg-primary/5 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-primary'
          : 'hover:bg-muted/40 focus-visible:bg-muted/50',
      )}
    >
      {/* Title (left) + save (right) */}
      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            'line-clamp-2 text-[15px] font-semibold leading-snug',
            selected ? 'text-primary' : 'text-foreground',
          )}
        >
          {job.title}
        </h3>
        <SaveButton jobId={job.id} isSaved={job.isSaved} className="-mt-1 -mr-1" />
      </div>

      {/* Company (left) + work/job type (right) */}
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-sm text-muted-foreground">{job.company}</p>
        <Badge variant="secondary" className="shrink-0 text-[11px] font-medium">
          {JOB_TYPE_LABELS[job.jobType]} · {LOCATION_TYPE_LABELS[job.locationType]}
        </Badge>
      </div>

      {/* Location + salary */}
      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="inline-flex min-w-0 items-center gap-1">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{job.location}</span>
        </span>
        <SalaryDisplay
          min={job.salaryMin}
          max={job.salaryMax}
          currency={job.salaryCurrency}
          negotiable={job.salaryNegotiable}
          className="shrink-0 text-xs font-medium text-foreground"
        />
      </div>

      {/* Footer: source · category · posted time · inactive flag */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
        <SourceBadge source={job.source} sourceName={job.sourceName} prominent />
        <span className="inline-flex items-center gap-1">
          <Briefcase className="size-3 shrink-0" aria-hidden />
          {job.category === 'OTHER' ? 'Developer' : job.category.replace('_', ' ').toLowerCase()}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3 shrink-0" aria-hidden />
          {formatRelativeTime(job.postedAt)}
        </span>
        {inactive && <span className="text-muted-foreground/80">· Inactive</span>}
      </div>
    </div>
  );
}
