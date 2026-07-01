import { Hero } from '@/components/landing/Hero';
import { LiveTicker } from '@/components/landing/LiveTicker';
import { StatsRow } from '@/components/landing/StatsRow';
import { TopSkillsPreview } from '@/components/landing/TopSkillsPreview';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';

/** Landing page — live counter, ticker, stats, skills preview, and feature grid. */
export default function Home() {
  return (
    <>
      <Hero />
      <LiveTicker />
      <div className="py-12">
        <StatsRow />
      </div>
      <TopSkillsPreview />
      <FeatureShowcase />
    </>
  );
}
