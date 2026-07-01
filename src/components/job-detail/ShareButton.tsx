'use client';

// Share job link via clipboard or Web Share API.

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type ShareButtonProps = {
  jobId: string;
  title: string;
};

/** Copy the job URL or invoke native share when available. */
export function ShareButton({ jobId, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    typeof window !== 'undefined' ? `${window.location.origin}/jobs/${jobId}` : '';

  const handleShare = async () => {
    const url = getUrl();

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <Button type="button" variant="outline" size="lg" onClick={() => void handleShare()}>
      {copied ? (
        <Check className="size-4" />
      ) : (
        <Share2 className="size-4" />
      )}
      Share
    </Button>
  );
}
