'use client';

// List of the user's job alerts with loading, empty, and error states.

import { AlertCard } from '@/components/alerts/AlertCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { useAlerts } from '@/hooks/useAlerts';

/**
 * Renders all alerts for the signed-in user.
 */
export function AlertList() {
  const { data, isLoading, isError, error, refetch } = useAlerts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? 'Failed to load alerts'}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="No alerts yet"
        message="Create an alert above to get emailed when new jobs match your criteria."
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
