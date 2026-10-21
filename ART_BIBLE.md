# Echoes of the Unwritten — Art Bible (Milestone 0.8.0)

## Visual pillars

- **Fractured mythic fantasy:** monumental architecture that feels like a memory reconstructed from incomplete evidence.
- **Ink versus luminous seams:** ink-black layered silhouettes contrast with pale cyan, violet, and rose-red magical accents.
- **Readable combat:** clear silhouettes, restrained bloom, strong hit flashes, and red telegraphs before dangerous boss attacks.
- **A authored world, not random clutter:** modular stone and crystal pieces repeat with intentional composition, landmark framing, and negative space.

## Hero — Riven, the Unwritten

The hero's bundled GLB is the primary player character. It contains a skinned mesh and a named skeleton, with Idle, Run, Attack, Cast, Hit, and Death animation clips. The current third-person action camera and class-colored aura support readability. Long-term art target: bespoke class variants, secondary motion for cloak and equipment, facial/helmet variants, and dedicated class attack clips.

## Enemy family — Margin Wraith

`assets/enemies/margin_wraith_design.glb` is the authored runtime enemy visual. It uses an ink mantle, a luminous core, and quill-like side forms. Runtime variants apply rose/cyan palette shifts, size classes, hovering, idle pulse, and quill motion. Current rigging limitation: this model is not a full skeletal creature rig; it is animated through scene-node transforms. A future production art pass should provide a skinned wraith rig with locomotion, telegraph, attack, hit-react, stagger, and death clips, plus separate Clockwraith and Redaction Knight silhouettes.

## Environment kit

`assets/environment/modular_ruins_kit.glb` includes named modules:

- `Pillar_Shaft`
- `Pillar_Capital`
- `Fractured_Arch_Left`
- `Fractured_Arch_Right`
- `Fractured_Arch_Lintel`
- `Rift_Gate_Frame`
- `Archive_Floor_Tile`
- `Cyan_Crystal_Cluster_Core`

These are now used by the runtime environment builder where assets are available. The scene composition changes per region through palette, fog, lighting, module placement, and landmarks.

## Chapter III — The Archive at the End

- Palette: ink-plum, muted burgundy, rose-red author corruption, and restrained gold.
- Landmarks: towering archival stacks, broken arches, floating crystalline fragments, the Scribe's approach, and a visually distinct Name Vault gate.
- Player navigation: keep sightlines readable; objectives and enemies must remain visible against dark scenery.

## Production-quality roadmap

The current assets are original project assets and are not being represented as AAA-ready commercial art. The next art iterations should add high-poly sculpt-to-game meshes, authored PBR texture sets, rigged enemy variants, dedicated animation clips, LODs, collision meshes, and a larger modular environment library. Preserve the current art direction and silhouette language across those replacements.
