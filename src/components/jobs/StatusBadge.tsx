// Active / Inactive status badge per claude.md §4.

import { Badge } from '@/components/ui/badge';
import { isJobInactive } from '@/lib/utils';
import type { JobCardDto } from '@/types/job';

type StatusBadgeProps = {
  job: Pick<JobCardDto, 'isActive' | 'applicationDeadline'>;
};

/** Renders Active or Inactive based on isActive and application deadline. */
export function StatusBadge({ job }: StatusBadgeProps) {
  const inactive = isJobInactive(job);

  return (
    <Badge
      variant={inactive ? 'outline' : 'default'}
      className={
        inactive
          ? 'border-muted-foreground/40 text-muted-foreground'
          : 'bg-success text-success-foreground'
      }
    >
      {inactive ? 'Inactive' : 'Active'}
    </Badge>
  );
}
