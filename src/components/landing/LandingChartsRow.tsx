'use client';

// Landing preview — skill trends + salaries by role (same charts as /analytics).

import Link from 'next/link';
import { SkillTrendsChart } from '@/components/analytics/SkillTrendsChart';
import { SalaryChart } from '@/components/analytics/SalaryChart';
import { Button } from '@/components/ui/button';

/**
 * Two-column chart row placed below the live job ticker on the home page.
 */
export function LandingChartsRow() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Market insights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Skill demand trends and salary benchmarks from live developer job data
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/analytics">View all analytics</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SkillTrendsChart />
        <SalaryChart />
      </div>
    </section>
  );
}
