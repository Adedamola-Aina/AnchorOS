
/**
 * The action-bar contract (CM-28).
 *
 * The defect: a form's Save/Cancel region could sit over its own fields. Two of the
 * old bars were translucent (fields read *through* them) and one re-added a
 * safe-area inset the shell already carries — which made the bar taller than the
 * space reserved for it. These assertions pin the structural rules that replaced
 * those per-page inventions.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { ActionBarProvider, useActionBarHeight } from '../../context/ActionBarContext';
import { FormActionBar } from './FormActionBar';

/** Reads back whatever height the bar registered. */
const HeightProbe = () => {
    const height = useActionBarHeight();
    return <span data-testid="registered-height">{height}</span>;
};

const rect = (height: number) => ({
    width: 343, height, top: 0, left: 0, right: 343, bottom: height, x: 0, y: 0,
    toJSON: () => ({}),
}) as DOMRect;

describe('FormActionBar — scroll padding', () => {
    beforeEach(() => {
        // jsdom has no layout, so the measured height has to be supplied.
        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(rect(69));
    });
    afterEach(() => vi.restoreAllMocks());

    it('publishes its measured height so the shell can keep fields above it', () => {
        render(
            <ActionBarProvider>
                <FormActionBar><span /></FormActionBar>
                <HeightProbe />
            </ActionBarProvider>,
        );

        expect(screen.getByTestId('registered-height')).toHaveTextContent('69');
    });

    it('releases the reserved scroll room when it unmounts', () => {
        const { unmount } = render(
            <ActionBarProvider>
                <FormActionBar><span /></FormActionBar>
                <HeightProbe />
            </ActionBarProvider>,
        );
        expect(screen.getByTestId('registered-height')).toHaveTextContent('69');

        unmount();
        render(<ActionBarProvider><HeightProbe /></ActionBarProvider>);
        expect(screen.getByTestId('registered-height')).toHaveTextContent('0');
    });

    it('re-measures when its content changes height', () => {
        let trigger: ResizeObserverCallback | undefined;
        const observe = vi.fn();
        class FakeObserver {
            constructor(callback: ResizeObserverCallback) { trigger = callback; }
            observe = observe;
            unobserve = vi.fn();
            disconnect = vi.fn();
        }
        vi.stubGlobal('ResizeObserver', FakeObserver);

        render(
            <ActionBarProvider>
                <FormActionBar><span /></FormActionBar>
                <HeightProbe />
            </ActionBarProvider>,
        );
        expect(observe).toHaveBeenCalled();

        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(rect(96));
        act(() => { trigger?.([], {} as ResizeObserver); });

        expect(screen.getByTestId('registered-height')).toHaveTextContent('96');
        vi.unstubAllGlobals();
    });

    it('works without a provider, so a page can render alone', () => {
        render(<><FormActionBar><span /></FormActionBar><HeightProbe /></>);
        expect(screen.getByTestId('form-action-bar')).toBeInTheDocument();
        expect(screen.getByTestId('registered-height')).toHaveTextContent('0');
    });
});

describe('FormActionBar', () => {
    it('renders its actions', () => {
        render(<FormActionBar><button type="button">Save</button></FormActionBar>);
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    /**
     * Sticky inside the scrolling content is the whole guarantee: the bar is the
     * last element in the flow, so every field above it can be scrolled completely
     * clear of it. A bar fixed to the viewport would need its height reserved by the
     * scroll container instead.
     */
    it('is sticky inside the content flow, so fields always end above it', () => {
        render(<FormActionBar><span /></FormActionBar>);
        const bar = screen.getByTestId('form-action-bar');

        expect(bar.className).toContain('sticky');
        expect(bar.className).toContain('bottom-0');
        expect(bar.className).not.toContain('fixed');
    });

    it('is opaque and bordered, so fields cannot read through it', () => {
        render(<FormActionBar><span /></FormActionBar>);
        const bar = screen.getByTestId('form-action-bar');

        expect(bar.className).toContain('bg-white');
        expect(bar.className).toContain('border-t');
        expect(bar.className).not.toContain('backdrop-blur');
        expect(bar.className).not.toContain('bg-white/');
    });

    it('carries no safe-area inset — the shell owns it, inside --bottom-nav-height', () => {
        render(<FormActionBar><span /></FormActionBar>);
        const bar = screen.getByTestId('form-action-bar');

        expect(bar.className).not.toContain('env(');
        expect(bar.getAttribute('style') ?? '').not.toContain('env(');
        expect(bar.className).not.toContain('pb-safe');
    });

    it('never uses a negative margin to make room for itself', () => {
        render(<FormActionBar className="px-1 pt-3 pb-3"><span /></FormActionBar>);
        const bar = screen.getByTestId('form-action-bar');

        expect(bar.className).not.toMatch(/-m[tblrxy]?-/);
        expect(bar.className).not.toMatch(/-mb-/);
    });

    it('accepts a caller test id, so a page keeps its own handle', () => {
        render(<FormActionBar testId="edit-actions"><span /></FormActionBar>);
        expect(screen.getByTestId('edit-actions')).toHaveAttribute('data-action-bar', 'true');
    });
});
