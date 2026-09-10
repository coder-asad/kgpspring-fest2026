# FEST 2026 — Digital Pass & Ticket Generator

Fresher's Selection Task submission for KodeinKGP (Tech Team).

A frontend-only, multi-step ticket generator built with plain HTML, CSS and JavaScript
(no frameworks, no build step). Users enter their details, pick artists, food, games and
a pass tier, review a live price breakdown, and get a generated digital ticket with a
unique ticket ID and QR code. Generated tickets are saved locally via `localStorage`
and browsable on the "My Passes" tab. Includes a dark mode toggle and a print/PDF
download button for the ticket.

## Files
- `index.html` — page structure, 3 tabs (Home / Generate Ticket / My Passes)
- `style.css` — all styling
- `script.js` — app data, wizard logic, price calculation, ticket generation, localStorage

## Running locally
No build tools needed — just open `index.html` in a browser, or serve the folder with
any static server (e.g. `npx serve` or the VS Code "Live Server" extension).

## Deploying (Netlify / Vercel)
1. Push this folder to a GitHub repository.
2. On Netlify or Vercel, create a new site/project and link the repo.
3. Framework preset: "Other" / static site. Build command: none. Publish directory: `/` (root).
4. Deploy — you'll get a live link to submit alongside the GitHub repo link.

## Notes
- Artist/food/game/pass data is stored as plain JS arrays in `script.js` — edit those
  to change names/prices.
- The QR code is generated via a free public API (qrserver.com) encoding the ticket ID —
  no library/dependency needed.
- "My Passes" and the generated tickets persist only in the browser's localStorage, so
  they're per-device and will be lost if browser storage is cleared.
