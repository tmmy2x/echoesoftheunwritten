# Echoes of the Unwritten — 3D Alpha 0.5.0

Milestone 0.5.0 converts the existing browser RPG from a flat 2D scene into an original, procedural 3D world while preserving the established quest/combat/save systems.

## Included
- Third-person, elevated 3D camera that follows the player.
- Original procedural low-poly hero, class-tinted aura, sword, cloak, NPC, shards, gates, chests, wisps, wraiths, and boss models.
- Two procedural 3D zones: The Shiverwild Verge and The City That Forgot Tomorrow.
- Ruins, fractured flagstones, glowing crystals, paths, pillars, atmospheric fog, colored lights, animated portals, hit flashes, and spell particles.
- Existing movement, target selection, combat abilities, quests, class trees, equipment, minimap, dialogue, and local saves remain driven by the original game logic.
- Responsive rendering and a fallback to the existing 2D renderer if the Three.js CDN cannot load.

## Run locally
Because the 3D renderer uses Three.js from jsDelivr, run the project with an internet connection. Open `index.html` directly for a quick test, or preferably serve the folder with a local web server:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages
1. Extract this ZIP.
2. Upload `index.html`, `styles.css`, `game.js`, `world3d.js`, `README.md`, and `QA_RESULTS.md` to the repository root.
3. Commit to the configured Pages branch.
4. Open the published site. Keep internet access available so the Three.js library can load.

## Controls
- **WASD / Arrow keys:** move.
- **Click/tap:** set destination or select a nearby target/object.
- **Space / Attack button:** basic attack.
- **Q / E / R:** class abilities.
- **F / Enter / mobile F button:** interact.
- **Tab:** cycle target.
- **I:** inventory; **K:** skills; **Esc:** close modal.
- Mobile joystick and touch action buttons remain available.

## Save compatibility
The build retains the existing localStorage key `echoes_unwritten_save_v1` and version 4 save format. Do not clear site data when upgrading. Browser-local saves do not automatically synchronize across devices.

## Technical notes
The 3D environment is generated from primitive meshes and materials at runtime; no external models or textures are required. Three.js itself is loaded from a CDN. Existing gameplay logic remains in `game.js`; `world3d.js` renders the same world-state data as 3D meshes. The transparent legacy canvas remains present to preserve existing pointer/input behavior and the minimap logic.

This is a 3D alpha milestone, not a final AAA asset pass. Geometry is stylized low-poly and procedural; production-grade rigged animation, authored character models, audio, cloud persistence, and server-authoritative timed events remain future milestones.
