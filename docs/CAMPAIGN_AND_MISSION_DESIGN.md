# Campaign and Mission Design

## Player fantasy

The player is the founder of a small software company. They are not an observer of a project dashboard: they are the protagonist who speaks to employees, calls meetings, inspects work, handles the client and takes responsibility for delivery.

## Linear chapter flow

1. Company foundation and founder introduction.
2. Five sequential recruitment scenes.
3. Short pre-client team huddle.
4. Mr. Prakash incoming call and six-stage commercial negotiation. Fatal negotiation choices lead to Game Over.
5. Contract summary and terms.
6. Post-signature kickoff meeting: the player assigns one primary workstream to each employee.
7. Seven-day campaign, with two required founder missions per day.
8. Final client demonstration, delivery result and shareable scorecard.

Choices change metrics, tasks, employee morale/fatigue, technical debt, client trust, scope creep and later dialogue. They do not split the campaign into separate story branches.

## Daily player loop

- Read the morning scene and the day's current objective.
- Start the next main mission. Each mission is a character-led scene with a concrete founder action and three responses.
- Read the character reaction and a corresponding group/client chat update.
- Optionally visit the office, speak to employees, use founder actions, or open the fictional desktop to inspect chat, client messages, repository evidence, tasks and QA.
- Complete the second main mission.
- Close the day and review the daily report. The campaign cannot advance until both required missions are complete.

## Mission design rules

- Mission titles are verbs or direct objectives: call, inspect, verify, negotiate, triage, freeze, rehearse, deliver.
- Every mission should ask the founder to do something specific. Avoid abstract objectives like “improve team morale” unless the mission shows a concrete conversation or decision.
- Every choice has an immediate reaction and at least one state consequence.
- Character humour must come from the employee's functional role and habits, not only one-line labels.
- The campaign remains linear. Choices should change the state and flavour of later scenes, not create large branch trees.

## Employee roles

- Kunal: morale, client-facing confidence, documentation and communication; low direct coding output.
- Aarav: rapid AI-assisted UI implementation; higher risk of unverified code, dependencies and integration defects.
- Varun: technical ownership and coordination; must be challenged to show working evidence.
- Meera: quality assurance; excellent at finding real defects but can over-focus on cosmetic ones.
- Nikhil: backend specialist with low availability; needs isolated tasks and explicit handoffs.
- Bunty: recurring external source of scope creep; not an employee.

## Current mission schedule

| Day | Mission 1 | Mission 2 |
|---|---|---|
| 1 | Call the first stand-up and demand a real status | Inspect Aarav's oversized commit |
| 2 | Secure Nikhil's API handoff | Respond to Bunty's scope creep |
| 3 | Handle Bunty's feature request | Resolve the QA / vibe-coder conflict |
| 4 | Verify the integration path | Handle a client preview issue |
| 5 | Protect scope during the change request | Triage Meera's QA findings |
| 6 | Verify Nikhil's ZIP / backend handoff | Freeze features and stabilise release |
| 7 | Rehearse the live client demo | Complete the final acceptance call |

## Important UI rule

The office hub is the campaign's playable space. The desktop is a diegetic workstation inside that world. It is useful for evidence and conversations, but it must not become the default game screen or allow the player to skip required missions.
