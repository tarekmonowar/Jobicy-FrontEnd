'use client';

// Colorful chips for job type, work mode, category, and salary.

import { cn } from '@/lib/utils';
import { SalaryDisplay } from '@/components/jobs/SalaryDisplay';
import type { JobCardDto, JobCategory, JobType, LocationType } from '@/types/job';

type JobMetaBadgesProps = {
  job: Pick<
    JobCardDto,
    | 'jobType'
    | 'locationType'
    | 'category'
    | 'salaryMin'
    | 'salaryMax'
    | 'salaryCurrency'
    | 'salaryNegotiable'
  >;
  className?: string;
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

const CATEGORY_LABELS: Record<JobCategory, string> = {
  FULLSTACK: 'Fullstack',
  BACKEND: 'Backend',
  FRONTEND: 'Frontend',
  SOFTWARE_ENGINEER: 'Software Engineer',
  MOBILE: 'Mobile',
  DEVOPS: 'DevOps',
  QA: 'QA',
  OTHER: 'Developer',
};

const JOB_TYPE_STYLES: Record<JobType, string> = {
  FULL_TIME: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  PART_TIME: 'border-sky-200 bg-sky-50 text-sky-800',
  CONTRACT: 'border-amber-200 bg-amber-50 text-amber-800',
  INTERNSHIP: 'border-rose-200 bg-rose-50 text-rose-800',
};

const LOCATION_TYPE_STYLES: Record<LocationType, string> = {
  REMOTE: 'border-green-200 bg-green-50 text-green-800',
  ONSITE: 'border-orange-200 bg-orange-50 text-orange-800',
  HYBRID: 'border-violet-200 bg-violet-50 text-violet-800',
};

const CATEGORY_STYLES: Record<JobCategory, string> = {
  FULLSTACK: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  BACKEND: 'border-blue-200 bg-blue-50 text-blue-800',
  FRONTEND: 'border-cyan-200 bg-cyan-50 text-cyan-800',
  SOFTWARE_ENGINEER: 'border-violet-200 bg-violet-50 text-violet-800',
  MOBILE: 'border-pink-200 bg-pink-50 text-pink-800',
  DEVOPS: 'border-orange-200 bg-orange-50 text-orange-800',
  QA: 'border-amber-200 bg-amber-50 text-amber-800',
  OTHER: 'border-slate-200 bg-slate-50 text-slate-700',
};

function MetaChip({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
        className,
      )}
    >
      {label}
    </span>
  );
}

/**
 * Colorful role category chip (e.g. Backend, Frontend).
 */
export function CategoryBadge({ category }: { category: JobCategory }) {
  return (
    <MetaChip label={CATEGORY_LABELS[category]} className={CATEGORY_STYLES[category]} />
  );
}

/**
 * Renders job type, location mode, role category, and salary as colored badges.
 */
export function JobMetaBadges({ job, className }: JobMetaBadgesProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-end gap-1', className)}>
      <MetaChip label={JOB_TYPE_LABELS[job.jobType]} className={JOB_TYPE_STYLES[job.jobType]} />
      <MetaChip
        label={LOCATION_TYPE_LABELS[job.locationType]}
        className={LOCATION_TYPE_STYLES[job.locationType]}
      />
      <MetaChip
        label={CATEGORY_LABELS[job.category]}
        className={CATEGORY_STYLES[job.category]}
      />
      <span className="inline-flex shrink-0 items-center rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-800">
        <SalaryDisplay
          min={job.salaryMin}
          max={job.salaryMax}
          currency={job.salaryCurrency}
          negotiable={job.salaryNegotiable}
          className="text-[11px] font-medium text-teal-800"
        />
      </span>
    </div>
  );
}
