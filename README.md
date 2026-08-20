# Silvercal Screeners Oscar League — Mobile-First Rebuild

## Files
- `index.html` — page structure
- `styles.css` — mobile-first visual design
- `script.js` — feature toggles, Google Sheet loading, standings rendering
- `assets/oscar-doctor.png` — trophy image used in the hero

## Most common edits
1. Change developer-only visibility controls at the top of `script.js`.
2. Change the Google Sheet ID/GID in `CONFIG` at the top of `script.js`.
3. Fine-tune the title position over the trophy chest in `styles.css`:
   - `.hero-copy { margin-top: ... }`
   - `.hero-trophy { top: ...; object-position: ... }`
4. Change Oscar Night date in `CONFIG.oscarNightDate`.

## Local preview
Open `index.html` directly, or serve the folder with a basic local web server.
