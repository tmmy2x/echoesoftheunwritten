# Echoes of the Unwritten — Milestone 0.1.0

A playable, browser-based, single-player action RPG prototype. No build tools or server are required for the current milestone.

## Play locally

1. Extract the ZIP (if using the packaged download).
2. Open `index.html` in a modern browser.
3. On mobile, open the deployed page in Safari/Chrome. The touch joystick and action buttons appear on narrow screens.

The game uses a local browser save (`localStorage`). Your save is tied to the browser and device; it is not yet a cloud account save.

## Controls

- **WASD / arrow keys:** move
- **Space / Attack button:** basic attack
- **Q:** Rift Cut — area damage
- **E:** Phase Step — dash and brief invulnerability
- **R:** Paradox — heavy area damage and self-heal
- **F / Enter:** interact with nearby NPCs, echoes, caches, and gates
- **Tab:** target nearest anomaly
- **I:** inventory
- **K:** skills panel
- **Escape:** close modal
- **Mobile:** drag the left joystick; use the right-side action buttons

## Current playable systems

- Camera-following top-down world with ruins, fissures, paths, landmarks, and a minimap panel
- Hybrid target-assisted real-time combat
- Enemy patrol/aggro, contact damage, target selection, health bars, hit effects, and respawn recovery
- XP, leveling, HP/essence regeneration, shards, loot, equipment, and basic gear score
- Three active abilities with costs and cooldowns
- Intro dialogue, quest objective, three collectible echoes, reward turn-in, gate progression, and a boss encounter
- Daily rotating event text, local time display, activity log, and local save/load
- Responsive desktop/mobile UI

## Known scope limits in this milestone

- This is a vertical-slice prototype, not yet a full-length MMORPG-scale RPG.
- The daily event is a local rotation, not a server-authoritative event that synchronizes across all players.
- There are no online accounts, cloud saves, analytics, multiplayer, server-side anti-cheat, or live content delivery yet.
- Art is procedurally drawn with Canvas primitives; production art, sound, animation, accessibility passes, and broad browser testing are future milestones.
- The class selection screen, full skill trees, crafting loop, large multi-region campaign, and endgame systems are not implemented yet.

## Deploy to GitHub Pages

1. Create a GitHub repository (or use a repository dedicated to this game).
2. Upload `index.html`, `styles.css`, `game.js`, and `README.md` to the repository root. Keep the filenames exactly as shown.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. Wait for the Pages deployment to finish and open the URL GitHub provides.

No npm install or compilation is required. The game is a static site. Google Fonts are used when online; fallback system fonts work offline.

## Suggested next milestone

**Milestone 0.2 — Core RPG depth:** implement class selection and class-specific ability variants, gear slots and stat recalculation, a real quest journal, persistent enemy/boss completion state, additional dungeon rooms, and automated smoke tests for desktop/mobile input and save recovery.
