/**
 * Shell geometry contract — the mobile canvas, and why it is shaped this way.
 *
 * Why this file exists: the shell's viewport invariants used to be asserted by
 * `e2e/mobile-shell-viewport.spec.ts` (see the "Viewport contract" note in
 * index.css). That suite was deleted with the rest of the e2e tooling, which left
 * the single most load-bearing geometry in the product — one scroll owner, one
 * safe-area application per edge, one bottom-clearance model — guarded by nothing
 * at all. These are the same invariants, expressed as structural tests.
 *
 * The shape being protected:
 *
 *   html/body/#root      height: 100%  (the LAYOUT viewport, never a viewport unit)
 *     [data-app-shell]   applies the top inset exactly once
 *       main[data-scroll]  ← the ONE root page scrollport
 *         padded page container
 *         …page…
 *       [data-bottom-nav]  fixed bottom-0, height = --bottom-nav-height
 *       [contextual-fab]   bottom = --bottom-nav-height + --fab-offset
 *
 * The clearance math itself is owned and tested by `shellClearance.ts` +
 * `shellClearance.test.ts`; this file protects the geometry those values live in.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const fromSrc = (relative: string) =>
    fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');

/** Comments describe the geometry (and quote the units we do NOT use) — strip them. */
function stripComments(source: string): string {
    return source
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const SHELL_GEOMETRY_FILES = [
    'index.css',
    'styles/app-shell.css',
    'layouts/MainLayout.tsx',
    'layouts/shellClearance.ts',
    'components/mobile/BottomNavigation.tsx',
    'components/mobile/ContextualFab.tsx',
    'components/mobile/PullToRefresh.tsx',
];

const TAB_PAGES = [
    'features/dashboard/DashboardView.tsx',
    'features/commitments/CommitmentsView.tsx',
    'features/finance/FinanceView.tsx',
    'features/settings/SettingsView.tsx',
];

describe('the shell has exactly one root scroll owner', () => {
    const mainLayout = fromSrc('layouts/MainLayout.tsx');

    it('marks the page scrollport with [data-scroll] exactly once', () => {
        expect((mainLayout.match(/data-scroll/g) ?? []).length).toBe(1);
        expect(mainLayout).toMatch(/<main\s[\s\S]{0,200}?data-scroll/);
    });

    it('keeps the scrollport inside the shell (never moves scrolling to the document)', () => {
        expect(mainLayout).toMatch(/data-scroll[\s\S]{0,220}?overflow-y-auto min-h-0/);
    });

    /**
     * Two, and deliberately no more: `<main>` (the page) and the desktop sidebar's
     * own nav. A third page-level scroller is the defect this pins.
     */
    it('creates no third page-level scroll container', () => {
        const scrollContainers = (mainLayout.match(/overflow-y-auto/g) ?? []).length;
        expect(scrollContainers).toBe(2);
    });
});

describe('the bottom navigation is anchored to the physical bottom edge', () => {
    const nav = fromSrc('components/mobile/BottomNavigation.tsx');

    it('is fixed to bottom-0 and hidden below the desktop breakpoint', () => {
        expect(nav).toMatch(/md:hidden fixed inset-x-0 bottom-0/);
    });

    it('takes its height from the one shared token, not a local literal', () => {
        expect(nav).toMatch(
            /height: 'var\(--bottom-nav-height, calc\(49px \+ env\(safe-area-inset-bottom, 0px\)\)\)'/,
        );
    });

    it('applies the device inset as padding INSIDE that height (so it is counted once)', () => {
        expect(nav).toMatch(/paddingBottom: 'env\(safe-area-inset-bottom, 0px\)'/);
        // Two textual occurrences: the token fallback (used only if the token is
        // undefined) and the applied padding. A third would mean a second inset.
        expect((nav.match(/safe-area-inset-bottom/g) ?? []).length).toBe(2);
    });

    it('never adds layout height beneath itself', () => {
        // Transform-only hide: moving the bar must not change the document or the
        // scrollport height, or the page would shift when it slides away.
        expect(nav).toMatch(/translate-y-full/);
        // Anchored to the edge (`bottom-0`) — never floated at an arbitrary offset.
        expect(nav).not.toMatch(/\bbottom-[1-9]\d*/);
    });
});

describe('the contextual FAB shares the navigation geometry', () => {
    const fab = fromSrc('components/mobile/ContextualFab.tsx');

    it('derives its offset from the shell geometry rather than a magic number', () => {
        expect(fab).toMatch(/bottom: 'var\(--shell-above-nav\)'/);
    });

    it('does not position itself with a fixed bottom utility', () => {
        expect(stripComments(fab)).not.toMatch(/\bbottom-[0-9]/);
    });
});
describe('the shell height is measured in the layout viewport', () => {
    const css = stripComments(fromSrc('index.css'));

    it('sizes the shell with the 100% chain, not a viewport unit', () => {
        expect(css).toMatch(/#root \{\s*height: 100%;/);
        expect(css).toMatch(/\bbody \{[\s\S]{0,320}?height: 100%;/);
    });

    it('publishes each shell dimension exactly once', () => {
        expect((css.match(/--bottom-nav-height:/g) ?? []).length).toBe(1);
        expect((css.match(/--shell-bottom-clearance:/g) ?? []).length).toBe(1);
        expect((css.match(/--shell-bottom-clearance-fab:/g) ?? []).length).toBe(1);
    });

    it('counts the device inset once, inside the navigation height only', () => {
        const line = css.split('\n').find((l) => l.includes('--bottom-nav-height:')) ?? '';
        expect((line.match(/safe-area-inset-bottom/g) ?? []).length).toBe(1);
    });

    it('composes both clearances from the navigation height', () => {
        expect(css).toMatch(/--shell-bottom-clearance: calc\(var\(--bottom-nav-height\) \+ /);
        expect(css).toMatch(
            /--shell-bottom-clearance-fab: calc\(var\(--bottom-nav-height\) \+ var\(--fab-band-height\) \+ /,
        );
    });

    it('leaves shell geometry free of viewport units', () => {
        for (const file of SHELL_GEOMETRY_FILES) {
            const source = stripComments(fromSrc(file));
            expect(source, `${file} must not size shell geometry in viewport units`).not.toMatch(
                /100(vh|dvh|svh)/,
            );
        }
    });

    it('contains no fixed viewport-height box anywhere in the app', () => {
        const offenders: string[] = [];
        const walk = (dir: string) => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) walk(full);
                else if (/\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name)) {
                    // A fixed-height box subtracting from 100vh is taller than the shell
                    // it sits in on iOS, where vh is the LARGE viewport. Caps
                    // (`max-h-[65vh]`) are a different, deliberate thing.
                    //
                    // Scanned WITHOUT stripping comments, because Tailwind v4 scans raw
                    // file text: a comment that quotes the class still causes the
                    // utility to be emitted into the shipped stylesheet. This assertion
                    // caught exactly that — the retired class was still in the deployed
                    // CSS because a comment describing its removal quoted it.
                    if (/h-\[calc\(100vh/.test(fs.readFileSync(full, 'utf8'))) {
                        offenders.push(path.relative(process.cwd(), full));
                    }
                }
            }
        };
        walk(new URL('..', import.meta.url).pathname);
        expect(offenders).toEqual([]);
    });
});

describe('safe-area ownership: one responsibility, one owner', () => {
    it('the top inset is applied by the app shell, in exactly one property', () => {
        const app = fromSrc('App.tsx');
        // One property. The inset is named twice only because that property's value is
        // a ternary with two branches (with and without the environment banner).
        expect((app.match(/paddingTop:[\s\S]{0,300}?env\(safe-area-inset-top/g) ?? []).length).toBe(1);
        expect((app.match(/env\(safe-area-inset-top/g) ?? []).length).toBe(2);
        for (const file of ['layouts/MainLayout.tsx', 'components/mobile/BottomNavigation.tsx', 'components/mobile/ContextualFab.tsx']) {
            expect(fromSrc(file), `${file} must not apply a top inset`).not.toMatch(/env\(safe-area-inset-top/);
        }
    });

    /**
     * The shell owns the bottom edge for page content: `--bottom-nav-height` carries
     * the inset and the clearance is derived from it. A page that adds its own inset
     * or spacer double-counts it, which is exactly what produced dead space under the
     * last row. (A bottom SHEET legitimately owns the physical bottom surface it
     * covers, so `MonthDaysSheet` is allowed to keep its own inset.)
     */
    it.each(TAB_PAGES)('%s leaves the bottom edge to the shell', (page) => {
        const source = stripComments(fromSrc(page));
        expect(source).not.toMatch(/safe-area-inset-bottom|safe-area-bottom|pb-safe/);
    });
});

describe('scroll containment is scoped to the root scrollport', () => {
    const shellCss = fromSrc('styles/app-shell.css');

    it('contains the page scroll and nothing else', () => {
        expect(shellCss).toMatch(
            /body\.platform-pwa \[data-scroll\] \{\s*touch-action: pan-y;\s*overscroll-behavior: contain;\s*\}/,
        );
    });

    /**
     * The blanket `.overflow-y-auto` / `.overflow-auto` / `.overflow-y-scroll`
     * selectors made the shell contain every scrollable list in the product, so the
     * page could not keep scrolling once a list reached its end — the "the page
     * turned into another screen" feel. A list that wants containment asks for it
     * itself.
     */
    it('does not silently contain every scrollable utility in the app', () => {
        for (const utility of ['\\.overflow-y-auto', '\\.overflow-auto', '\\.overflow-y-scroll']) {
            expect(shellCss).not.toMatch(new RegExp(`body\\.platform-pwa ${utility}`));
        }
    });
});

describe('PullToRefresh does not transform the page while at rest', () => {
    const pull = stripComments(fromSrc('components/mobile/PullToRefresh.tsx'));

    /**
     * A resting `translateY(0px)` is still a transform, and a transformed ancestor
     * becomes the containing block for fixed/sticky descendants and changes the
     * backdrop a descendant's `backdrop-filter` samples — and Home renders seven
     * `backdrop-filter` widgets inside this container.
     */
    it('applies the offset only when there is an offset', () => {
        expect(pull).toMatch(/transform: pullDistance > 0 \? `translateY\(\$\{pullDistance\}px\)` : 'none'/);
    });
});describe('the floating layer shares one geometry model', () => {
    const css = stripComments(fromSrc('index.css'));

    it('publishes both rungs exactly once, derived from the navigation height', () => {
        expect((css.match(/--shell-above-nav:/g) ?? []).length).toBe(1);
        expect((css.match(/--shell-above-fab:/g) ?? []).length).toBe(1);
        expect(css).toMatch(/--shell-above-nav: calc\(var\(--bottom-nav-height\) \+ var\(--fab-offset\)\)/);
        expect(css).toMatch(/--shell-above-fab: calc\(var\(--shell-above-nav\) \+ var\(--fab-height\) \+ var\(--fab-offset\)\)/);
    });

    it('puts the FAB on the first rung rather than a local calculation', () => {
        const fab = stripComments(fromSrc('components/mobile/ContextualFab.tsx'));
        expect(fab).toMatch(/bottom: 'var\(--shell-above-nav\)'/);
    });

    /**
     * The defect this pins: with a 34px inset the nav occupied 0–83px, the FAB
     * 99–155px, while the toast's bottom edge sat at 16px and the install prompt's at
     * 80px — so the toast overlapped the nav by 67px and painted over it (z-100 over
     * z-40), covering the tab labels.
     */
    it.each([
        ['context/NotificationContext.tsx', 'the toast'],
        ['components/shared/OfflineIndicator.tsx', 'the offline notice'],
        ['components/pwa/InstallPrompt.tsx', 'the install prompt'],
    ])('places %s with the shared floating rung', (file, name) => {
        const source = stripComments(fromSrc(file));
        expect(source, `${name} must use the shared floating rung`).toContain('floating-toast');
        expect(source, `${name} must not pick its own bottom offset`).not.toMatch(/\bbottom-2[0-9]\b/);
    });

    it('steps up to the second rung only while a FAB occupies the first', () => {
        expect(css).toMatch(/body\[data-fab-visible='true'\] \.floating-toast \{\s*bottom: var\(--shell-above-fab\);\s*\}/);
        const fab = stripComments(fromSrc('components/mobile/ContextualFab.tsx'));
        expect(fab).toMatch(/body\.dataset\.fabVisible = 'true'/);
    });

    /**
     * The navigation is `md:hidden`, so the floating layer's desktop reset must be at
     * `md` too — a `sm` reset would have placed these surfaces inside the bar between
     * 640 and 767px.
     */
    it('resets the floating layer at the same breakpoint the navigation hides at', () => {
        expect(css).toMatch(/@media \(min-width: 768px\) \{\s*\.floating-toast \{ bottom: 1\.5rem; \}/);
        const nav = stripComments(fromSrc('components/mobile/BottomNavigation.tsx'));
        expect(nav).toContain('md:hidden');
    });
});

describe('the bottom navigation reads as a bar', () => {
    const nav = stripComments(fromSrc('components/mobile/BottomNavigation.tsx'));

    /**
     * The bar's fill is deliberately close to the page background, so its divider is
     * the only thing that gives it a perceivable extent. A sub-threshold hairline is
     * what let its own home-indicator band read as empty space.
     */
    it('has a visible divider in both themes', () => {
        expect(nav).toMatch(/border-t border-slate-300/);
        expect(nav).toMatch(/dark:border-white\/\[0\.14\]/);
    });

    it('does not use a surface token that equals the page background', () => {
        // --surface-raised resolves to the page background in both themes, so a bar
        // filled with it would be invisible.
        expect(nav).not.toContain('bg-surface-raised');
    });
});
