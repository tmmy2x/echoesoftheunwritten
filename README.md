# Echoes of the Unwritten — Milestone 0.6.0

**The Author's Name · Living Archive update**

A single-player browser action RPG with a 3D world, persistent local progress, class skill trees, equipment, enemy encounters, and a multi-chapter campaign.

## New in 0.6.0

- Chapter III: **The Author's Name** with the Archive at the End, the Blind Scribe, three author sigils, the Name Vault, and the Unwritten Author boss.
- A new distinct archive biome with crimson ink fissures, fractured script spires, floating glyph shards, and rose-colored rift lighting.
- A more expressive player model with articulated limbs, locomotion gait, and attack-driven sword movement.
- More distinctive redaction enemies and a bespoke multi-layered Author boss silhouette.
- The Author's reality-correction attack telegraphs a red danger ring before impact; the player must evade it.
- Save migration to version 5; existing version 1–5 saves are supported and Chapter I/II progress is preserved.
- Author sigil collection, quest navigation, rewards, and the next story state are persisted locally.

## Deploy to GitHub Pages

Upload these files to the root of your existing repository and commit them:

- `index.html`
- `styles.css`
- `game.js`
- `world3d.js`
- `README.md`
- `QA_RESULTS.md`

The Three.js renderer is loaded from jsDelivr at runtime. An internet connection is required for the 3D renderer; the game retains its 2D fallback if WebGL or the library is unavailable. Browser save data stays in local storage on the device/browser used to play.

## Existing-save update

Do not clear Safari/Chrome website data. The migration reads the existing `echoes_unwritten_save_v1` key and upgrades the serialized save to version 5.

## Chapter III walkthrough

1. Finish Chapter II and defeat Tomorrow's Witness.
2. Return to the Clockmaker and interact again after the `A Tomorrow Reclaimed` quest appears.
3. Follow the new objective to the Blind Scribe in the Archive at the End.
4. Accept the quest and collect all three author sigils.
5. Return to the Blind Scribe to open the Name Vault objective.
6. Interact with the Name Vault, then defeat the Unwritten Author. Watch for the red danger ring and move out of it before the correction detonates.

## Controls

- **WASD / arrow keys:** move
- **Space / Attack:** basic attack
- **Q / E / R:** class abilities
- **F / E interaction:** interact with nearby quest objects
- **Touch:** virtual joystick and mobile action buttons
- **Mouse/tap:** target and navigation interactions where supported

## Art and asset direction

The 3D art in this milestone uses original procedural meshes and materials authored in `world3d.js`, including a more articulated character silhouette, enemy variations, bespoke zone dressing, and boss telegraphs. This is an upgraded 3D alpha foundation, not yet a finished AAA production asset pipeline. Production-quality skinned GLB characters, authored animation clips, and external environment packs remain a deliberate next art-production stage; no third-party model assets are silently substituted into this build.
