# Implementation Notes

## Architecture

- React + TypeScript + Vite for the browser game.
- Zustand is the single campaign state store.
- `src/game/engine.ts` and `src/game/store.ts` contain simulation state transitions.
- `src/game/missions.ts` holds the two daily founder missions for each campaign day.
- `MissionControl` presents the current mission and its choices.
- `OfficeHub` is the main post-contract game hub.
- `Desktop` contains in-world applications such as Chat, Client Desk, Code Studio, Task Board and Build Lab.
- `Prologue`, `ClientMeeting`, `ContractSigned` and `TeamKickoff` implement the staged opening.

## Mission gating

The store's `endDay` action refuses to advance if any mission for the current day is incomplete. The Office Hub disables its day-end control in that state. If the player tries to end the day from the desktop before completing the missions, the desktop returns them to the Office Hub.

## Persistence

Campaign persistence includes completed mission IDs and role assignments. The store migration supplies defaults for saves created before these fields existed.

## Validation

The source was syntax-transpiled with the globally available TypeScript transpiler; all TS/TSX files passed. JSON files were parsed and the mission schedule was checked for two missions on each of seven days. A full Vite production build was not completed in the generation environment because npm dependencies were not installed and package installation could not be completed. Run `npm install`, `npm test` and `npm run build` locally before publishing.
