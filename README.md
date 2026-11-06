# The Group Project

**A startup survival simulator disguised as a fictional desktop operating system.**

You founded PANIC LABS, hired five employees, and won one client who wants “a simple website like Swiggy” for ₹500. Negotiate a realistic first release, manage a dysfunctional team for seven in-game days, inspect simulated repository evidence, survive scope creep, and deliver before the client discovers Bunty has opinions.

This is a complete frontend-first game prototype built with React, TypeScript and Vite. All code activity, commits, builds, client conversations and employee behaviour are simulated locally. It does not connect to GitHub, run submitted code, or call an AI API.

## Requirements

- Node.js **22.12+** (Node 22 LTS recommended)
- npm 10+
- A modern desktop browser (Chrome, Edge or Firefox recommended)

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/` and can be deployed to Vercel, Netlify, Cloudflare Pages or any static hosting provider.

## Tests

```bash
npm test
```

The simulation tests cover seeded day resolution, bounded stats, backlog handling, relationship effects, incident-content validation and final delivery scoring. Each new campaign receives a seed, so repeated campaigns vary while a single save remains reproducible during debugging.

## How to play

1. Start a campaign and negotiate the Royal Feast contract.
2. Discover the real business problem, sort requirements into phases, choose an implementation approach, pitch the value, and set viable commercials.
3. Once the contract is signed, ALMOSTOS opens. The first incident asks you to make a decision before the workday begins.
4. Open apps from desktop icons, the dock or the launcher.
5. Use Team Chat to talk to the group, individuals and the client. Messages can change trust, scope and relationships.
6. Use Repo Studio to compare employee claims with simulated commits and verified progress.
7. Use Sprint Board to assign unowned tasks during planning for free. Changing an existing owner costs one daily action. Tasks in Review can be approved when progress and quality evidence are sufficient.
8. Use Project HQ to spend three management actions per day. Monitoring is free; interventions cost one action.
9. Resolve incidents, end each day, review the daily report, and repeat through Day 7.
10. On Day 7, deliver the project. Acceptance requires at least five of seven core deliverables at usable progress, adequate quality, client trust and no open critical defects.

### Useful controls

- Click desktop icons or dock icons to open applications.
- Drag a window by its title bar on desktop screens.
- Use the window controls to minimise, maximise or close windows.
- Use the launcher button at the bottom-left to open any app.
- `Ctrl/Cmd + 1` opens Project HQ; `Ctrl/Cmd + 2` opens Team Chat.
- On mobile, application windows switch to a full-screen layout.

## Included applications

| App | Purpose |
|---|---|
| Project HQ | Delivery metrics, team pulse and management actions |
| Team Chat | Channels, direct messages, client conversation and comedy |
| Repo Studio | Commit history, simulated diffs, build/test status and contribution evidence |
| Sprint Board | Kanban tasks, assignments, priorities and approvals |
| Client Browser | Contract, accepted scope and client messages |
| QA Laboratory | Defects, severity and fixes |
| People | Employee profiles, hidden traits and relationship dynamics |
| Finance | Contract, advance, balance and simulated ledger |
| File Manager | Fictional project documents and client assets |
| Build Monitor | Simulated terminal and build logs |

## Project architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the module map and extension points, and [`docs/GAMEPLAY.md`](docs/GAMEPLAY.md) for campaign rules, event flow and acceptance conditions.

```text
React UI
  └── ALMOSTOS desktop shell
        ├── Window manager / launcher / taskbar / notifications
        └── Applications
              ├── Chat, Repo, Sprint, Client, QA, People, Finance, Files, Terminal

Zustand game store
  ├── Campaign state and persistence
  ├── Employee and relationship state
  ├── Task, chat, commit and defect state
  └── Player actions and event decisions

Pure TypeScript simulation engine
  ├── Daily employee execution
  ├── Productivity and task progress
  ├── Simulated repository evidence
  └── Delivery score and endings
```

The simulation engine is deliberately independent from React components. Content is data-driven so the campaign can grow with additional clients, event packs and employee archetypes without rewriting the desktop shell.

## Save data

The campaign is saved in browser LocalStorage under `the-group-project-save`. The current save version includes a migration for older prototype saves. Use the ALMOSTOS launcher’s **Power off** control or the ending screen’s restart button to clear the current campaign and start again. Clearing browser site data also removes the local save.

## Current scope and honest limitations

- One campaign: Royal Feast Catering.
- One seven-day delivery cycle.
- Five employee archetypes and one recurring client-side NPC (Bunty appears in event writing).
- Scripted, state-aware messages and conditional incidents; direct messages can change employee trust and morale, and engineering conversations can shift team relationships. No AI-generated dialogue.
- Repository commits, code diffs, terminal output and test statuses are fictional evidence generated by the game engine. Repo Studio displays employee claims alongside verified task progress so you can catch inflated status reports.
- No real deployment, Git operations, code execution, user accounts, backend, multiplayer or online leaderboard.
- Desktop is the primary experience. Mobile receives a full-screen app layout, not overlapping desktop windows.

## Tech stack

- React 19.3
- TypeScript
- Vite 8
- Tailwind CSS 4 (Vite plugin; custom CSS provides the game-specific design system)
- Zustand 5
- Motion for React
- Lucide React
- Zod 4
- Vitest

## License

MIT. See `LICENSE`.
