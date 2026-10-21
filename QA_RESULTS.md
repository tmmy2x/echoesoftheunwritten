# Milestone 0.8.0 QA Results

## Completed checks

1. `game.js` passes `node --check`.
2. `world3d.js` passes `node --check`.
3. Chapter III archive material references are defined (`archiveGround`, `archiveStone`, `ink`, `rose`).
4. `render()` catches 3D render failures and exposes the 2D canvas fallback instead of leaving the game screen black.
5. `ensureZone()` rebuilds terrain when the active zone changes.
6. The archive zone is selected from the existing save state and seeded with the Blind Scribe, sigils, gate, and enemies.
7. GLTFLoader is loaded before/alongside the renderer using the existing readiness event.
8. Authored enemy GLB is requested from the bundled `assets/enemies/` path.
9. Modular environment GLB is requested from the bundled `assets/environment/` path.
10. Authored modular floor tiles, pillars, arches, crystal clusters, and gate frame are used when the GLB is available.
11. Enemy visuals use the authored GLB template when available and animate hover, scale pulse, palette variation, and quill motion.
12. The existing skinned hero loader retains Idle, Run, Attack, Cast, Hit, and Death clip support.
13. Local save version is migrated to 7 while accepting save envelopes from versions 1–7.
14. GLB container headers and JSON chunks parse successfully.
15. ZIP archive integrity check passes.

## Browser verification status

A live Chromium screenshot attempt in the build environment timed out before producing a screenshot, so full browser interaction is **not certified by this QA run**. Please verify Chapter III in the deployed browser, including moving around the archive, talking to the Blind Scribe, collecting all three sigils, and opening the Name Vault. The Chapter III blank screen cause identified in code was undefined archive materials; those definitions and a renderer recovery path are included here.

## Manual acceptance checklist

- [ ] Load an existing save that has completed Chapter II.
- [ ] Confirm the Archive at the End renders instead of a black screen.
- [ ] Confirm the Blind Scribe, three sigils, enemies, and Name Vault appear.
- [ ] Talk to the Scribe; confirm the sigil quest starts.
- [ ] Collect the three sigils and return to the Scribe.
- [ ] Enter the Name Vault and engage The Unwritten Author.
- [ ] Reload and confirm campaign progress persists.
- [ ] Test desktop controls and mobile touch controls.
