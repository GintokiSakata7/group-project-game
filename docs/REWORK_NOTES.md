# Story-first rework notes

## Intent
The game is a humorous founder adventure, not a project-management product. The player should discover systems gradually through story scenes and in-world interactions.

## Current campaign sequence
1. `TitleScreen.tsx` — atmospheric title page; Start New Campaign begins a fresh state.
2. `Prologue.tsx` — company registration, founder scene, five individual hiring scenes, then an incoming client-call scene.
3. `ClientMeeting.tsx` — answer/decline the call, then play four negotiation rounds. Fatal decisions lead to Game Over; viable negotiation converges on the same campaign.
4. `ContractSigned.tsx` — short signed-deal celebration and seven-day deadline.
5. `OfficeHub.tsx` — illustrated team floor. Clicking a teammate opens dialogue and founder actions. The workstation opens the desktop.
6. `Desktop.tsx` — in-world desktop with Team Chat, Client Desk, Code Studio, Team Room, Task Board and Build Lab.
7. Existing delivery scoring and shareable results remain in place.

## State decisions
- `beginPrologue` resets the campaign before showing the company foundation screen.
- The company name is editable in the foundation scene and is preserved when `startCampaign` resets the delivery campaign state.
- The negotiation stays linear; decisions influence score/simulation, and failed negotiation ends the run.
- Existing Zustand simulation state and daily event engine are retained.

## Visual system
- `public/assets/title-art.webp` — generated title illustration.
- `public/assets/office-scene.webp` — generated office scene background.
- `public/assets/characters/*.webp` — local character portraits for the five teammates and Mr. Prakash.
- Character portraits are used by `CharacterSprite.tsx`; founder and Bunty retain the vector fallback.
- The story and office screens use large headings, dialogue panels and responsive layouts. The desktop remains a secondary in-world surface.

## Extension guidance
- Add new story beats as explicit scenes, not a long dashboard or one giant text page.
- Keep new employee/client dialogue in data-driven content where practical.
- Keep simulation rules in `src/game/`; avoid duplicating rules in React components.
- Avoid adding new apps until the current desktop interactions are easy to understand and readable.
- Keep body/chat text at 15–18px or larger where possible; metadata should not be the primary way to understand gameplay.
