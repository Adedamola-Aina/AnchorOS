# Design reference uploads

Where to put the screenshots you want me to design from (Mobbin captures, App Store screens, Dribbble shots).

**Destination:** `docs/audits/2026-09-whole-product/references/mobbin/`

## Why this folder is gitignored

Mobbin captures are **third-party UI** (other companies' apps). We use them as *internal design reference* and analysis input — we do **not** redistribute them inside the repository. Image files under `references/` are excluded by `.gitignore`, so they stay on the server for me to read and can never be pushed, pasted into a PR, or shipped in a release. This README is the only tracked file here.

## How to upload (Windows → Linux server over VS Code Remote-SSH)

**Method 1 — drag and drop (easiest, no terminal needed).**
1. In VS Code, open the **Explorer** sidebar (the file tree), not an editor tab.
2. In Windows File Explorer, select your PNG/JPG files.
3. Drag them onto the `references/mobbin/` folder in the VS Code sidebar.
4. Wait for the upload indicator to finish before touching anything else.

You can also right-click `mobbin/` in the sidebar → **Upload…** and pick files.

**Method 2 — scp from Windows PowerShell** (use the same host you SSH into):
```powershell
scp "C:\Users\<you>\Pictures\mobbin\*.png" <user>@<host>:/root/anchor-control/docs/audits/2026-09-whole-product/references/mobbin/
```

**Method 3 — WinSCP / FileZilla** (SFTP, same credentials): navigate to
`/root/anchor-control/docs/audits/2026-09-whole-product/references/mobbin/` and upload.

## Naming (so I know what I'm looking at)

`<app>__<screen>__<theme>.png` — for example:

- `tiimo__today-timeline__light.png`
- `structured__day-plan__dark.png`
- `things__list-row__light.png`
- `gentler-streak__home__dark.png`
- `todoist__empty-state.png`
- `apple-reminders__smart-list.png`

If a name is unclear, any filename is still fine — the image itself tells me most of it.

## What is most useful (in priority order)

1. **A list/detail screen** (how rows carry metadata, spacing rhythm, separators).
2. **A finance/ledger or numbers screen** (how amounts, totals and currencies are set).
3. **An empty state** (copy, illustration discipline, single action).
4. **An onboarding flow** (how few screens, what they ask, how they finish).
5. **A nav/shell screen** (tab bar or floating nav treatment, safe areas).

Include the **full screen with the app chrome** where possible, and both **light and dark** if you have them — the chrome is where a lot of the craft lives.

## What I do with them

- Extract the **system rules**: hierarchy order, spacing rhythm, row heights, type-scale ratios, colour roles, corner radii, elevation/shadow treatment, motion cues described in the flow.
- Map those rules onto our tokens (`src/index.css`) and components, then show **before/after screenshots in both themes** plus **5/10/20px Squint Test** artifacts (doc 24 §9.4) so the judgement is visible rather than asserted.
- Log anything I cannot infer from static screens as an open question rather than guessing.

## Current uploads

15 captures uploaded 2026-09-19. Analysis lives in
[`25-REFERENCE-ANALYSIS-PASS-1.md`](../25-REFERENCE-ANALYSIS-PASS-1.md).

**Analysed in pass 1 (5):**
`SCR-20260919-nmzu.png` (Dashboard · iOS · Most popular — Plum, Peloton, Bing, Badoo, Lifesum) ·
`SCR-20260919-nnxv.png` (Dashboard · Web · Trending — MacroFactor, Future Pro, Box Box Club, Lloyds) ·
`SCR-20260919-nogp.png` (Account Setup · Most popular — Headspace, Gemini, Revolut, Buddy, Spotify) ·
`SCR-20260919-nokg.png` (Account Setup · Trending — Bumble, Shop, MacroFactor, Lifesum) ·
`SCR-20260919-nopw.png` (Splash Screen · Most popular — Duolingo, Wise, Revolut, Airbnb)

**Queued for pass 2 (10):** `notw`, `npao`, `npdx`, `npgu`, `npmr`, `nppn`, `npwr`, `npzr`, `nqiw`, `nqmx`.

Pass 1 extracted 15 rules (row grammar, parent-row aggregates, state-by-shape for `CM-18`, `done of expected` for
`UX-AI-08`, chip-not-tint status, docked primary action, rhythm-over-rules density, explain-the-number
disclosure) and found that **radius, spacing and elevation are not tokenised at all** (`UX-DS-06`), which makes
that scale a prerequisite of the W-D1b migration.

### Reading note (limits, so nothing is over-claimed)

The image reader has a **cumulative per-session media budget**. Originals here are 0.4–1.8 MB; the first three
reads succeeded, then everything ≥1.4 MB was declined, and once ~6 MB had been read even a 215 KB re-encode was
declined. So the cap is cumulative, not per-file — it is why pass 1 covers 5 of 15 and why pass 2 picks up the
rest. Downscaled previews can be generated with:

```bash
node scripts/design/prepare-reference-previews.mjs            # 1500px wide -> /tmp/anchor-ref-previews
node scripts/design/prepare-reference-previews.mjs --width 900 --force
```

No re-upload is needed for pass 2; the files are already on the server.
