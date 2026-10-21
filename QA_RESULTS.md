# Milestone 0.9.0 QA Results

## Automated checks completed

1. `node --check game.js` passes.
2. `node --check world3d.js` passes.
3. Three distinct enemy GLB files are included: Margin Wraith, Ink Stalker, Clockbound Sentinel.
4. Each enemy GLB parses as a valid GLB container with a JSON chunk and named nodes.
5. Renderer loads each enemy variant by key and selects variants based on enemy type.
6. Enemy node animation covers arms, legs, quills, crests, pauldrons, and rune accents.
7. Detail LOD hides decorative mesh nodes at distance.
8. Mobile profile caps pixel ratio at 1.1, disables renderer shadows, and caps rendered particles at 100.
9. Modular kit includes floor, pillars, arch pieces, gate frame, crystal, buttress, altar, and column base.
10. `index.html` labels the game as 3D alpha 0.9.0.
11. All expected game and asset paths exist.
12. ZIP integrity test passes.

## Manual browser tests still required

- Deploy on GitHub Pages and verify Chapter III remains playable with a pre-existing save.
- Confirm GLTFLoader can fetch all three enemy GLBs from the deployed site.
- Fight at least one enemy of each family and confirm the silhouettes and articulation.
- Verify the Author boss warning ring remains visible and combat stays responsive.
- Test desktop at a normal resolution and mobile Safari/Android Chrome; inspect frame rate, camera, touch controls, and memory use.
- Test with a slow connection and confirm the existing renderer fallback remains usable if a model fails to load.

**Scope note:** automated checks here validate syntax, asset structure, wiring, and package integrity. They are not a substitute for an actual GPU/browser performance session. Enemy GLBs are articulated node-rig assets animated at runtime; they are not full skeletal/motion-capture animation sets.
