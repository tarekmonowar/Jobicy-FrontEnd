'use client';

// Debounce a value — used by filter keyword input and search.

import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that updates after `delayMs` of stability.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
