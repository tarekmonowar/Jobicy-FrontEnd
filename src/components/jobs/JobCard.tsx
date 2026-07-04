// Job card layout — top badges, title + salary row, skills/benefits body, meta footer.

import Link from 'next/link';
import { Briefcase, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatJobListedTime } from '@/lib/utils';
import { SourceBadge } from '@/components/jobs/SourceBadge';
import { StatusBadge } from '@/components/jobs/StatusBadge';
import { SalaryDisplay } from '@/components/jobs/SalaryDisplay';
import { SkillTags } from '@/components/jobs/SkillTags';
import { SaveButton } from '@/components/jobs/SaveButton';
import type { JobCardDto, JobCategory, JobType, LocationType } from '@/types/job';

type JobCardProps = {
  job: JobCardDto;
  /** Optional badge overlay (e.g. "Applied" on applied page). */
  badge?: string;
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

const CATEGORY_SHORT: Record<JobCategory, string> = {
  FULLSTACK: 'Fullstack',
  BACKEND: 'Backend',
  FRONTEND: 'Frontend',
  SOFTWARE_ENGINEER: 'Software Engineer',
  MOBILE: 'Mobile',
  DEVOPS: 'DevOps',
  QA: 'QA',
  OTHER: 'Developer',
};

function formatExperience(min: number | null, max: number | null): string {
  if (min != null && max != null) return `${min}–${max} yrs`;
  if (min != null) return `${min}+ yrs`;
  if (max != null) return `Up to ${max} yrs`;
  return 'Not specified';
}

/** Compact benefit chips for the card body (right column). */
function BenefitTags({ benefits }: { benefits: string[] }) {
  const visible = benefits.slice(0, 4);
  const extra = benefits.length - visible.length;

  if (benefits.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      {visible.map((item) => (
        <span key={item} className="text-xs leading-snug text-muted-foreground">
          • {item}
        </span>
      ))}
      {extra > 0 && (
        <span className="text-[11px] text-muted-foreground">+{extra} more</span>
      )}
    </div>
  );
}

/**
 * Single job card — links to detail; heart saves optimistically.
 */
export function JobCard({ job, badge }: JobCardProps) {
  return (
    <Card className="group relative gap-0 py-0 transition-shadow hover:shadow-md">
      <Link
        href={`/jobs/${job.id}`}
        className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`View ${job.title} at ${job.company}`}
      >
        {/* Top: 2 badges left (source, active) · 2 badges right (work type, location) */}
        <CardContent className="space-y-3 border-b px-4 py-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge
                source={job.source}
                sourceName={job.sourceName}
                prominent
              />
              <StatusBadge job={job} />
              {badge && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {badge}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge
                variant="secondary"
                className="text-xs font-medium"
              >
                {LOCATION_TYPE_LABELS[job.locationType]}
              </Badge>
              <Badge
                variant="outline"
                className="max-w-32 truncate text-xs font-medium"
                title={job.location}
              >
                {job.location}
              </Badge>
              <SaveButton jobId={job.id} isSaved={job.isSaved} />
            </div>
          </div>

          {/* Title + company left · salary right */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold leading-snug group-hover:text-primary">
                {job.title}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>
            </div>
            <SalaryDisplay
              min={job.salaryMin}
              max={job.salaryMax}
              currency={job.salaryCurrency}
              negotiable={job.salaryNegotiable}
              showLabel
              className="shrink-0"
            />
          </div>
        </CardContent>

        {/* Body: skills (3/4) · benefits (1/4) */}
        <CardContent className="grid grid-cols-4 gap-4 border-b px-4 py-4">
          <div className="col-span-3 space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Skills
            </p>
            <SkillTags skills={job.skills} max={8} />
          </div>
          <div className="col-span-1 space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Benefits
            </p>
            <BenefitTags benefits={job.benefits ?? []} />
          </div>
        </CardContent>

        {/* Footer: experience badge first, then category / type / posted */}
        <CardContent className="px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <Badge
              variant="outline"
              className="border-amber-200/80 bg-amber-50 text-xs font-medium text-amber-900 shadow-none hover:bg-amber-50"
            >
              <span className="font-normal text-amber-800/80">Experience: </span>
              {formatExperience(job.experienceMin, job.experienceMax)}
            </Badge>
            <span>{CATEGORY_SHORT[job.category]}</span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="size-3.5 shrink-0" aria-hidden />
              {JOB_TYPE_LABELS[job.jobType]}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              {formatJobListedTime(job)}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
