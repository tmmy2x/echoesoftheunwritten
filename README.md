# Echoes of the Unwritten — Milestone 0.9.0

**The Art Foundry: dedicated enemy variants, animated node rigs, modular environment polish, and mobile LOD/performance controls.**

This is a browser-based single-player action RPG alpha. It builds on the Chapter III renderer fix from 0.8.0.

## Install on GitHub Pages

1. Back up your repository files.
2. Extract this ZIP.
3. Replace `index.html`, `styles.css`, `game.js`, and `world3d.js` at the repository root.
4. Upload the entire `assets/` folder, preserving paths.
5. Commit the changes and wait for Pages to deploy.
6. Keep your existing browser storage; do not clear your save.

## New in 0.9.0

- Separate authored GLB designs for Margin Wraith, Ink Stalker, and Clockbound Sentinel enemy families.
- Runtime articulated node animation for enemy limbs, quills, crests, runes, and armor accents.
- Authored modular ruins kit expanded with broken buttresses, rune altar, and archive column base.
- Distance-based detail LOD hides decorative mesh parts when far from the player.
- Mobile quality profile caps device pixel ratio, disables realtime shadows, and limits active particle rendering.
- Existing authored hero rig and animation clips remain integrated.

## Controls

- WASD / arrow keys: move.
- Click/tap: target or navigate, depending on context.
- Space / Attack: basic attack.
- Q / E / R: active class skills.
- Touch controls are shown on narrow/mobile screens.

## Asset and browser notes

The included GLB files are original stylized low-poly assets created for this project, not third-party marketplace downloads. The player model has a skinned rig and clips; the enemy variants use authored named scene nodes with runtime articulation, not motion-capture or full skeletal animation clips. Three.js and GLTFLoader are loaded from a CDN, so first load requires an internet connection.

## Test checklist

See `QA_RESULTS.md`. Validate on a desktop browser and a real mobile browser; automated static checks cannot guarantee GPU/browser behavior across devices.
