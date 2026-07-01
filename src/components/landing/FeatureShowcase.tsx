// Static marketing feature grid for the landing page.

import {
  BarChart3,
  Bell,
  Bookmark,
  Filter,
  Radio,
  Shield,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    icon: Radio,
    title: 'Live job feed',
    description:
      'New roles appear in real time as we ingest from multiple job boards — no manual refresh needed.',
  },
  {
    icon: Filter,
    title: 'Smart filters',
    description:
      'Region (Bangladesh vs worldwide remote), work type, skills, salary, and developer category filters.',
  },
  {
    icon: BarChart3,
    title: 'Market analytics',
    description:
      'Demand index, salary trends, top companies, and skill trajectories — all in one dashboard.',
  },
  {
    icon: Bookmark,
    title: 'Save & track',
    description:
      'Heart jobs to save them with notes, mark roles as applied, and export your list to CSV.',
  },
  {
    icon: Bell,
    title: 'Job alerts',
    description:
      'Instant, daily, or weekly email alerts when new jobs match your keywords and skills.',
  },
  {
    icon: Shield,
    title: 'Built for developers',
    description:
      'Only Fullstack, Backend, Frontend, and Software Engineer roles — deduplicated across sources.',
  },
] as const;

/** Six-card grid highlighting core product capabilities. */
export function FeatureShowcase() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Everything you need to navigate the BD dev market
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          From discovery to application tracking — one platform for Bangladesh&apos;s
          software developer job hunt.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="border-0 bg-card shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
