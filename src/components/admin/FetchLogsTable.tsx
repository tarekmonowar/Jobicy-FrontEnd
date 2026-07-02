'use client';

// Paginated table of ingestion fetch logs per data source.

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { SourceBadge } from '@/components/jobs/SourceBadge';
import { useFetchLogs } from '@/hooks/useAdmin';
import { formatRelativeTime } from '@/lib/utils';
import type { FetchLogDto } from '@/lib/api/adminApi';

/** Map fetch status to badge variant and label. */
function StatusBadge({ status }: { status: FetchLogDto['status'] }) {
  if (status === 'SUCCESS') {
    return (
      <Badge className="bg-success/15 text-success hover:bg-success/20">Success</Badge>
    );
  }
  if (status === 'FAILED') {
    return <Badge variant="destructive">Failed</Badge>;
  }
  return <Badge variant="secondary">Running</Badge>;
}

/** Format duration in ms as seconds or minutes. */
function formatDuration(ms: number | null): string {
  if (ms === null) return '—';
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

/**
 * Paginated ingestion history — one row per adapter run with counts and errors.
 */
export function FetchLogsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useFetchLogs(page);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState message="Could not load fetch logs" onRetry={() => void refetch()} />
    );
  }

  const { data: logs, meta } = data;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Ingestion fetch logs</CardTitle>
        <p className="text-sm text-muted-foreground">
          Page {meta.page} of {meta.totalPages || 1}
        </p>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <EmptyState
            title="No fetch logs yet"
            message="Trigger a fetch or wait for the scheduled ingestion runs."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Source</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Fetched</th>
                  <th className="pb-3 pr-4 font-medium">New</th>
                  <th className="pb-3 pr-4 font-medium">Dupes</th>
                  <th className="pb-3 pr-4 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Started</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <SourceBadge source={log.source} />
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="py-3 pr-4 tabular-nums">{log.jobsFetched}</td>
                    <td className="py-3 pr-4 tabular-nums">{log.jobsNew}</td>
                    <td className="py-3 pr-4 tabular-nums">{log.jobsDuplicate}</td>
                    <td className="py-3 pr-4 tabular-nums">{formatDuration(log.durationMs)}</td>
                    <td className="py-3 text-muted-foreground">
                      {formatRelativeTime(log.startedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Show first error line when a run failed */}
            {logs.some((l) => l.errors.length > 0) && (
              <div className="mt-4 space-y-2 rounded-md bg-destructive/5 p-3 text-xs">
                {logs
                  .filter((l) => l.errors.length > 0)
                  .map((l) => (
                    <p key={l.id} className="text-destructive">
                      <SourceBadge source={l.source} />: {l.errors[0]}
                    </p>
                  ))}
              </div>
            )}
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta.hasNext}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
