# Echoes of the Unwritten — Milestone 1.0.0

**The First Dawn: immersive fullscreen MMORPG-inspired HUD, adaptive 3D rendering, and Chapter IV.**

Browser-based single-player action RPG, deployable as a static site on GitHub Pages.

## Install / update
1. Back up your repository files.
2. Extract this package.
3. Replace `index.html`, `styles.css`, `game.js`, and `world3d.js` in the repository root.
4. Upload the complete `assets/` folder, preserving paths.
5. Commit and wait for GitHub Pages to deploy.
6. Keep browser storage. Version 8 saves migrate earlier progress, including existing completed Chapter III saves.

## What's new in 1.0.0
- Full-viewport 3D world with translucent overlay HUD; game UI no longer lives in separate page columns.
- Original HUD design direction combining compact MMO-style hotbars, character/quest panels, target health, minimap and field intel.
- Responsive desktop/mobile layout, touch controls, safe-area handling and reduced-motion support.
- Adaptive mobile render pixel ratio based on observed frame cost; exposes `window.Echoes3D.performanceStats` for live FPS, frame cost, draw calls, triangles, quality tier, loaded enemy variants and environment-kit status.
- Enemy hit/strike reaction accents and distance-based decorative detail LOD.
- Chapter IV: **The First Dawn**. After the Chapter III epilogue, recover three first-light fragments and return to the Blind Scribe for the next story reveal and rewards.
- Save version 8 and migration of saves that had already completed Chapter III before this update.

## Controls
- PC: WASD / arrows to move; click to target or navigate; Space/basic attack; Q/E/R class skills; E or interact control for nearby NPCs and objects.
- Mobile: left virtual joystick and right action buttons; HUD is overlaid on the game view.

## Runtime / asset notes
Three.js and GLTFLoader are loaded from jsDelivr. The browser needs internet access on first load. The hero GLB has a skinned rig and animation clips. Enemy GLBs are bespoke authored designs with runtime node articulation and hit/strike pose accents; they are not yet full skeletal animation rigs with motion-captured clips. Mobile adaptive quality is implemented, but measured frame-rate acceptance still needs testing on representative physical devices.

## Validation
See `QA_RESULTS.md`. Syntax, bundled asset structure, save migration markers, HUD overlay rules, chapter progression markers and package integrity are checked statically. Static checks do not replace live gameplay verification.


## Milestone 1.1.0 — The Grand Spires
This release focuses on a substantial environmental art pass: a rebuilt 17-module architectural GLB kit, monumental spires, ornate arches, rune obelisks, floating stone relics, banner stands, grand stairs, stronger cinematic lighting, and more deliberate MMO-scale silhouettes. Existing story/save logic is preserved.

### Deploy
Replace the files in your GitHub Pages repository with the contents of this folder, preserving the `assets/` directory structure. Keep your browser local save; this release does not require clearing it.

### Honest scope note
The new meshes are original stylized geometry and a significant upgrade over simple blockout scenery, but they are not photogrammetry or a full studio AAA asset pipeline. Dedicated skeletal enemy rigs, high-end PBR texture maps, and real-device profiling remain future production work.


## Build 1.2.0: PBR & profiling
Includes original 1K albedo, normal, roughness and metalness maps applied to supported hero/enemy materials, plus device diagnostics (`window.Echoes3D.downloadDeviceReport()`). See `DEVICE_PROFILING.md` for profiling steps and explicit asset/rig status.
