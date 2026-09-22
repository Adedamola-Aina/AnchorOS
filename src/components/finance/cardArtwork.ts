/**
 * Card artwork resolution (UX-FN-04).
 *
 * The defect: the picker persisted `cardArtworkPreset` (e.g. 'waves'), but the card
 * only ever read the legacy `cardArtwork` field and rendered it as
 * `backgroundImage: url(...)`. So a chosen pattern was saved and never drawn — and
 * when a preset id did reach that code path it produced `url(waves)`, which is not a
 * URL at all. "Customize card artwork doesn't work" was literally true.
 *
 * Two kinds of artwork now, resolved in one place:
 *   - an uploaded (or legacy) image  → a URL, painted with `backgroundImage: url(...)`
 *   - a preset pattern               → CSS, painted with `background: <css>`
 * They are different types of value and are no longer conflated.
 */
import { ARTWORK_PRESETS } from './cardConstants';

/** An uploaded image or a legacy stored URL — the only values that may go in `url()`. */
export function isImageArtwork(value: string | undefined | null): boolean {
    return Boolean(value && /^(https?:|blob:|data:)/i.test(value));
}

/** A preset id → its background CSS. An unknown id resolves to nothing, never to a broken URL. */
export function artworkPresetCss(presetId: string | undefined | null): string | undefined {
    if (!presetId) return undefined;
    return ARTWORK_PRESETS.find((preset) => preset.id === presetId)?.css;
}

/**
 * Which preset an account is wearing.
 *
 * `cardArtworkPreset` is the field the picker writes. `cardArtwork` is accepted as a
 * fallback for anything saved while the preset was written to the wrong field — the
 * value is only used when it is NOT an image URL and IS a known preset id, so an
 * unknown string resolves to nothing.
 */
export function accountArtworkPresetId(account: { cardArtworkPreset?: string; cardArtwork?: string }): string | undefined {
    if (account.cardArtworkPreset) return account.cardArtworkPreset;
    if (!isImageArtwork(account.cardArtwork) && artworkPresetCss(account.cardArtwork)) return account.cardArtwork;
    return undefined;
}