# Echoes of the Unwritten — Visual Development Bible

## Visual thesis

A dark fantasy world where reality is physically edited. The art direction pairs monumental, readable silhouettes with restrained luminous accents: cyan for memory, violet for fractured space, gold for recovered truth, and rose-red for hostile authorship. Environments should communicate quest state through landmarks and light, not UI alone.

## Player: Riven, the Unwritten

- **Silhouette:** compact agile spellblade with a high broken hood, split cloak, asymmetrical shoulder plates, a narrow luminous visor, and a blade with a cyan seam running through its center.
- **Material language:** weathered gunmetal, dark woven cloth, worn brass, pale skin, and emissive fracture lines.
- **Class variations:** Riftblade uses cyan-violet blade trails; Paradoxist uses crystalline blue-white seams and delayed afterimages; Hollowkeeper gains ghostly teal sigils and orbiting spirit motes; Dawnbreaker gains warm gold accents and a brighter protective halo.
- **Animation targets for the production rig:** idle breath, walk/run cycles, turn-in-place, start/stop foot plants, basic combo, Q/E/R ability clips, dodge, hit-react, stagger, victory, and defeat. Root motion should be disabled in the browser game; movement remains game-state driven.

## Enemy family: Margin Wraiths

- **Silhouette:** tall narrow torso, torn page-like mantle, floating lower body, asymmetrical quills, and a face that reads as a blank mask with two warm pinprick eyes.
- **Behavior read:** a slow hover before pursuit, a sharp forward lunge before contact, and a page-shear burst when defeated.
- **Material:** ink-black cloth, desaturated bone, rose-red edge light, thin emissive glyph seams.

## Chapter III boss: The Unwritten Author

- **Silhouette:** a hovering robed figure whose mantle resembles torn manuscript leaves; eight quills orbit the torso; a cracked halo frames a bright rose core; fragments of gold script circle the body.
- **Arena language:** the Name Vault is a circular stone archive with broken shelves suspended in the air, red correction marks in the floor, and a central empty lectern.
- **Attack telegraph:** a rose-red ground ring appears before a reality correction. The ring must be readable at mobile size and leave a generous dodge window. Below 50% health, the attack cadence increases.
- **Phase goals:** Phase I pursues and tests melee spacing. Phase II accelerates corrections and mixes contact pressure with telegraphed area denial. A future asset pass should add dedicated wind-up, cast, impact, recovery, and stagger clips.

## Chapter III environment: The Archive at the End

- Broken shelves and script spires form a navigable silhouette skyline.
- Rose-red fissures indicate authored/hostile space; gold shards indicate the three quest sigils; cyan remains associated with memories and safe navigation.
- Landmarks should be spaced to aid orientation on a small screen. The Name Vault is the dominant far landmark, with a visible rose halo.

## Production asset standard for the next art pass

The current milestone uses custom procedural geometry so the game remains lightweight and does not silently depend on unverified third-party models. For a true AAA-style visual step, replace key placeholder meshes with authored or properly licensed GLB assets:

- `riven_base.glb` — skinned player rig with four material/armor variants and named animation clips.
- `margin_wraith.glb` — skinned common enemy with hover/lunge/death clips.
- `redaction_knight.glb` — elite enemy with a weapon and guard-break animation.
- `unwritten_author.glb` — bespoke multi-part boss with orbiting quills and separate core/halo meshes.
- `shiverwild_environment.glb` — modular ruins, rocks, foliage, and path kit.
- `forgotten_city_environment.glb` — modular time-locked architecture kit.
- `name_vault_environment.glb` — boss arena, floating archive shelves, and rune props.

Each imported asset must have a recorded source, license, polygon/texture budget, rig/clip naming contract, fallback mesh, and mobile performance check. Prefer original commissioned models or clearly licensed packs; do not ship assets whose redistribution rights are unclear.
