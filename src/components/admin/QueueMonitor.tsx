'use client';

// BullMQ queue monitor — refreshes every 2 minutes; use Refresh for immediate update.

import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useQueues } from '@/hooks/useAdmin';
import type { QueueStatusDto } from '@/lib/api/adminApi';

type QueueRowProps = {
  queue: QueueStatusDto;
};

/** Single queue row with active/waiting/completed/failed counts. */
function QueueRow({ queue }: QueueRowProps) {
  const hasIssues = queue.failed > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <span className="font-medium capitalize">{queue.name.replace(/-/g, ' ')}</span>
        {hasIssues && <Badge variant="destructive">{queue.failed} failed</Badge>}
      </div>
      <div className="flex flex-wrap gap-4 text-sm tabular-nums text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">{queue.active}</span> active
        </span>
        <span>
          <span className="font-medium text-foreground">{queue.waiting}</span> waiting
        </span>
        <span>
          <span className="font-medium text-foreground">{queue.completed}</span> done
        </span>
        <span className={hasIssues ? 'text-destructive' : undefined}>
          <span className="font-medium">{queue.failed}</span> failed
        </span>
      </div>
    </div>
  );
}

/**
 * BullMQ queue status — refetches every 2 minutes via useQueues (manual refresh available).
 */
export function QueueMonitor() {
  const { data, isLoading, isError, refetch, isFetching } = useQueues();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState message="Could not load queue status" onRetry={() => void refetch()} />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Background queues</CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RefreshCw
            className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`}
            aria-hidden
          />
          Auto-refresh 2 min
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No queues registered.</p>
        ) : (
          data.map((queue) => <QueueRow key={queue.name} queue={queue} />)
        )}
      </CardContent>
    </Card>
  );
}
