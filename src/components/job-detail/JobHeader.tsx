'use client';

// Job detail header — title, company, badges, salary with currency toggle.

import { SourceBadge } from '@/components/jobs/SourceBadge';
import { StatusBadge } from '@/components/jobs/StatusBadge';
import { SalaryDisplay } from '@/components/jobs/SalaryDisplay';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/uiStore';
import type { JobDetailDto } from '@/types/job';

type JobHeaderProps = {
  job: JobDetailDto;
};

/**
 * Top block on the job detail page with BDT/USD salary toggle.
 */
export function JobHeader({ job }: JobHeaderProps) {
  const currency = useUiStore((s) => s.currency);
  const setCurrency = useUiStore((s) => s.setCurrency);

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={job.source} sourceName={job.sourceName} />
        <StatusBadge job={job} />
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{job.title}</h1>
        <p className="mt-1 text-lg text-muted-foreground">{job.company}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SalaryDisplay
          min={job.salaryMin}
          max={job.salaryMax}
          currency={job.salaryCurrency}
          negotiable={job.salaryNegotiable}
          className="text-lg font-semibold"
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
    </header>
  );
}
