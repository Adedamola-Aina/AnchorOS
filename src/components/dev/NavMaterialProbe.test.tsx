import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavMaterialProbe, NAV_MATERIAL_PROBE_LABEL } from './NavMaterialProbe';
import { NAV_MATERIAL_ATTRIBUTE, NAV_MATERIAL_STORAGE_KEY } from '../../utils/navMaterial';

const attribute = () => document.documentElement.getAttribute(NAV_MATERIAL_ATTRIBUTE);

describe('the nav-material probe', () => {
    beforeEach(() => {
        document.documentElement.removeAttribute(NAV_MATERIAL_ATTRIBUTE);
        window.localStorage.clear();
    });

    afterEach(() => {
        cleanup();
        document.documentElement.removeAttribute(NAV_MATERIAL_ATTRIBUTE);
    });

    it('starts on the shipped bar and says so', () => {
        render(<NavMaterialProbe />);
        expect(attribute()).toBe('current');
        expect(screen.getByTestId('nav-material-probe').textContent)
            .toContain('today: opaque white');
    });

    it('cycles through every candidate and back to shipped', async () => {
        const user = userEvent.setup();
        render(<NavMaterialProbe />);

        await user.click(screen.getByTestId('nav-material-probe'));
        expect(attribute()).toBe('translucent');

        await user.click(screen.getByTestId('nav-material-probe'));
        expect(attribute()).toBe('raised');

        await user.click(screen.getByTestId('nav-material-probe'));
        expect(attribute()).toBe('current');
    });

    it('remembers the choice across a remount, and republishes it on mount', async () => {
        const user = userEvent.setup();
        render(<NavMaterialProbe />);
        await user.click(screen.getByTestId('nav-material-probe'));

        expect(window.localStorage.getItem(NAV_MATERIAL_STORAGE_KEY)).toBe('translucent');

        // A reload: the attribute is wiped by the browser and must come back from
        // storage, or the bar would snap to shipped on every navigation.
        cleanup();
        document.documentElement.removeAttribute(NAV_MATERIAL_ATTRIBUTE);

        render(<NavMaterialProbe />);
        expect(attribute()).toBe('translucent');
    });

    it('does not sit above the overlays it must never cover', () => {
        render(<NavMaterialProbe />);
        const probe = screen.getByTestId('nav-material-probe');
        // Sheets and dialogs are z-50 and up; the probe is deliberately below them.
        expect(probe.className).toContain('z-[45]');
    });

    it('names itself for the accessible tree, including the current surface', async () => {
        const user = userEvent.setup();
        render(<NavMaterialProbe />);
        expect(screen.getByLabelText(new RegExp(NAV_MATERIAL_PROBE_LABEL))).toBeTruthy();

        await user.click(screen.getByTestId('nav-material-probe'));
        expect(screen.getByRole('button').getAttribute('aria-label')).toContain('A: glass');
    });

    it('keeps clear of the environment strip and the status bar', () => {
        render(<NavMaterialProbe />);
        const style = screen.getByTestId('nav-material-probe').getAttribute('style') ?? '';
        // The same two terms the app shell offsets itself by — so the control can
        // never land under the strip nor over the bar being judged.
        expect(style).toContain('--env-banner-height');
        expect(style).toContain('env(safe-area-inset-top');
    });
});