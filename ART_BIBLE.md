# Echoes of the Unwritten — Art & UI Bible 1.0.0

## Visual thesis
A dark, surreal fantasy with fractured stone, ink-black silhouettes, cyan and violet anomaly light, rose-red reality corruption, and restrained parchment-gold interface accents. Readability and silhouette clarity take priority over visual noise.

## HUD direction
Original interface inspired by the information hierarchy of large-scale MMORPGs: compact character vitals and tracked quest on the left, target/location readout near the upper center, field intel/minimap on the right, and a centered action hotbar along the bottom. Use translucent dark glass panels, fine gold/cyan borders, small monospaced labels, and high-contrast health/essence bars. The world remains full-screen behind the interface; no major gameplay region is reserved for side columns.

## Character / enemy silhouette rules
- Unwritten hero: narrow, angular cloak silhouette, cyan weapon accents and class-dependent aura.
- Margin Wraith: floating ink mantle, rose quills, unstable hover.
- Ink Stalker: lean silhouette, cyan crest and blade-like arms; faster enemy identity.
- Clockbound Sentinel: heavier armor, gold runes, wider stance and slow, readable attacks.
- The Unwritten Author: oversized layered silhouette, orbiting quills, rose core and clearly telegraphed reality-correction attack.

## Environment kit
Broken archive arches, modular pillars, fractured floor tiles, rune altars, rift frames and luminous crystal clusters. Keep navigation lanes readable and avoid placing high-contrast decorative clutter on combat surfaces.

## Animation language
Movement has clear anticipation and follow-through; attacks use short wind-up and recoil; hit reactions should be readable but not obscure the target; boss attacks have a visible warning phase before impact. Existing hero GLB uses named animation clips. Enemy art currently combines bespoke meshes with procedural scene-node articulation; future production should add full skeletal rigs and dedicated attack/hit/stagger/death clips.

## Performance constraints
Use distance-based detail reduction, shared geometry/materials where possible, limited particle counts, lower mobile pixel ratio and reduced mobile shadows. Validate real frame times on physical devices before declaring a performance target met.
