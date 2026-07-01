// Source/provider badge — maps JobSource enum to a human label.

import { Badge } from '@/components/ui/badge';
import type { JobSource } from '@/types/job';

type SourceBadgeProps = {
  source: JobSource;
  sourceName?: string | null;
};

const SOURCE_LABELS: Record<JobSource, string> = {
  LINKEDIN: 'LinkedIn',
  INDEED: 'Indeed',
  GLASSDOOR: 'Glassdoor',
  BDJOBS: 'BDJobs',
  OTHER: 'Other',
};

/**
 * Shows the job provider. For OTHER, falls back to sourceName (Jobicy, Remote Jobs, etc.).
 */
export function SourceBadge({ source, sourceName }: SourceBadgeProps) {
  const label =
    source === 'OTHER' && sourceName ? sourceName : SOURCE_LABELS[source];

  return (
    <Badge variant="secondary" className="text-[11px] font-medium">
      {label}
    </Badge>
  );
}
