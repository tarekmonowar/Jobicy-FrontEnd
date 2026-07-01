'use client';

// Apply CTA — records intent, opens source URL, hidden once applied.

import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useApply } from '@/hooks/useApplications';
import { useAuthStore } from '@/store/authStore';
import type { JobDetailDto } from '@/types/job';

type ApplyButtonProps = {
  job: Pick<JobDetailDto, 'id' | 'isApplied' | 'sourceUrl' | 'title'>;
};

/**
 * Marks the job as applied for the user and opens the employer URL.
 */
export function ApplyButton({ job }: ApplyButtonProps) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const applyMutation = useApply();

  if (job.isApplied) {
    return (
      <Button disabled className="gap-2" variant="secondary">
        <CheckCircle2 className="size-4" />
        Applied ✓
      </Button>
    );
  }

  const handleApply = () => {
    if (status !== 'authed') {
      toast.error('Sign in to track applications');
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    applyMutation.mutate({ jobId: job.id, sourceUrl: job.sourceUrl });
  };

  return (
    <Button
      size="lg"
      onClick={handleApply}
      disabled={applyMutation.isPending}
      className="gap-2"
    >
      Apply
    </Button>
  );
}
