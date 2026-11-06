# Architecture notes

## Separation of concerns

### Desktop shell

`src/components/Desktop.tsx` owns the fictional ALMOSTOS desktop: application registry, window positions, z-order, launcher, taskbar, notification centre, incident overlay and daily report overlay. App window state is presentation state and is intentionally separate from the game simulation.

### Application layer

`src/apps/` contains the desktop apps. Apps read game state from Zustand and call explicit store actions. They do not calculate autonomous employee output or mutate the simulation engine directly.

### Game domain

`src/game/types.ts` defines the shared campaign entities. `data.ts` contains seed content: employees, initial relationships, project tasks, channels, messages, defects and campaign incidents.

### Simulation engine

`src/game/engine.ts` contains pure helpers for bounded values, deterministic day resolution and delivery scoring. The daily resolver uses a per-campaign seed and a deterministic PRNG. A fresh campaign varies its outcomes, while a saved campaign day remains reproducible during debugging. It returns a resolution object instead of mutating React state.

### State and persistence

`src/game/store.ts` coordinates player actions, event choices, daily transitions, delivery outcomes and LocalStorage persistence through Zustand. The store is the single source of truth for campaign state.

### Content validation

`src/game/validation.ts` uses Zod to validate event definitions before they are presented to the player.

## Extending the game

- Add new employees in `data.ts` and provide skill/reliability values.
- Add relationship edges to `initialRelationships`.
- Add tasks to `initialTasks` and ensure each task has a stable ID.
- Add an incident under the appropriate campaign day in `campaignEvents`; event choices are resolved in `resolveEvent` in the store.
- Add a new application ID to `AppId`, register its metadata in `Desktop.tsx`, create its component under `src/apps/`, and add it to the app switch.
- Keep UI components free of simulation formulas. Add pure resolution logic to `engine.ts` or a focused resolver module.

## Persistence and safety

Only local browser state is stored. The game does not execute user code, fetch remote project repositories, or send messages to external services. All client and employee conversations are fictional game content.
