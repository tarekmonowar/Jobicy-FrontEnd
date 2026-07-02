'use client';

// Manual ingestion trigger — enqueues a BullMQ job to fetch from all sources.

import { Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTriggerFetch } from '@/hooks/useAdmin';

/**
 * Enqueues an immediate multi-source ingestion run via POST /admin/fetch/trigger.
 */
export function TriggerFetchButton() {
  const { mutate, isPending } = useTriggerFetch();

  return (
    <Button
      onClick={() => mutate()}
      disabled={isPending}
      className="gap-2"
      aria-busy={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Play className="size-4" aria-hidden />
      )}
      {isPending ? 'Enqueueing…' : 'Trigger fetch now'}
    </Button>
  );
}
