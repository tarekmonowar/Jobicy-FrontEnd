'use client';

// Job detail header — title/salary, company/location, and role badges.

import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SourceBadge } from '@/components/jobs/SourceBadge';
import { StatusBadge } from '@/components/jobs/StatusBadge';
import { SalaryDisplay } from '@/components/jobs/SalaryDisplay';
import { CategoryBadge } from '@/components/jobs/JobMetaBadges';
import { SaveButton } from '@/components/jobs/SaveButton';
import { useUiStore } from '@/store/uiStore';
import type { JobDetailDto, JobType, LocationType } from '@/types/job';

type JobHeaderProps = {
  job: JobDetailDto;
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
 * Top block on the job detail page — title + salary, then one meta row.
 */
export function JobHeader({ job }: JobHeaderProps) {
  const currency = useUiStore((s) => s.currency);
  const setCurrency = useUiStore((s) => s.setCurrency);

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={job.source} sourceName={job.sourceName} />
        <StatusBadge job={job} />
      </div>

      {/* Title (left) · salary + currency toggle (right) */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="min-w-0 text-2xl font-bold leading-snug tracking-tight md:text-3xl">
          {job.title}
        </h1>
        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center">
          <SalaryDisplay
            min={job.salaryMin}
            max={job.salaryMax}
            currency={job.salaryCurrency}
            negotiable={job.salaryNegotiable}
            className="text-base font-semibold sm:text-lg"
          />
          <div className="flex rounded-md border p-0.5">
            {(['BDT', 'USD'] as const).map((c) => (
              <Button
                key={c}
                type="button"
                size="sm"
                variant={currency === c ? 'default' : 'ghost'}
                className="h-7 px-3 text-xs"
                onClick={() => setCurrency(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Company · location · work type · category · save (one row) */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <p className="shrink-0 truncate text-lg">{job.company}</p>
          <span className="inline-flex min-w-0 items-center gap-1 truncate text-sm">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{job.location}</span>
          </span>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {JOB_TYPE_LABELS[job.jobType]} · {LOCATION_TYPE_LABELS[job.locationType]}
          </Badge>
          <CategoryBadge category={job.category} />
          <SaveButton jobId={job.id} isSaved={job.isSaved} className="size-9 border" />
        </div>
      </div>
    </header>
  );
}
