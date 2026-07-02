// Opens the employer's original job posting in a new tab.

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type OriginalPostLinkProps = {
  sourceUrl: string;
};

/** External link to the source job listing — shown before the Apply button. */
export function OriginalPostLink({ sourceUrl }: OriginalPostLinkProps) {
  if (!sourceUrl) {
    return null;
  }

  return (
    <Button variant="outline" size="lg" className="gap-2" asChild>
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="size-4" aria-hidden />
        Original post
      </a>
    </Button>
  );
}
