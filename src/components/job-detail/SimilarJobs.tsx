'use client';

// Similar jobs sidebar — compact cards from useSimilar.

import Link from 'next/link';
import { useSimilar } from '@/hooks/useJobs';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalaryDisplay } from '@/components/jobs/SalaryDisplay';

type SimilarJobsProps = {
  jobId: string;
};

/** Lists up to 6 similar jobs by skills and category. */
export function SimilarJobs({ jobId }: SimilarJobsProps) {
  const { data, isLoading, isError, refetch } = useSimilar(jobId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Similar jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}

        {isError && (
          <ErrorState
            message="Could not load similar jobs"
            onRetry={() => void refetch()}
          />
        )}

        {data?.length === 0 && (
          <p className="text-sm text-muted-foreground">No similar jobs found.</p>
        )}

        {data?.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
          >
            <p className="text-sm font-medium leading-snug">{job.title}</p>
            <p className="text-xs text-muted-foreground">{job.company}</p>
            <SalaryDisplay
              min={job.salaryMin}
              max={job.salaryMax}
              currency={job.salaryCurrency}
              negotiable={job.salaryNegotiable}
              className="mt-1 text-xs"
            />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
