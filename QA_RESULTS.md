# QA Results — Milestone 0.6.0

## Automated static checks

- [x] `game.js` passes `node --check`.
- [x] `world3d.js` passes `node --check`.
- [x] Chapter III quest IDs and handlers are present: `author-arrival`, `author-sigils`, `author-return`, `author-boss`, `author-complete`.
- [x] Save migration accepts versions 1 through 5 and writes version 5.
- [x] Chapter III flags and collected sigils are included in save migration defaults.
- [x] Third zone seeding is wired into the world bootstrap.
- [x] The Name Vault interaction creates the Unwritten Author boss.
- [x] The Author boss defeat grants Chapter III completion, XP, shards, and the First Word relic.
- [x] Boss reality-correction attack has a warning phase and an evasion window.
- [x] The 3D renderer includes archive-zone visuals, author-sigil models, and articulated player animation pivots.
- [x] ZIP integrity check performed after packaging.

## Manual browser checks still required

The build container has no outbound DNS, so the Three.js CDN could not be fetched from this environment. This prevents a truthful claim of live 3D browser verification here. The runtime depends on jsDelivr for Three.js and should be checked in the user's connected browser.

- [ ] Load on desktop browser with internet access and confirm WebGL scene renders.
- [ ] Load on mobile Safari and verify performance/touch controls.
- [ ] Confirm a completed Chapter II save unlocks Chapter III by interacting with the Clockmaker.
- [ ] Collect all three author sigils; verify objective changes to return to the Blind Scribe.
- [ ] Activate the Name Vault and defeat the Unwritten Author.
- [ ] Reload after each major objective and confirm progress persists.
- [ ] Confirm red danger telegraph is visible and the Author's correction can be evaded.

## Known limitations

- Art is procedural geometry; professionally authored skinned GLB models, bespoke motion-captured animation clips, and downloaded production asset packs are not yet included.
- Save data is local to each browser/device; there is no cloud sync or server-backed event service.
