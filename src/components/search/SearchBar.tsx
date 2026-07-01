'use client';

// Search input with debounce and suggestion panel.

import { useRef, useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchSuggestions } from '@/components/search/SearchSuggestions';
import { useSearchState } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

/**
 * Controlled search field — debounces to URL `?q=` and shows recent/popular picks.
 */
export function SearchBar() {
  const { query, setQuery, recent, popular, submitSearch, clearRecent } = useSearchState();
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const showSuggestions = focused && query.trim().length < 2;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitSearch(query);
    setFocused(false);
  };

  const handleSelect = (term: string) => {
    submitSearch(term);
    setFocused(false);
  };

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              // Delay so suggestion clicks register before the panel closes.
              window.setTimeout(() => setFocused(false), 150);
            }}
            placeholder="Search jobs by title, company, or skills…"
            className={cn('h-12 pl-12 pr-4 text-base shadow-sm')}
            aria-label="Search jobs"
            autoComplete="off"
          />
        </div>
      </form>

      {showSuggestions && (
        <SearchSuggestions
          recent={recent}
          popular={popular}
          onSelect={handleSelect}
          onClearRecent={clearRecent}
        />
      )}
    </div>
  );
}
