# QA Results — Milestone 0.7.0

## Automated/static checks performed

- `game.js` passes `node --check`.
- `world3d.js` passes `node --check`.
- All delivered GLB files have valid GLB 2.0 headers and can be parsed by the local glTF/trimesh parser.
- The hero GLB contains a skin, named skeleton joints, and six animation clips: Idle, Run, Attack, Cast, Hit, Death.
- The modular ruins GLB exposes eight named modular meshes/nodes.
- The Chapter II boss epilogue calls the Chapter III unlock helper.
- The save migration detects old saves with `cityBossDefeated` and a Chapter II quest and moves them into `author-arrival` in `author-archive`.
- The save writer emits version 6 and migration accepts versions 1–6.
- The GLTFLoader is loaded before `world3d.js`; runtime model load failure retains the procedural character.
- ZIP archive integrity is checked during packaging.

## Browser checks still required

This environment did not run an interactive browser session for this build. Please verify in the deployed browser:

1. Load your existing version 0.6.0 save after Chapter II completion. Expected: the player appears in the Archive at the End with `Chapter III: The Author's Name` active.
2. Defeat Tomorrow's Witness on a save that has not yet completed Chapter II. Continue the boss epilogue. Expected: Chapter III loads without returning to the Clockmaker.
3. Confirm the Blind Scribe is reachable at the new starting point and the quest marker points to the Scribe.
4. Confirm `assets/characters/unwritten_hero.glb` loads and the player animates between Idle/Run/Attack/Cast/Hit. If it does not load, confirm the procedural hero remains visible.
5. Test on both desktop and mobile Safari/Chrome.

## Known limitations

- The art assets are original stylized alpha assets, not AAA-finished or motion-captured production content.
- Enemy and modular environment GLBs are included as bespoke art/kit assets; the current world still uses procedural runtime enemy and environment meshes rather than placing every GLB module into the live scene.
- Three.js and GLTFLoader require network access to the jsDelivr CDN.
