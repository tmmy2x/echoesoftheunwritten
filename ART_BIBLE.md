# Echoes of the Unwritten — Art Bible 0.9.0

## Visual identity

- **Silhouette:** tall, asymmetric, layered forms; negative space between appendages; readable at small screen sizes.
- **Palette:** ink-black and bruised violet foundations; memory cyan for neutral/old magic; author rose for corruption; muted gold for ancient machinery.
- **Materials:** matte obsidian, worn archive stone, satin metal, emissive inlays; emissive surfaces are accents rather than full-surface glow.
- **World language:** fractured flagstones, monumental arches, suspended crystals, rune altars, repeated vertical pillars, and broken buttresses.

## Enemy families

- **Margin Wraith:** floating page-haunt with mantle, mask, six quills, and long arms. Default low-tier enemy.
- **Ink Stalker:** lean hunter with blade arms, long legs, mask, and a cyan crest. Used for wraith/redaction variants.
- **Clockbound Sentinel:** heavier elite with chest plate, crest, rune nodes, armored shoulders, and gold/rose accents.
- **The Unwritten Author:** boss treatment remains larger and rose-corrupted; its warning telegraph must remain visible and readable.

## Animation language

Enemy animation is procedural node articulation: alternating limb swings, quill/crown sway, hover bob, hit scale response, and telegraph rings. The hero retains a skinned GLB and named Idle/Run/Attack/Cast/Hit/Death clips when available. This milestone does not claim motion capture or film-quality animation.

## Modular environment

Reuse named kit modules: Archive_Floor_Tile, Pillar_Shaft, Pillar_Capital, Fractured_Arch_Left, Fractured_Arch_Right, Fractured_Arch_Lintel, Rift_Gate_Frame, Cyan_Crystal_Cluster_Core, Broken_Buttress, Rune_Altar, Archive_Column_Base. Avoid random placement that blocks objective routes or player navigation.

## Performance rules

- Desktop: antialiasing and shadows enabled where supported; pixel ratio capped at 1.6.
- Mobile: antialiasing/shadows disabled; pixel ratio capped at 1.1; fewer particles; hide decorative details beyond the near LOD radius.
- Prefer shared geometries and cloned materials over cloning geometry for every module.
- Always preserve readable quest markers and enemy telegraphs even when decorative LOD is hidden.
