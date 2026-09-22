/**
 * FormActionBar — the one pinned action region for a form (CM-28).
 *
 * Why it exists: the Save/Cancel region of a form is the last thing a thumb reaches
 * for, and it must never become a lid over the fields. The rule is structural, and
 * this component is the only place that implements it:
 *
 *   1. It is `sticky bottom-0` **inside** the scrolling content. That is what makes
 *      "every field can be scrolled completely above the footer" true by
 *      construction rather than by luck: the bar is the last element in the flow, so
 *      the content that precedes it always ends above it. A bar pinned OUTSIDE the
 *      content flow (fixed to the viewport) would need its height reserved by the
 *      scroll container instead — which is exactly the arithmetic that drifted in
 *      the old per-page implementations.
 *   2. It is opaque and bordered. Two of the previous bars were translucent (one
 *      with `backdrop-blur`), so fields read *through* them — which is what made a
 *      covered field look like a missing one.
 *   3. It carries NO `env(safe-area-inset-bottom)`. The shell owns that inset once,
 *      inside `--bottom-nav-height`, and the bar sits above the bottom navigation
 *      rather than on the home indicator. Adding it here counted it twice and pushed
 *      the bar up over the last field.
 *   4. No negative margins, ever: the space above the bar comes from the shell's
 *      bottom clearance (`--shell-bottom-clearance`, owned by MainLayout), not from
 *      pulling the bar over the fields.
 *   5. It reports its measured height so the shell can put it in the scrollport's
 *      `scroll-padding-bottom`. That is what keeps a focused field — and anything
 *      reached by `scrollIntoView` — from landing underneath the bar.
 */

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useRegisterActionBarHeight } from '../../context/ActionBarContext';

interface FormActionBarProps {
    children: React.ReactNode;
    /** Extra classes for the bar itself (padding, alignment). */
    className?: string;
    testId?: string;
}

export const FormActionBar: React.FC<FormActionBarProps> = ({
    children, className = '', testId = 'form-action-bar',
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return undefined;
        // Measured, not assumed: the bar's height follows the type scale, the
        // device's font-size setting and whatever buttons a page puts in it.
        const measure = () => setHeight(Math.ceil(element.getBoundingClientRect().height));
        measure();
        if (typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useRegisterActionBarHeight(height);

    return (
        <div
            ref={ref}
            data-testid={testId}
            data-action-bar="true"
            className={`sticky bottom-0 z-20 mt-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 ${className}`}
        >
            {children}
        </div>
    );
};