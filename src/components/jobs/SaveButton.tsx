'use client';

// Heart save button with optimistic update — redirects guests to login.

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSaveJob, useUnsaveJob } from '@/hooks/useSavedJobs';
import { useAuthStore } from '@/store/authStore';

type SaveButtonProps = {
  jobId: string;
  isSaved: boolean;
  className?: string;
};

/**
 * Toggle save state. Guests are prompted to sign in.
 */
export function SaveButton({ jobId, isSaved, className }: SaveButtonProps) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();
  const pending = saveMutation.isPending || unsaveMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Wait for silent refresh — do not treat bootstrap as logged out.
    if (status === 'idle') return;

    if (status === 'guest') {
      toast.error('Sign in to save jobs');
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (isSaved) {
      unsaveMutation.mutate(jobId);
    } else {
      saveMutation.mutate({ jobId });
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('size-8 shrink-0', className)}
      onClick={handleClick}
      disabled={pending || status === 'idle'}
      aria-label={isSaved ? 'Unsave job' : 'Save job'}
    >
      <Heart
        className={cn(
          'size-4 transition-colors',
          isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground',
        )}
        aria-hidden
      />
    </Button>
  );
}
