'use client';

// Saved jobs page — grid/list view, notes, CSV export.

import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { SavedGrid } from '@/components/saved/SavedGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSaved } from '@/hooks/useSavedJobs';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { exportCsvUrl } from '@/lib/api/savedApi';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { LayoutGrid, List } from 'lucide-react';

function SavedContent() {
  const [sort, setSort] = useState<string>('latest');
  const { data, isLoading, isError, error, refetch } = useSaved(sort);
  const savedView = useUiStore((s) => s.savedView);
  const setSavedView = useUiStore((s) => s.setSavedView);

  const downloadCsv = async () => {
    const token = useAuthStore.getState().accessToken;
    try {
      const res = await fetch(exportCsvUrl(), {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'saved-jobs.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch {
      toast.error('Could not export CSV');
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? 'Failed to load saved jobs'}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="No saved jobs"
        message="Tap the heart on any job card to save it here."
        action={
          <Button variant="outline" asChild>
            <Link href="/jobs">Browse jobs</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest saved</SelectItem>
              <SelectItem value="oldest">Oldest saved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={savedView === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setSavedView('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            type="button"
            variant={savedView === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setSavedView('list')}
            aria-label="List view"
          >
            <List className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => void downloadCsv()}>
            Export CSV
          </Button>
        </div>
      </div>

      <SavedGrid items={data} />
    </>
  );
}

/** Auth-required saved jobs with notes and export. */
export default function SavedPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Saved jobs</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Your bookmarked roles with personal notes.
        </p>
        <SavedContent />
      </div>
    </ProtectedRoute>
  );
}
