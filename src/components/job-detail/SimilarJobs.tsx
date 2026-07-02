'use client';

// Compact similar jobs list below the job detail body.

import Link from 'next/link';
import { useSimilar } from '@/hooks/useJobs';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { SalaryDisplay } from '@/components/jobs/SalaryDisplay';
import { cn } from '@/lib/utils';

type SimilarJobsProps = {
  jobId: string;
  /** Max similar jobs to show (API default allows up to 6). */
  limit?: number;
  className?: string;
};

/** Lists similar jobs by skills and category. */
export function SimilarJobs({ jobId, limit = 3, className }: SimilarJobsProps) {
  const { data, isLoading, isError, refetch } = useSimilar(jobId, limit);
  const jobs = data?.slice(0, limit) ?? [];

  return (
    <section
      className={cn('border-t border-border/50 pt-8 space-y-2', className)}
      aria-label="Similar jobs"
    >
      <h2 className="text-sm font-semibold tracking-tight">Similar jobs</h2>

      <div className="overflow-hidden rounded-md border">
        {isLoading &&
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="border-b px-3 py-2.5 last:border-b-0">
              <Skeleton className="mb-1.5 h-3.5 w-4/5" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}

        {isError && (
          <div className="px-3 py-2">
            <ErrorState
              message="Could not load similar jobs"
              onRetry={() => void refetch()}
            />
          </div>
        )}

        {!isLoading && !isError && jobs.length === 0 && (
          <p className="px-3 py-2.5 text-sm text-muted-foreground">No similar jobs found.</p>
        )}

        {!isLoading &&
          !isError &&
          jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block border-b px-3 py-2.5 transition-colors last:border-b-0 hover:bg-muted/40"
            >
              <p className="text-sm font-medium leading-snug">{job.title}</p>
              <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="truncate">{job.company}</span>
                <SalaryDisplay
                  min={job.salaryMin}
                  max={job.salaryMax}
                  currency={job.salaryCurrency}
                  negotiable={job.salaryNegotiable}
                  className="shrink-0 text-xs"
                />
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
