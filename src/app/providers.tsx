'use client';

// Client providers — React Query, auth bootstrap, socket, toasts.

import { useEffect, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient, queryKeys } from '@/lib/queryClient';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import type { OverviewDto } from '@/types/analytics';
import type { StatsUpdatePayload } from '@/types/socket';

type ProvidersProps = {
  children: ReactNode;
};

/**
 * Wraps the app with QueryClient, runs silent auth refresh on mount,
 * connects Socket.io, and keeps overview stats warm via stats:update.
 */
export function Providers({ children }: ProvidersProps) {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
    try {
      connectSocket();
    } catch {
      // Socket is optional on auth pages — do not block the app.
    }

    // Patch the cached overview when live stats arrive from ingestion.
    const onStatsUpdate = (payload: StatsUpdatePayload) => {
      queryClient.setQueryData<OverviewDto>(queryKeys.analytics.overview(), (prev) =>
        prev
          ? {
              ...prev,
              totalActiveJobs: payload.totalActiveJobs,
              newJobsToday: payload.newJobsToday,
            }
          : prev,
      );
    };

    const socket = getSocket();
    socket.on('stats:update', onStatsUpdate);

    return () => {
      socket.off('stats:update', onStatsUpdate);
      disconnectSocket();
    };
  }, [bootstrap]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster
          position="top-center"
          containerStyle={{ top: 72, zIndex: 99999 }}
          toastOptions={{
            className: 'text-sm font-medium shadow-lg',
            duration: 5000,
            success: { duration: 6000 },
            error: { duration: 7000 },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
