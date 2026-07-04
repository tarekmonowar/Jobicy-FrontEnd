'use client';

// Grid or list of saved jobs with notes.

import Link from 'next/link';
import { JobCard } from '@/components/jobs/JobCard';
import { SavedNoteEditor } from '@/components/saved/SavedNoteEditor';
import { useUnsaveJob } from '@/hooks/useSavedJobs';
import { useUiStore } from '@/store/uiStore';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { SavedJobDto } from '@/types/job';

type SavedGridProps = {
  items: SavedJobDto[];
};

/**
 * Renders saved jobs in grid or list view with note editor.
 */
export function SavedGrid({ items }: SavedGridProps) {
  const view = useUiStore((s) => s.savedView);
  const unsaveMutation = useUnsaveJob();

  if (view === 'list') {
    return (
      <div className="space-y-4">
        {items.map((saved) => (
          <div key={saved.job.id} className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Link
                  href={`/jobs/${saved.job.id}`}
                  className="font-semibold hover:text-primary"
                >
                  {saved.job.title}
                </Link>
                <p className="text-sm text-muted-foreground">{saved.job.company}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Saved {formatRelativeTime(saved.savedAt)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => unsaveMutation.mutate(saved.job.id)}
                disabled={
                  unsaveMutation.isPending &&
                  unsaveMutation.variables === saved.job.id
                }
              >
                Remove
              </Button>
            </div>
            <SavedNoteEditor saved={saved} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2')}>
      {items.map((saved) => (
        <div key={saved.job.id} className="space-y-0">
          <JobCard job={saved.job} />
          <div className="rounded-b-xl border border-t-0 bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Saved {formatRelativeTime(saved.savedAt)}
            </p>
            <SavedNoteEditor saved={saved} />
          </div>
        </div>
      ))}
    </div>
  );
}
