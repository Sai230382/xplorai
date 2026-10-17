# Legacy front page (archived)

The pre-V4 front page, kept intact so Academy, Playbook and the scroll "reel" can come back later.

- `LegacyApp.tsx` + `legacy.css` — the full previous app (reel hero, Brief, Academy bookshelf, Tools, Playbook, Shipped).
- Static Academy / Playbook / Library pages live in `/archive/public/` (outside `public/`, so they are not deployed).

To restore: point `src/main.tsx` at `./legacy/LegacyApp` and `./legacy/legacy.css`, move the folders in
`archive/public/` back into `public/`, and re-add the `/academy` and `/playbook` redirects in `netlify.toml`.
