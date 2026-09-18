import { ChevronDown } from 'lucide-react';
import MarketingReveal from './MarketingReveal';

const faqs = [
  {
    q: 'What is AnchorOS, in one line?',
    a: 'A private operating system for your money, commitments, family coordination, and AI guidance — one calm place instead of five scattered apps.',
  },
  {
    q: 'Who can see my data?',
    a: 'Only you, and only the people you explicitly share with. There is no public profile, no social feed, and your life context is never treated as content or an ad signal.',
  },
  {
    q: 'How does family sharing work?',
    a: 'Sharing is explicit and scoped. You choose which accounts or signals are visible to a family member, and personal information stays personal by default.',
  },
  {
    q: 'Is this another streak-based habit app?',
    a: 'No. AnchorOS reflects progress without celebratory loops or shame-driven mechanics. Commitments stay visible so you can follow through on your own terms.',
  },
  {
    q: 'What does AnchorAI do?',
    a: 'It reads the shape of your life inside the product and surfaces the next useful action, without turning private context into public output.',
  },
];

export default function MarketingFaq() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <MarketingReveal>
          <p className="text-small font-bold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">Questions</p>
          <h2 className="mt-4 text-h1 lg:text-h1-lg tracking-tight text-slate-950 dark:text-white">Answers, before you sign up.</h2>
        </MarketingReveal>

        <div className="mt-10 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-slate-900">
          {faqs.map((faq, index) => (
            <MarketingReveal key={faq.q} delay={index * 0.04}>
              <details className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:text-white dark:hover:bg-white/5 sm:px-6">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180" strokeWidth={2} />
                </summary>
                <p className="px-5 pb-5 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:px-6">{faq.a}</p>
              </details>
            </MarketingReveal>
          ))}
        </div>
      </div>
    </section>
  );
}