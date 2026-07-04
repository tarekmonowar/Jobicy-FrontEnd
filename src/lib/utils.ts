// Pure UI/formatting helpers — cn(), salary display, relative time, CSV export.

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from '@/config/runtime';
import type { JobCardDto, SalaryCurrency } from '@/types/job';

/** Merge Tailwind class names without conflicts (used by shadcn/ui). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Human-readable relative time, e.g. "3h ago". */
export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  return `${Math.floor(months / 12)}y ago`;
}

/**
 * Relative time for job cards — uses lastSeenAt (updated every ingestion run)
 * so re-fetched jobs show as fresh immediately after a fetch.
 */
export function formatJobListedTime(job: {
  postedAt: string;
  lastSeenAt?: string;
}): string {
  if (job.lastSeenAt) {
    return formatRelativeTime(job.lastSeenAt);
  }
  return formatRelativeTime(job.postedAt);
}

/**
 * Format salary for job cards — range, "Negotiable", or "Not specified".
 * Honors the active display currency via optional override.
 */
export function formatSalary(
  min: number | null,
  max: number | null,
  currency: SalaryCurrency | null,
  negotiable: boolean,
  displayCurrency?: 'BDT' | 'USD',
): string {
  if (negotiable && min === null && max === null) {
    return 'Negotiable';
  }

  if (min === null && max === null) {
    return negotiable ? 'Negotiable' : 'Not specified';
  }

  const target = displayCurrency ?? currency ?? 'BDT';
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(n);

  const from = currency ?? 'BDT';
  const lo = min !== null ? convertCurrency(min, from, target) : null;
  const hi = max !== null ? convertCurrency(max, from, target) : null;

  if (lo !== null && hi !== null) {
    return `${fmt(lo)} – ${fmt(hi)} ${target}`;
  }
  if (lo !== null) return `From ${fmt(lo)} ${target}`;
  if (hi !== null) return `Up to ${fmt(hi)} ${target}`;

  return negotiable ? 'Negotiable' : 'Not specified';
}

/** True when the job should render the Inactive badge (deadline passed or deactivated). */
export function isJobInactive(job: Pick<JobCardDto, 'isActive' | 'applicationDeadline'>): boolean {
  if (!job.isActive) return true;
  if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
    return true;
  }
  return false;
}

/** Convert between BDT and USD using the static rate from env. */
export function convertCurrency(
  amount: number,
  from: 'BDT' | 'USD',
  to: 'BDT' | 'USD',
): number {
  if (from === to) return amount;
  if (from === 'USD' && to === 'BDT') return Math.round(amount * env.usdToBdt);
  return Math.round(amount / env.usdToBdt);
}

/** Build a CSV string from rows (first row = headers). */
export function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = cell ?? '';
          const str = String(value);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(','),
    )
    .join('\n');
}
