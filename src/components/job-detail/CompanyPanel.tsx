// Company summary panel on the job detail page.

import Image from 'next/image';
import { Building2, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { JobDetailDto } from '@/types/job';

type CompanyPanelProps = {
  job: JobDetailDto;
};

/** Side panel with company info and link to the original posting. */
export function CompanyPanel({ job }: CompanyPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="size-4" aria-hidden />
          Company
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {job.companyLogo ? (
          <Image
            src={job.companyLogo}
            alt={`${job.company} logo`}
            width={64}
            height={64}
            className="rounded-lg border object-contain"
            unoptimized
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-lg border bg-muted">
            <Building2 className="size-8 text-muted-foreground" />
          </div>
        )}

        <div>
          <p className="font-medium">{job.company}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden />
            {job.location}
          </p>
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
            View original posting
            <ExternalLink className="ml-2 size-3.5" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
