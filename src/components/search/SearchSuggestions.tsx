'use client';

// Search suggestions — recent + popular queries.

import { Clock, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SearchSuggestionsProps = {
  recent: string[];
  popular: readonly string[];
  onSelect: (term: string) => void;
  onClearRecent: () => void;
  className?: string;
};

/**
 * Dropdown panel of recent and popular search terms.
 * Shown when the search input is focused or empty.
 */
export function SearchSuggestions({
  recent,
  popular,
  onSelect,
  onClearRecent,
  className,
}: SearchSuggestionsProps) {
  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-popover shadow-lg',
        className,
      )}
      role="listbox"
      aria-label="Search suggestions"
    >
      {recent.length > 0 && (
        <div className="border-b p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Clock className="size-3.5" aria-hidden />
              Recent
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={onClearRecent}
            >
              <X className="mr-1 size-3" aria-hidden />
              Clear
            </Button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {recent.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  role="option"
                  className="rounded-full bg-secondary px-3 py-1 text-sm transition-colors hover:bg-accent"
                  onClick={() => onSelect(term)}
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-3">
        <span className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <TrendingUp className="size-3.5" aria-hidden />
          Popular
        </span>
        <ul className="flex flex-wrap gap-2">
          {popular.map((term) => (
            <li key={term}>
              <button
                type="button"
                role="option"
                className="rounded-full border border-border px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary"
                onClick={() => onSelect(term)}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
