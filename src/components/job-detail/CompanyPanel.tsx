// Company details panel on the job detail page (no logo).

import { Building2, Globe, Link2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { JobDetailDto } from '@/types/job';

type CompanyPanelProps = {
  job: JobDetailDto;
};

/** Short hostname label for an external URL. */
function urlLabel(url: string): string {
  try {
    const host = new URL(url).hostname;
    return host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Side panel with company name, location, and optional website / LinkedIn links. */
export function CompanyPanel({ job }: CompanyPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="size-4" aria-hidden />
          Company
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="font-medium">{job.company}</p>
          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {job.location}
          </p>
        </div>

        {job.companyWebsite && (
          <a
            href={job.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Globe className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{urlLabel(job.companyWebsite)}</span>
          </a>
        )}

        {job.companyLinkedIn && (
          <a
            href={job.companyLinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Link2 className="size-4 shrink-0" aria-hidden />
            <span className="truncate">LinkedIn</span>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
