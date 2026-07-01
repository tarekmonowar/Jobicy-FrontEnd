// Job card layout per claude.md §4 — top: badges/title/salary; bottom: meta row.

import Link from 'next/link';
import { MapPin, Briefcase, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';
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

/**
 * Single job card — links to detail; heart saves optimistically.
 */
export function JobCard({ job, badge }: JobCardProps) {
  const workType = `${JOB_TYPE_LABELS[job.jobType]} · ${LOCATION_TYPE_LABELS[job.locationType]}`;

  return (
    <Card className="group relative gap-0 py-0 transition-shadow hover:shadow-md">
      <Link href={`/jobs/${job.id}`} className="block">
        {/* Top section: source, status, title, salary */}
        <CardContent className="space-y-3 border-b px-4 py-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge source={job.source} />
              <StatusBadge job={job} />
              {badge && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {badge}
                </span>
              )}
            </div>
            <SaveButton jobId={job.id} isSaved={job.isSaved} />
          </div>

          <div>
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
          />
        </CardContent>

        {/* Bottom section: skills, location, type, experience, posted */}
        <CardContent className="space-y-3 px-4 py-4">
          <SkillTags skills={job.skills} />

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="size-3.5 shrink-0" aria-hidden />
              {workType}
            </span>
            <span>{CATEGORY_SHORT[job.category]}</span>
            <span>{formatExperience(job.experienceMin, job.experienceMax)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              {formatRelativeTime(job.postedAt)}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
