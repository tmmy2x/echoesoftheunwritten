# Echoes of the Unwritten — Milestone 0.4.0

**The Awakening** · Browser-based single-player RPG alpha

## Retained systems from 0.2.0

- **Responsive movement:** WASD/arrow keys on desktop, a touch joystick on mobile, and click/tap-to-move in the world. Clicking a nearby interactable moves the character into range and triggers the interaction.
- **Live minimap:** player position and facing, enemy locations, interactables, the current quest objective, and a route line update as the world changes.
- **Quest objective tracking:** the tracker follows the current step: meet the Archivist, recover the three echoes, return for the reward, investigate the gate, and confront the Page-Eater. The route updates when objectives change.
- **Quest progression fixes:** echo pickups are gated by quest state; completed objectives correctly lead back to the Archivist; the gate no longer marks the boss defeated when the encounter merely starts; boss defeat now completes the story milestone.
- **World interaction persistence:** recovered echoes and opened chests remain used after reloading this browser. Boss-spawn/defeat flags are saved and restored.
- **Input and UI polish:** improved click/tap movement, objective status text, responsive minimap, keyboard input cleanup when the browser loses focus, and a clearer mobile interaction button.

## Run locally

1. Extract the ZIP.
2. Open `index.html` in a modern browser. If your browser restricts local files, run a local static server from this folder instead:
   - Python: `python -m http.server 8000`
   - Then open `http://localhost:8000`.

No build step or package installation is required.

## Deploy to GitHub Pages

Upload `index.html`, `styles.css`, `game.js`, and `README.md` to the repository root (or keep them together in a folder and configure Pages to publish that folder). Commit the changes and open the published Pages URL.

## Controls

### Desktop
- `WASD` or arrow keys: move
- Click/tap an empty spot: move to destination
- Click an enemy: select/approach; attack when in range
- `Space`: attack
- `Q`, `E`, `R`: active skills
- `F` or `Enter`: interact
- `Tab`: acquire nearest target
- `I`: inventory · `K`: skills · `Esc`: close modal
- **CLASS** button: choose or change your class
- **Track objective:** highlights the active quest destination on the minimap and in the world

### Mobile
- Use the virtual joystick to move
- Tap empty ground to move to it
- Tap interactables to walk into range and interact
- Use the action buttons for attack, skills, and interaction

## Save data

Progress is stored in local browser storage. It is tied to that browser and device; clearing site data or switching browsers may remove the save. This milestone does not yet include cloud saves, user accounts, authoritative server schedules, or multiplayer.

## Retained progression and systems

Automated browser checks were run with Chromium using the local page assets. Verified: no JavaScript page errors; keyboard movement changes player coordinates; minimap canvas renders; objective tracking selects a current destination; collecting all three echoes changes the objective to the Archivist; the reward transitions to **The Door Beneath**; interacting with the gate spawns the boss and updates tracking to the boss; defeating the boss sets the completion state and advances to **The Last Margin**. Mobile viewport checks verified touch controls are visible and tap-to-move changes player position.

This is still an alpha build. Enemy collision/obstacle navigation, cloud persistence, deeper class specialization, and server-authoritative timed events remain future milestones.


## What was added in 0.3.0

- **Chapter II is playable:** defeating the Page-Eater transitions into The City That Forgot Tomorrow instead of ending the story.
- **New region:** a time-locked city with its own visual treatment, Clockwraith enemies, a Clockmaker NPC, three tomorrow shards, a new rift, and the chapter boss Tomorrow’s Witness.
- **Quest chain:** arrive in the city → speak to the Clockmaker → recover three shards → return to the Clockmaker → enter the Unhappened Hour → defeat Tomorrow’s Witness. The next chapter is teased in the ending dialogue.
- **Class selection:** choose Riftblade, Paradoxist, Hollowkeeper, or Dawnbreaker from the Chronicle Menu or the new CLASS button.
- **Equipment stat fix:** weapon damage and armor vitality are recalculated from equipped gear, so UI refreshes and level-ups no longer erase equipment bonuses.
- **Save migration:** existing 0.2.0 local saves migrate to version 3 while preserving Chapter I progress.

## Chapter II test path

For a fast test, finish Chapter I and defeat the Page-Eater. The game moves you into the city. Speak to the Clockmaker, collect the three Tomorrow Shards, return to the Clockmaker, interact with The Unhappened Hour, and defeat Tomorrow’s Witness. The quest tracker updates each step and the chapter-completion state persists locally.

## QA scope

For 0.3.0, `node --check` passed and automated Chromium UI smoke tests passed for launch, class selection, migration of a completed 0.2.0 save into Chapter II, accepting the Clockmaker quest, collecting all three shards, returning to the Clockmaker, unlocking the boss quest, spawning the boss, defeating Tomorrow’s Witness, and keeping equipment damage bonuses through UI refreshes. No page errors were observed during these tests. The browser test harness used an in-memory storage shim, so verify local-storage persistence in your published browser as part of acceptance testing. This remains an alpha: art and world simulation are custom canvas drawings, and there is no cloud save, account system, or server-authoritative live events yet.


## What’s new in 0.4.0 — The Awakening

- **Class-specific abilities:** each of the four classes has unique Q/E/R skills with different combat behavior, names, essence costs, and cooldowns. The combat hotbar updates when the player changes class.
- **Upgradeable active skills:** each ability has three upgrade ranks. Rank upgrades improve damage, range, healing, ward duration, or other effects depending on the class. Rank 2 requires character level 3; rank 3 requires level 5.
- **Class passive tree:** three passives per class unlock at levels 2, 4, and 6. Passives affect attack damage, vitality, essence, cooldown/cost efficiency, or kill sustain.
- **Skill points:** new characters begin with one point, and each character level-up grants another. Legacy saves are migrated with a level-appropriate point balance.
- **Per-class builds:** active skill ranks and passive choices are preserved separately for each class. Changing class updates the hotbar and recalculates the relevant passive stats.
- **Respecialization:** refund the currently selected class tree and recover the points spent in that tree. Character level, gear, and quest progress are unaffected.
- **Save version 4:** class builds and unspent points persist in the same local save slot.

## Milestone 0.4.0 test checklist

1. Open **SKILLS** and verify the active discipline and passive cards match the selected class.
2. Spend the starting skill point on an active ability; verify the rank indicator changes and the available-point count decreases.
3. Use Q/E/R and verify the class-specific ability fires.
4. Gain a level and verify one skill point is granted.
5. At levels 2, 4, and 6, unlock the corresponding passive and confirm its listed effect.
6. Change class and verify its Q/E/R names and descriptions update; return to the previous class and confirm its allocated ranks remain.
7. Reload the browser and confirm class, ranks, passives, and unspent points persist.
8. Use **REFUND ALL SKILL POINTS** to refund the current class tree and verify that character level, equipment, and quest progress remain intact.

## QA status

`node --check game.js` passes. Source-level checks confirm the four class discipline definitions, point awards on level-up, level-gated active/passive upgrades, save migration to version 4, per-class build storage, class-specific skill effects, and refund flow are present. An automated browser run could not be completed in the build environment because Chromium navigation was blocked by the environment’s administrator policy; please run the checklist above in your deployed GitHub Pages build. This alpha still uses local browser storage and has no account-based cloud saves, authoritative server event scheduler, or multiplayer.
