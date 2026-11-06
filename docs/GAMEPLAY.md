# Gameplay and campaign notes

## Campaign premise

The player is the founder of PANIC LABS, a newly established software company. The campaign begins after the founder receives an inquiry from Mr. Prakash of Royal Feast Catering. The client's unfiltered wishlist is intentionally unreasonable: website, ordering, payments, apps, tracking and AI for ₹500.

## Negotiation loop

1. Discovery: identify the business problem instead of responding to the technology wishlist.
2. Scope: distinguish Phase 1, Phase 2 and future requirements.
3. Approach: choose a focused solution.
4. Pitch: explain business outcomes and delivery boundaries.
5. Commercials: set a price and accept a feasible contract.

The player can fail before the main campaign by accepting the ₹500 everything-included trap, quoting an ungrounded complete-platform price, or failing to establish a viable MVP scope and proposal score.

## Main loop

Each in-game day:

- Review the desktop, notifications, chat, work evidence and current blockers.
- Make initial assignments for unowned tasks for free; changing an existing owner costs one action.
- Use up to three management actions.
- Resolve the day. Employees work autonomously based on reliability, skill, morale, fatigue, clarity and controlled seeded randomness.
- Receive a daily report and a state-aware incident for the next day.

Monitoring is free. Coding, pairing, motivation, reassignment, audits, client updates and defect triage use management actions.

## Employee behaviours

| Employee | Strength | Failure mode |
|---|---|---|
| Kunal | Content and communication | Motivation exceeds output |
| Aarav | Fast frontend implementation | AI-assisted shortcuts and technical debt |
| Varun | Architecture and technical reasoning | Inflated progress reports |
| Meera | Defect discovery and QA reliability | Over-focus on cosmetic issues |
| Nikhil | Strong backend output when present | Low availability and unreliable check-ins |

## Relationship layer

Relationships use trust, respect and friction. Direct messages, player interventions and campaign incidents can change these values. Employee profiles also track founder trust, which changes when the player checks in, pairs or investigates. The Aarav–Varun relationship also affects the integration task: high friction slows collaboration, while a repaired relationship provides a modest teamwork bonus. Current relationships are persistent campaign state and displayed in People. Bunty has a separate uninvited DM thread; agreeing with his ideas adds scope creep and technical debt.

## Repository verification

A commit record is generated when an employee produces a contribution during simulated execution. Repo Studio displays contributor, commit message, files changed, additions/deletions, build status, test status, a quality signal and a task-level claim-versus-evidence panel. Its file explorer provides a simulated repository snapshot and related contribution history. The task's reported progress is kept separate from verified progress.

## Campaign incidents

- Day 1: Microservices proposal.
- Day 2: “Bro, AI has cooked.”
- Day 3: One Small Requirement™.
- Day 4: Works on My Machine.
- Day 5: Meera Has a Spreadsheet.
- Day 6: A Wild Nikhil Appears.
- Day 7: The Client Is Already in the Waiting Room; freeze scope, take a risky last-minute feature, or rehearse the demo.
- Final delivery and acceptance after the Day 7 incident.

Every incident has three choices and updates one or more state variables. The event sequence is authored as reusable event data and resolved through the game store.

## End conditions

- Negotiation failure: the contract is not viable.
- Client cancellation: client trust collapses or the client has lost confidence by delivery.
- Deadline failure: fewer than five of the seven core deliverables reach usable progress.
- Quality rejection: critical defects remain or verified quality is below the acceptance threshold.
- Success: the product clears the campaign's minimum delivery gate. Final score produces one of four performance ratings.
