# Real-device profiling — build 1.2.0

Open the deployed game on the actual phone/tablet/desktop you want to profile, play for at least 60 seconds including combat and a busy area, then run `window.Echoes3D.downloadDeviceReport()` in that browser console where available. It downloads `echoes-device-profile.json` with device/browser identifiers, WebGL capabilities, renderer memory, draw calls, triangles, current FPS/frame time, texture count and loaded asset status.

For mobile browsers that do not expose a convenient console, use remote debugging from a desktop browser or temporarily add a developer-only button that calls the same method. Repeat after a cold reload and while combat effects are active. Compare median FPS/frame time and note thermal throttling after 5–10 minutes. This build provides instrumentation; no physical phone/tablet is attached to this build environment, so the report must be captured on the actual target device rather than represented as already measured.

## Material maps
The `assets/materials/` folder contains original 1024×1024 albedo, tangent-space normal, roughness, and metalness maps. They are applied to supported standard/physical materials on loaded hero/enemy meshes. The current material set is a shared stylized obsidian/stone PBR set, not a bespoke texture atlas for every armor piece and creature.

## Rigging status
The player GLB remains the existing skinned/animated hero asset. Enemy GLBs in this source release are articulated named-node models with runtime node animation; they are **not all skeletal-skinned meshes with authored animation clips**. This is explicitly recorded rather than mislabeling node animation as a full skeletal rig. Full bespoke skeletal enemy rigs require replacement/re-authoring of the actual GLB geometry, skin weights, skeletons, and clips.
