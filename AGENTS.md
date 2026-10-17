# XplorAI — notes for coding agents

The front page (V4) covers four things only: **the Brief, On X, the Tools radar, and Shipped**.

## Publishing content (most changes)

Content is data. A new briefing or pulse should only need these files:

- `src/content/edition.json` — the Brief (stories, the "60 seconds" glance = `columns.changed[0..2]`, editor's note)
- `src/content/xposts.json` — X posts. Add an optional `"take"` (one or two plain sentences) to feature a post with an "Our take" note; posts with a take are shown first, three at most.
- `src/content/radar.json` — Tools radar (`pulse.launches`)
- `src/content/showcase.json` — Shipped builds (the first post with a `preview` image is the large one)

## Code layout

- `src/App.tsx` + `src/v4/*` + `src/styles.css` — the live V4 page. Edit these for layout or style changes.
- `src/legacy/` — the previous front page (reel hero, Academy, Playbook). **Archived; not rendered. Do not edit for live changes.**
- `archive/public/` — static Academy, Playbook and Library pages, kept for later and not deployed.
- `public/tools/` — the standalone "/tools" radar page.

Design rules: one painting per section, Newsreader + Archivo only, body text at least 14px, no boxes inside boxes.
