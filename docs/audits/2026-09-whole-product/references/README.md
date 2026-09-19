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