'use client';

// Admin dashboard — platform stats, manual fetch trigger, logs, queue monitor.

import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { PlatformStats } from '@/components/admin/PlatformStats';
import { TriggerFetchButton } from '@/components/admin/TriggerFetchButton';
import { FetchLogsTable } from '@/components/admin/FetchLogsTable';
import { QueueMonitor } from '@/components/admin/QueueMonitor';

/** Admin-only control panel — stats, ingestion trigger, fetch logs, BullMQ queues. */
export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor ingestion, background jobs, and platform health.
            </p>
          </div>
          <TriggerFetchButton />
        </div>

        <div className="space-y-8">
          <section aria-label="Platform statistics">
            <h2 className="mb-4 text-lg font-semibold">Platform stats</h2>
            <PlatformStats />
          </section>

          <section aria-label="Background queues">
            <QueueMonitor />
          </section>

          <section aria-label="Fetch logs">
            <FetchLogsTable />
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
