'use client';

// Job detail page — description, apply, save, similar jobs.

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useJob } from '@/hooks/useJobs';
import { JobHeader } from '@/components/job-detail/JobHeader';
import { JobDescription } from '@/components/job-detail/JobDescription';
import { SimilarJobs } from '@/components/job-detail/SimilarJobs';
import { JobDetailActions } from '@/components/job-detail/JobDetailActions';
import { SkillTags } from '@/components/jobs/SkillTags';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/button';
import { formatJobListedTime } from '@/lib/utils';

type PageProps = {
  params: Promise<{ id: string }>;
};

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function JobDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: job, isLoading, isError, error, refetch } = useJob(id);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState
          message={error?.message ?? 'Job not found'}
          onRetry={() => void refetch()}
        />
        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link href="/jobs">Back to jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link href="/jobs">
          <ArrowLeft className="size-4" />
          Back to jobs
        </Link>
      </Button>

      <JobHeader job={job} />

      <JobDetailActions job={job} />

      <div>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Skills</h2>
        <SkillTags skills={job.skills} max={20} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Description</h2>
        <JobDescription markdown={job.description} />
      </div>

      {job.requirements.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-semibold">Requirements</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {job.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {job.benefits.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-semibold">Benefits</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {job.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      <SimilarJobs jobId={job.id} limit={3} />

      <p className="text-xs text-muted-foreground">
        Listed {formatJobListedTime(job)} · {job.viewCount} views
      </p>
    </div>
  );
}
