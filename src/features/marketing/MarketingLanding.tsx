import MarketingHero from './MarketingHero';
import { MarketingFinalCta, MarketingPillars, MarketingPrivacy } from './MarketingSections';

export default function MarketingLanding() {
  return (
    <main className="min-h-[100dvh] bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <MarketingHero />
      <MarketingPillars />
      <MarketingPrivacy />
      <MarketingFinalCta />
    </main>
  );
}
