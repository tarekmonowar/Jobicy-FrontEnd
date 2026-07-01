// Market competitiveness widget from job detail DTO.

import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { JobDetailDto } from '@/types/job';

type MarketInsightProps = {
  insight: JobDetailDto['marketInsight'];
};

const DEMAND_COLORS: Record<string, string> = {
  Low: 'text-muted-foreground',
  Medium: 'text-amber-600',
  High: 'text-success',
};

/**
 * Shows how competitive this role is based on similar active listings.
 */
export function MarketInsight({ insight }: MarketInsightProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="size-4" aria-hidden />
          Market insight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">{insight.similarActiveCount}</span> similar active
          jobs in this category
        </p>
        <p>
          Demand:{' '}
          <span className={`font-semibold ${DEMAND_COLORS[insight.demandLabel] ?? ''}`}>
            {insight.demandLabel}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
