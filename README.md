# Echoes of the Unwritten — Milestone 0.2.0

**The Living World Update** · Browser-based single-player RPG prototype

## What's new in 0.2.0

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
- **Track objective:** highlights the active quest destination on the minimap and in the world

### Mobile
- Use the virtual joystick to move
- Tap empty ground to move to it
- Tap interactables to walk into range and interact
- Use the action buttons for attack, skills, and interaction

## Save data

Progress is stored in local browser storage. It is tied to that browser and device; clearing site data or switching browsers may remove the save. This milestone does not yet include cloud saves, user accounts, authoritative server schedules, or multiplayer.

## QA performed for 0.2.0

Automated browser checks were run with Chromium using the local page assets. Verified: no JavaScript page errors; keyboard movement changes player coordinates; minimap canvas renders; objective tracking selects a current destination; collecting all three echoes changes the objective to the Archivist; the reward transitions to **The Door Beneath**; interacting with the gate spawns the boss and updates tracking to the boss; defeating the boss sets the completion state and advances to **The Last Margin**. Mobile viewport checks verified touch controls are visible and tap-to-move changes player position.

This is still an alpha build. Enemy collision/obstacle navigation, cloud persistence, deeper class specialization, and server-authoritative timed events remain future milestones.
