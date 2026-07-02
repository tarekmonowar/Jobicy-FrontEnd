import { Hero } from '@/components/landing/Hero';
import { LiveTicker } from '@/components/landing/LiveTicker';
import { LandingChartsRow } from '@/components/landing/LandingChartsRow';
import { StatsRow } from '@/components/landing/StatsRow';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';

/** Landing page — live counter, ticker, charts, stats, and feature grid. */
export default function Home() {
  return (
    <>
      <Hero />
      <LiveTicker />
      <LandingChartsRow />
      <div className="py-12">
        <StatsRow />
      </div>
      <FeatureShowcase />
    </>
  );
}
