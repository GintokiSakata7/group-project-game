# The Group Project — A Majin Studios Comedy Adventure

> You founded a software company. You hired five questionable employees. A client called. Now you have seven days to ship something.

This is a browser-first, story-led workplace comedy game. The player experiences the campaign one scene at a time; the fictional desktop becomes an in-world tool after the client signs the deal, not the opening dashboard.

## Story flow

1. **Title screen** — start a new campaign.
2. **Company foundation** — name the studio and register the company.
3. **Founder scene** — establish the player's role and the startup's situation.
4. **Team recruitment** — meet Kunal, Aarav, Varun, Meera and Nikhil one at a time, with short character-led scenes.
5. **Incoming client call** — answer Mr. Prakash, then play the negotiation sequence with his nephew Bunty interrupting.
6. **Contract signed** — a short celebration scene starts the seven-day delivery deadline.
7. **Seven-day founder campaign** — each day has two required story missions. These are concrete founder objectives (run a stand-up, demand a live demo, inspect a commit, negotiate scope, triage QA, verify a handoff, rehearse delivery), not generic dashboard tasks. The player chooses a response and sees the consequences. Both story missions must be completed before the day can close.
8. **Office hub** — visit the team floor, click employees to talk, spend optional founder actions, inspect the daily mission board and open the workstation. Character dialogue changes across the week.
9. **Desktop OS** — use Team Chat, Client Desk, Code Studio, Team Room, Task Board and Build Lab to investigate the fictional company. The desktop is an in-world tool; it cannot skip required story missions.
10. **Delivery and result** — the simulation evaluates deliverables, quality, client trust and team chaos, then creates a shareable campaign scorecard.

The main story remains linear. Decisions affect the simulation, character relationships and ending quality; they do not create separate campaigns. Fatal negotiation decisions lead to Game Over.

## The team

- **Kunal — Chief Motivation Officer:** speaks in motivational speeches, curates playlists and boosts morale. Actual code output is a separate department.
- **Aarav — Full-Stack Vibe Coder:** fast AI-assisted implementation, mystery dependencies and questionable tests.
- **Varun — Technical Lead:** confident architecture claims; ask for working evidence rather than another diagram.
- **Meera — QA:** catches critical bugs and pixel-level defects, sometimes in the same breath.
- **Nikhil — Backend Developer:** rarely available; occasionally appears and solves the hardest problem in the room.
- **Bunty:** the client's nephew and self-appointed technology consultant. He is not an employee; he is a recurring source of scope creep.

## Game design principles

- One clear story stage or decision at a time; avoid front-loading dashboards and statistics.
- The player is the founder and active protagonist. Daily missions ask them to go speak to people, call meetings, inspect evidence and make decisions.
- The seven-day campaign has two required missions per day; optional desktop interactions add context but do not replace the main story.
- Character portraits, readable dialogue and expressive reactions carry the humour.
- The office hub is the game space; the desktop is an optional diegetic workstation.
- The simulation engine remains in TypeScript/Zustand. UI components present the game; they do not duplicate game rules.
- No real GitHub, email, client messaging or AI APIs are connected. All business activity is fictional game content.

## Visual assets

Local WebP assets are included in `public/assets/` and `public/assets/characters/`. Character portraits and scene artwork were created for this prototype and are bundled locally so the game does not rely on remote hotlinks at runtime.

## Tech stack

- React 19 + TypeScript + Vite
- Zustand with persistence for campaign state
- Motion for scene transitions and character reactions
- Tailwind CSS plus custom game-specific CSS
- Lucide React icons
- Vitest for simulation tests

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Test and build

```bash
npm test
npm run build
npm run preview
```

## First playthrough

Start a new campaign, name the company, meet the founder and five hires, hold the pre-client team huddle, answer Mr. Prakash's call, negotiate scope and payment terms, then assign workstreams in the post-signature kickoff. During the seven-day campaign, clear the two founder missions shown for each day before advancing. Use the desktop to inspect evidence and conversations, not as a substitute for the story.
