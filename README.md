# Echoes of the Unwritten — Milestone 0.7.0

**The Living Archive & Art Production Foundation**

A single-player browser action RPG with a 3D world, persistent local progress, class skill trees, equipment, enemy encounters, and a multi-chapter campaign.

## Critical fix: Chapter III transition

Chapter III now unlocks immediately after the Chapter II boss epilogue is continued. The player is moved into the Archive at the End, the `author-arrival` quest becomes active, and the Blind Scribe opening dialogue introduces the next objective. Players who already finished Chapter II in versions 0.5.0 or 0.6.0 are migrated directly into Chapter III on load; they do not need to defeat the Chapter II boss again or restart.

## New in 0.7.0

- Chapter transition helper with automatic progression and existing-save migration.
- Save format version 6; supports older version 1–6 local saves.
- Original skinned GLB hero model at `assets/characters/unwritten_hero.glb`.
- Authored animation clips in the hero GLB: `Idle`, `Run`, `Attack`, `Cast`, `Hit`, and `Death`.
- Runtime GLTFLoader integration. If the asset or loader fails, the procedural 3D hero remains as a fallback.
- Original bespoke Margin Wraith design GLB and a modular ruins kit GLB for pillars, arch sections, a rift frame, floor tile, and crystal cluster.
- `assets/asset-manifest.json`, plus art pipeline notes under `assets/enemies/` and `assets/environment/`.
- Hit and cast animation state hooks, improved mobile render settings retained from prior versions.

## Deploy to GitHub Pages

Upload the following to the root of your existing repository, preserving the `assets/` folder hierarchy:

- `index.html`
- `styles.css`
- `game.js`
- `world3d.js`
- `README.md`, `QA_RESULTS.md`, `ART_BIBLE.md`
- `assets/asset-manifest.json`
- `assets/characters/unwritten_hero.glb`
- `assets/enemies/margin_wraith_design.glb` and its README
- `assets/environment/modular_ruins_kit.glb` and its README

Three.js and GLTFLoader are loaded from jsDelivr. An internet connection is required for the 3D renderer and model loader. The game retains its procedural renderer fallback if WebGL, the loader, or the hero GLB fails. Browser save data remains local to the device/browser.

## Existing-save update

Do not clear Safari/Chrome website data. The migration reads `echoes_unwritten_save_v1`, upgrades the serialized save to version 6, and detects a completed Chapter II save (`cityBossDefeated` with a Chapter II quest state) to unlock Chapter III automatically.

## Chapter III walkthrough

1. Finish Chapter II and defeat Tomorrow's Witness.
2. Continue past the boss epilogue; Chapter III begins automatically.
3. If Chapter II was already complete before this update, reload the game and your save should be moved to the Archive at the End.
4. Find the Blind Scribe near the starting point and accept the three-sigil quest.
5. Recover the three author sigils, return to the Scribe, enter the Name Vault, and defeat the Unwritten Author.

## Controls

- **WASD / arrow keys:** move
- **Space / Attack:** basic attack
- **Q / E / R:** class abilities
- **F / Enter:** interact
- **Touch:** virtual joystick and mobile action buttons
- **Mouse/tap:** target and navigation interactions where supported

## Art-production status

The hero GLB is an original generated low-poly skinned asset with a named skeleton and animation clips. The enemy and environment GLBs are original design/kit assets for the production pipeline; the live enemy visuals and large environment dressing still use the existing procedural renderer in this milestone. This is a step toward a production art pipeline, not a claim that the project already has AAA-scale content or motion-captured animation.
