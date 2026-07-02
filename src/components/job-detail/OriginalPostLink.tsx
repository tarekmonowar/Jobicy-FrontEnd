// Opens the employer's original job posting in a new tab.

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type OriginalPostLinkProps = {
  sourceUrl: string;
};

/** External link to the source job listing. */
export function OriginalPostLink({ sourceUrl }: OriginalPostLinkProps) {
  if (!sourceUrl) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="gap-2 border-sky-200/70 bg-sky-50/60 text-sky-900 shadow-none hover:bg-sky-100/70 hover:text-sky-900"
      asChild
    >
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="size-4" aria-hidden />
        Original post
      </a>
    </Button>
  );
}
