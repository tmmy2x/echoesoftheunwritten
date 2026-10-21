# QA Results — Milestone 1.0.0

## Automated checks performed
- `node --check game.js` — passed.
- `node --check world3d.js` — passed.
- All bundled GLB files have valid glTF 2.0 magic/version/declared length headers — passed.
- Full-screen fixed world canvas and overlay HUD styles are present — passed.
- Responsive mobile HUD and safe-area rules are present — passed.
- Chapter IV unlock, objective tracking, fragment collection and return-to-Scribe quest branches are present — passed.
- Save migration accepts versions 1–8 and writes version 8 — passed.
- Adaptive mobile pixel-ratio logic and runtime performance-stat API are present — passed.
- Existing asset-first GLB pipeline and distance-based detail LOD remain present — passed.
- ZIP integrity — verified at packaging time.

## Manual acceptance checklist
1. On desktop, verify the 3D world fills the viewport and HUD panels sit over the world rather than in surrounding columns.
2. Verify left character/quest panel, right minimap/field intel, top location strip, target bar and bottom combat hotbar remain readable at 1366×768 and 1920×1080.
3. Move and fight while the HUD is visible; confirm controls and click-to-move remain functional where the HUD does not cover the scene.
4. On iPhone Safari, verify safe-area padding, joystick, action buttons, hotbar and panels fit without covering the entire playfield; check portrait and landscape.
5. Load an existing save. A Chapter III-complete save should migrate to Chapter IV: The First Dawn if it had not already started the next quest.
6. Complete the Author epilogue, collect three First-Light Fragments, return to the Blind Scribe and confirm Chapter IV completion/rewards persist after reload.
7. Inspect `window.Echoes3D.performanceStats` in DevTools and record FPS/frame cost on desktop and a real mobile device.
8. Confirm the authored hero/enemy/environment assets load from GitHub Pages paths; CDN or WebGL failures should be noted separately.

## Known limits
- No automated real-device FPS benchmark was available during packaging.
- Enemy variants still use authored GLB meshes with runtime node articulation rather than complete skeletal animation clip libraries.
- Chapter IV is a new quest arc within the Archive zone; the Garden of First Light is teased as future content, not yet a separate explorable zone.
