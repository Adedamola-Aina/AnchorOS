import MarketingNav from './MarketingNav';
import MarketingHero from './MarketingHero';
import MarketingShowcase from './MarketingShowcase';
import { MarketingFinalCta, MarketingPillars, MarketingPrivacy } from './MarketingSections';
import MarketingFaq from './MarketingFaq';
import MarketingFooter from './MarketingFooter';

export default function MarketingLanding() {
  return (
    <div className="h-full w-full overflow-y-auto scroll-smooth bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <MarketingNav />
      <main>
        <MarketingHero />
        <MarketingPillars />
        <MarketingShowcase />
        <MarketingPrivacy />
        <MarketingFaq />
        <MarketingFinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
