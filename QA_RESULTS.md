# QA Results — Milestone 1.1.0: The Grand Spires

## Automated checks
- [x] index.html
- [x] styles.css
- [x] game.js
- [x] world3d.js
- [x] assets/asset-manifest.json
- [x] assets/characters/unwritten_hero.glb
- [x] assets/enemies/clockbound_sentinel.glb
- [x] assets/enemies/ink_stalker.glb
- [x] assets/enemies/margin_wraith_design.glb
- [x] assets/environment/modular_ruins_kit.glb
- [x] GLB module Grand_Spire_mesh
- [x] GLB module Ornate_Arch_mesh
- [x] GLB module Rune_Obelisk_mesh
- [x] GLB module Floating_Stone_mesh
- [x] GLB module Banner_Stand_mesh
- [x] GLB module Grand_Staircase_mesh
- [x] GLB module Archive_Floor_Tile_mesh

- Environment GLB parses as a scene with 17 named mesh modules.
- Environment GLB size: 137 KB.
- JavaScript syntax checked with Node.js (`node --check`) for `game.js` and `world3d.js`.
- Existing game logic and local-save key preserved.
- Visual playtest: not performed in a real browser in this build environment. Validate the world in GitHub Pages after deployment, especially mobile performance and landmark placement.


## 1.2.0 additions
- Generated and included 1024x1024 PBR albedo, tangent normal, roughness and metalness maps.
- Added runtime application to loaded hero/enemy standard materials.
- Added `window.Echoes3D.getDeviceReport()` and `window.Echoes3D.downloadDeviceReport()` diagnostics.
- Device profiling instrumentation is present, but real-device measurements are not claimed because no physical target device was available in the build environment.
- Enemy assets still use articulated node rigs, not full skinned skeletal rigs; see `DEVICE_PROFILING.md`.
