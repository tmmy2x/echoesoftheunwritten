# Echoes of the Unwritten — Milestone 0.8.0

**The Living Archive: Chapter III renderer recovery + authored asset integration**

A browser-based single-player action RPG prototype. This build fixes the Chapter III black-screen failure and moves runtime enemy/environment rendering to an asset-first pipeline using the included GLB models.

## Install on GitHub Pages

1. Back up your existing repository files.
2. Extract this ZIP.
3. Upload/replace `index.html`, `styles.css`, `game.js`, and `world3d.js` at the repository root.
4. Upload the entire `assets/` folder, preserving its paths.
5. Commit the changes and wait for Pages to deploy.
6. Open the existing site URL. Do **not** clear browser storage; save migration retains existing campaign state.

## Controls

- WASD / arrow keys: move.
- Click/tap: target or navigate, depending on context.
- Space / Attack: basic attack.
- Q / E / R: class skills.
- E or the on-screen interaction button: interact with nearby NPCs, gates, and quest objects.
- Skills, inventory, and class menus are available from the combat bar.

## Chapter III fix

The archive scene previously referenced undefined materials (`archiveGround`, `archiveStone`, and `ink`, as well as the rose accent material). When Chapter III activated, the 3D terrain builder threw while creating the new zone. The undefined archive materials are now explicitly defined. A render-error recovery path also reveals the 2D canvas if WebGL rendering throws, instead of leaving a blank black canvas.

## Art and runtime pipeline

- `assets/characters/unwritten_hero.glb`: skinned hero with Idle, Run, Attack, Cast, Hit, and Death clips.
- `assets/enemies/margin_wraith_design.glb`: authored enemy model used as the preferred runtime enemy visual. Enemy variants receive zone/class palette treatment, scale variation, hovering, and quill motion.
- `assets/environment/modular_ruins_kit.glb`: authored floor tiles, pillar modules, arch pieces, rift gate frame, and crystal cluster used by the environment builder.
- If the GLTF loader or a local asset request fails, a lightweight primitive fallback remains available so the game remains playable.

Three.js and GLTFLoader are loaded from jsDelivr in `index.html`; an internet connection is required for those libraries. The GLB assets themselves are bundled locally in `assets/`.

## Save data

The game uses `localStorage` key `echoes_unwritten_save_v1`. Version 7 preserves the existing campaign state and migrates older save envelopes. Do not clear browser site data during an update.

## Honest scope note

This is an evolving 3D alpha, not a finished AAA production. The included hero is rigged and has authored animation clips. The included enemy and modular environment GLBs are original authored assets; the enemy has animated runtime motion but is not yet a full skinned/mocap creature rig. Future milestones can replace/augment the current enemy family with dedicated rigged variants and add more bespoke environment packs.
