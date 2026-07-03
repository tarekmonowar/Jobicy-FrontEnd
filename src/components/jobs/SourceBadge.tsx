// Source/provider badge — soft brand styling with icons on job cards.

import Image from 'next/image';
import { Globe, LayoutGrid, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { JobSource } from '@/types/job';

type SourceBadgeProps = {
  source: JobSource;
  sourceName?: string | null;
  /** Softer brand styling with icon — used on job cards. */
  prominent?: boolean;
};

const SOURCE_LABELS: Record<JobSource, string> = {
  LINKEDIN: 'LinkedIn',
  INDEED: 'Indeed',
  GLASSDOOR: 'Glassdoor',
  BDJOBS: 'BDJobs',
  OTHER: 'Other',
};

/** Muted, professional badge styles per provider. */
const SOURCE_STYLES: Record<JobSource, string> = {
  LINKEDIN: 'border-blue-200/80 bg-blue-50 text-blue-800',
  INDEED: 'border-sky-200/80 bg-sky-50 text-sky-800',
  GLASSDOOR: 'border-emerald-200/80 bg-emerald-50 text-emerald-800',
  BDJOBS: 'border-orange-200/80 bg-orange-50 text-orange-800',
  OTHER: 'border-slate-200/80 bg-slate-50 text-slate-700',
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IndeedIcon({ className }: { className?: string }) {
  return <Search className={className} aria-hidden />;
}

function GlassdoorIcon({ className }: { className?: string }) {
  return <LayoutGrid className={className} aria-hidden />;
}

/** BDJobs logo from public/bdjobs.jpg. */
function BdjobsIcon() {
  return (
    <Image
      src="/bdjobs.jpg"
      alt=""
      width={14}
      height={14}
      className="size-3.5 shrink-0 object-contain"
      aria-hidden
    />
  );
}

/** Brand icon when available; generic icon for BDJobs / Other. */
function SourceIcon({ source }: { source: JobSource }) {
  const iconClass = 'size-3.5 shrink-0 opacity-90';

  switch (source) {
    case 'LINKEDIN':
      return <LinkedInIcon className={iconClass} />;
    case 'INDEED':
      return <IndeedIcon className={iconClass} />;
    case 'GLASSDOOR':
      return <GlassdoorIcon className={iconClass} />;
    case 'BDJOBS':
      return <BdjobsIcon />;
    default:
      return <Globe className={iconClass} aria-hidden />;
  }
}

/**
 * Shows the job provider. For OTHER, falls back to sourceName (jobicy.com, Remote Jobs, etc.).
 */
export function SourceBadge({ source, sourceName, prominent = false }: SourceBadgeProps) {
  const label =
    source === 'OTHER' && sourceName ? sourceName : SOURCE_LABELS[source];

  if (prominent) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 border px-2.5 py-0.5 text-xs font-medium shadow-none',
          SOURCE_STYLES[source],
        )}
      >
        <SourceIcon source={source} />
        {label}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-[11px] font-medium">
      {label}
    </Badge>
  );
}
