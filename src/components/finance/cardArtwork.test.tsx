// @ts-nocheck
/**
 * Card artwork: the link that was missing (UX-FN-04).
 *
 * The picker persisted a preset id and the card only ever read the legacy image URL,
 * so "customize card artwork" saved a value that nothing drew. These tests hold the
 * two kinds of artwork apart: an image goes in `url(...)`, a pattern is CSS.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ARTWORK_PRESETS } from './cardConstants';
import { accountArtworkPresetId, artworkPresetCss, isImageArtwork } from './cardArtwork';
import { AccountCard } from './AccountCard';

const account = (overrides = {}) => ({
    id: 'acc-1', name: 'Everyday', type: 'checking', currency: 'USD', balanceCents: 123400,
    color: '#000', scope: 'personal', isArchived: false, ...overrides,
});

describe('artwork resolution', () => {
    it('treats only real URLs as images', () => {
        expect(isImageArtwork('https://example.com/a.png')).toBe(true);
        expect(isImageArtwork('blob:http://localhost/abc')).toBe(true);
        expect(isImageArtwork('data:image/png;base64,AAAA')).toBe(true);
        expect(isImageArtwork('waves')).toBe(false);
        expect(isImageArtwork(undefined)).toBe(false);
    });

    it('resolves a known preset id to CSS and an unknown one to nothing', () => {
        expect(artworkPresetCss('waves')).toBeTruthy();
        expect(artworkPresetCss('does-not-exist')).toBeUndefined();
        expect(artworkPresetCss(undefined)).toBeUndefined();
    });

    it('reads the preset from the field the picker writes', () => {
        expect(accountArtworkPresetId({ cardArtworkPreset: 'rings' })).toBe('rings');
    });

    /** Anything saved to the legacy field while the preset went to the wrong place. */
    it('accepts a legacy preset id, but never a legacy image URL', () => {
        expect(accountArtworkPresetId({ cardArtwork: 'dots' })).toBe('dots');
        expect(accountArtworkPresetId({ cardArtwork: 'https://example.com/a.png' })).toBeUndefined();
        expect(accountArtworkPresetId({ cardArtwork: 'some-unknown-value' })).toBeUndefined();
    });
});

describe('preset catalogue', () => {
    it('keeps the four ids accounts may already store', () => {
        for (const id of ['waves', 'hexagons', 'circuit', 'topographic']) {
            expect(ARTWORK_PRESETS.find((p) => p.id === id)).toBeTruthy();
        }
    });

    it('offers a real choice', () => {
        expect(ARTWORK_PRESETS.length).toBeGreaterThanOrEqual(12);
        expect(new Set(ARTWORK_PRESETS.map((p) => p.id)).size).toBe(ARTWORK_PRESETS.length);
        expect(new Set(ARTWORK_PRESETS.map((p) => p.label)).size).toBe(ARTWORK_PRESETS.length);
    });

    it('every preset paints something', () => {
        for (const preset of ARTWORK_PRESETS) {
            expect(preset.css.trim().length).toBeGreaterThan(0);
            // A pattern is CSS; only an uploaded image may be a url(...) value.
            if (preset.css.startsWith('url(')) expect(preset.css).toContain('data:image/svg+xml');
        }
    });
});

describe('AccountCard renders the chosen artwork', () => {
    it('paints a preset pattern on the card', () => {
        render(<AccountCard account={account({ cardArtworkPreset: 'circuit' })} index={0} totalCards={1} mode="expanded" isActive={false} onTap={() => {}} />);

        const layer = screen.getByTestId('account-artwork-acc-1');
        expect(layer.style.background).toContain('radial-gradient');
        // Never wrapped in url(): that is what made presets invisible.
        expect(layer.style.background).not.toContain('url(circuit)');
    });

    it('paints nothing when no artwork is chosen', () => {
        render(<AccountCard account={account()} index={0} totalCards={1} mode="expanded" isActive={false} onTap={() => {}} />);
        expect(screen.queryByTestId('account-artwork-acc-1')).not.toBeInTheDocument();
    });

    it('paints nothing for an unknown preset id', () => {
        render(<AccountCard account={account({ cardArtworkPreset: 'nonsense' })} index={0} totalCards={1} mode="expanded" isActive={false} onTap={() => {}} />);
        expect(screen.queryByTestId('account-artwork-acc-1')).not.toBeInTheDocument();
    });
});