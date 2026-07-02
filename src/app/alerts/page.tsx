'use client';

// Job alerts page — create alerts and manage existing ones (auth required).

import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { AlertForm } from '@/components/alerts/AlertForm';
import { AlertList } from '@/components/alerts/AlertList';

/** Auth-required alerts management — create, edit, toggle, test, preview, delete. */
export default function AlertsPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Job alerts</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Get notified when new developer jobs match your keywords, skills, and filters.
        </p>

        <div className="space-y-8">
          <AlertForm />
          <div>
            <h2 className="mb-4 text-lg font-semibold">Your alerts</h2>
            <AlertList />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
