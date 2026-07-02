'use client';

// Numbered page controls for the jobs list (Prev · pages · Next).

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type JobPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/**
 * Build a compact page window with ellipses, e.g. [1, '…', 4, 5, 6, '…', 20].
 * Always keeps the first/last page and the current page's immediate neighbours.
 */
function buildPageWindow(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: (number | 'ellipsis')[] = [];
  let previous = 0;
  for (const current of sorted) {
    if (current - previous > 1) result.push('ellipsis');
    result.push(current);
    previous = current;
  }
  return result;
}

/** Page navigation shown under the job list; hidden when there's a single page. */
export function JobPagination({ page, totalPages, onPageChange, className }: JobPaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildPageWindow(page, totalPages);

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Job list pagination"
    >
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'default' : 'outline'}
            size="icon"
            className="size-8 text-xs"
            onClick={() => onPageChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        className="size-8"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
