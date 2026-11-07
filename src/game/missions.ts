export interface MissionEffects {
  progress?: number;
  quality?: number;
  clientTrust?: number;
  morale?: number;
  technicalDebt?: number;
  scopeCreep?: number;
  cash?: number;
  employeeMorale?: Record<string, number>;
  employeeFatigue?: Record<string, number>;
  taskProgress?: Record<string, number>;
  taskQuality?: Record<string, number>;
  fixDefects?: string[];
}

export interface MissionChoice {
  id: string;
  label: string;
  detail: string;
  reaction: string;
  effects: MissionEffects;
  chatLine?: string;
}

export interface FounderMission {
  id: string;
  day: number;
  title: string;
  objective: string;
  location: string;
  character: 'kunal' | 'aarav' | 'varun' | 'meera' | 'nikhil' | 'prakash' | 'bunty';
  characterRole: string;
  briefing: string;
  choices: MissionChoice[];
}

export const founderMissions: FounderMission[] = [
  {
    id: 'd1_varun_demo', day: 1, title: 'CALL THE FIRST STAND-UP', objective: 'Run a strict 15-minute meeting and get a real status from Varun.', location: 'MEETING ROOM · FIRST TECH STAND-UP', character: 'varun', characterRole: 'Technical Lead',
    briefing: 'You call the first delivery stand-up. Kunal arrives with a speaker. Aarav says he has already finished the frontend. Meera asks what “finished” means. Varun claims the architecture is 90% complete, but the repository contains one README, three diagrams and a folder named FINAL_ARCHITECTURE_NEW. The app has not been opened once.',
    choices: [
      { id: 'demand_demo', label: '"One status each. Varun, open the app and show a working flow—no slides."', detail: 'Run the meeting tightly and require a live demonstration, not a status speech.', reaction: 'Varun opens localhost. It refuses to connect. He calls this a networking issue. You keep him on the task until the first flow is demonstrated.', effects: { quality: 5, technicalDebt: -4, taskProgress: { architecture: 12 }, employeeMorale: { varun: -3, meera: 3 } }, chatLine: 'Varun: Demo completed. Please ignore the first 46 seconds of loading.' },
      { id: 'accept_diagram', label: '"Let Varun present the architecture deck. We will trust the 90%."', detail: 'The meeting stays friendly, but nobody verifies the claim.', reaction: 'Varun thanks you and adds a new diagram called Architecture_Final_Actually_Final. The team has gained a document and lost a little reality.', effects: { morale: 3, technicalDebt: 8, taskProgress: { architecture: 5 }, employeeMorale: { varun: 5 } }, chatLine: 'Varun: As discussed, architecture is locked. Implementation is merely a detail.' },
      { id: 'meera_review', label: '"Meera, challenge the plan against the acceptance criteria."', detail: 'Let QA interrogate the design before the team commits to it.', reaction: 'Meera finds two missing states and a payment flow that points to a restaurant menu. Varun says the menu is a placeholder. Meera asks for the placeholder ticket number.', effects: { quality: 7, technicalDebt: -2, employeeMorale: { meera: 4, varun: -2 }, taskProgress: { architecture: 7 } }, chatLine: 'Meera: Reviewed. The diagram is beautiful. The user flow is fictional.' },
    ],
  },
  {
    id: 'd1_aarav_commit', day: 1, title: 'THE 1,247-LINE MIRACLE', objective: "Inspect Aarav's first big commit before it becomes the whole codebase.", location: 'CODE STUDIO · COMMIT REVIEW', character: 'aarav', characterRole: 'Full-Stack Vibe Coder',
    briefing: 'Aarav has pushed a commit titled "complete website basically final". It changes 38 files, adds 11 dependencies and includes a comment that says // TODO: make this work later. He has already posted a rocket emoji in the group chat.',
    choices: [
      { id: 'run_build', label: '"Run the build and inspect the diff before merging."', detail: 'Verify the work. Catching a problem now is cheaper than on delivery day.', reaction: 'The build fails because a package was imported from a tutorial that no longer exists. Aarav says the package is "temporarily unavailable in this timeline" and fixes the import.', effects: { quality: 6, technicalDebt: -5, taskProgress: { homepage: 4 }, employeeMorale: { aarav: -2, meera: 2 } }, chatLine: 'Aarav: Build is green now. I have removed the dependency that was causing emotional damage.' },
      { id: 'trust_green', label: '"The screenshot looks good. Merge it."', detail: 'Move quickly, but trust a screenshot instead of a build.', reaction: 'The screenshot was taken from a different project. The branch is merged anyway. Somewhere, a semicolon has started a family.', effects: { progress: 7, quality: -8, technicalDebt: 11, employeeMorale: { aarav: 5 } }, chatLine: 'Aarav: Merged. The green tick was from my Figma board but spiritually it counts.' },
      { id: 'pair_simplify', label: '"Sit with me. We are removing anything we cannot explain."', detail: 'Pair with Aarav and simplify the first release.', reaction: 'You remove four unnecessary libraries and one feature called AI-powered hover animation. Aarav admits the app looks faster. He asks whether the deleted packages can be emotionally compensated.', effects: { progress: 3, quality: 4, technicalDebt: -6, employeeMorale: { aarav: 3 }, employeeFatigue: { aarav: 4 }, taskProgress: { homepage: 5 } }, chatLine: 'Aarav: Fine. The code is cleaner. But the animation package had potential.' },
    ],
  },
  {
    id: 'd2_nikhil_api', day: 2, title: 'THE BACKEND HAS LEFT THE BUILDING', objective: 'Get a reliable backend handoff while Nikhil is missing.', location: 'TEAM CHAT · BACKEND CHANNEL', character: 'nikhil', characterRole: 'Backend Developer',
    briefing: 'The WhatsApp enquiry endpoint is assigned to Nikhil. His status says "last seen recently". The last message was sent from a railway platform. Varun says the backend is done. There is no endpoint URL.',
    choices: [
      { id: 'specific_handoff', label: '"Call Nikhil. Ask for a 15-minute handoff and a runnable endpoint."', detail: 'Ask for a concrete deliverable, not a presence indicator.', reaction: 'Nikhil answers from a bus, shares the route and a test payload, then disappears before anyone can say thank you. The handoff is usable.', effects: { progress: 5, quality: 3, technicalDebt: -2, taskProgress: { whatsapp: 12 }, employeeMorale: { nikhil: 3 } }, chatLine: 'Nikhil: sent endpoint + sample payload. do not call again unless production is on fire.' },
      { id: 'backup_aarav', label: '"Give Aarav the API stub so the frontend can keep moving."', detail: 'Reduce waiting time, but watch for vibe-coded backend logic.', reaction: 'Aarav creates a mock API in 11 minutes. It returns exactly what the frontend expects and absolutely nothing else. Useful for now, dangerous if mistaken for production.', effects: { progress: 7, quality: -2, technicalDebt: 5, taskProgress: { whatsapp: 8 }, employeeMorale: { aarav: 3 } }, chatLine: 'Aarav: API is done. It returns success for everything. Very positive backend.' },
      { id: 'wait_nikhil', label: '"Wait. He said tonight, so tonight it is."', detail: 'Avoid disturbing him, but let the dependency sit.', reaction: 'Tonight arrives. Nikhil does not. A new message appears: "tomorrow morning". The calendar quietly removes tomorrow.', effects: { clientTrust: -4, morale: -3, employeeMorale: { nikhil: -2 }, taskProgress: { whatsapp: -2 } }, chatLine: 'Nikhil: saw the messages. will check after lunch.' },
    ],
  },
  {
    id: 'd2_bunty_scope', day: 2, title: 'BUNTY HAS A SMALL REQUEST', objective: 'Handle the first scope-creep attempt without starting a family dispute.', location: 'CLIENT DESK · NEW MESSAGE', character: 'bunty', characterRole: 'Client’s Nephew · Self-appointed CTO',
    briefing: 'Bunty has sent a voice note titled "tiny change final.wav". It requests live delivery tracking, customer loyalty points, an AI chatbot and a 3D logo. The voice note is 4 minutes and 38 seconds long.',
    choices: [
      { id: 'phase_two', label: '"Great ideas. We will document them for Phase 2 after launch."', detail: 'Acknowledge the ideas without accepting new delivery work.', reaction: 'Mr. Prakash appreciates the clear plan. Bunty sends a thumbs-up followed by a 3D logo GIF. It has been filed under future entertainment.', effects: { clientTrust: 6, scopeCreep: -6, morale: 2 }, chatLine: 'Mr. Prakash: Good. First make the website useful. We can discuss the flying logo later.' },
      { id: 'change_request', label: '"We can add one item if the deadline or budget changes."', detail: 'Introduce a proper change request and trade-off.', reaction: 'The client pauses. Bunty tries to calculate the additional cost using a pizza menu. Mr. Prakash agrees to review a written change request later.', effects: { clientTrust: 3, scopeCreep: -2, cash: 500 }, chatLine: 'Bunty: Change request means extra paperwork. I thought AI removed paperwork.' },
      { id: 'accept_all', label: '"Sure. We can squeeze all of it into the same week."', detail: 'Please everyone now; punish the team later.', reaction: 'Kunal creates a celebration playlist. Meera creates a defect spreadsheet. Varun creates a new architecture diagram. Nobody starts the new features.', effects: { clientTrust: -5, scopeCreep: 13, technicalDebt: 8, morale: 3 }, chatLine: 'Meera: Please confirm which of these 19 new requirements is supposed to be tested first.' },
    ],
  },
  {
    id: 'd3_chaos_note', day: 3, title: 'THE FOUR-MINUTE VOICE NOTE', objective: 'Turn Bunty’s wishlist into a controlled change request.', location: 'CLIENT DESK · SCOPE CONTROL', character: 'prakash', characterRole: 'Client · Royal Feast Catering',
    briefing: 'Mr. Prakash calls. He says Bunty has promised a customer app to the family. The signed scope is a responsive website and WhatsApp enquiry flow. The client asks whether the app can be "added quietly" without changing the price.',
    choices: [
      { id: 'show_scope', label: '"Let’s compare the signed scope with the new request on a call."', detail: 'Use the agreement as the shared source of truth.', reaction: 'You read the signed deliverables aloud. Mr. Prakash realises the app was never included. Bunty says he was discussing a "conceptual app".', effects: { clientTrust: 7, scopeCreep: -8, morale: 2 }, chatLine: 'Mr. Prakash: Fair enough. I had mixed up the proposal and Bunty’s imagination.' },
      { id: 'offer_quote', label: '"We can quote the app separately after this launch."', detail: 'Protect the current delivery and create a future opportunity.', reaction: 'Mr. Prakash asks for a separate estimate. Bunty asks whether the app can be made with one button. The lead is saved for later.', effects: { clientTrust: 5, scopeCreep: -5, cash: 750 }, chatLine: 'Bunty: Separate estimate? I have a feeling this is how software companies get you.' },
      { id: 'do_free', label: '"We will add it for free. We need a happy client."', detail: 'A generous promise that quietly destroys the schedule.', reaction: 'The client is delighted. The team is not. Aarav has opened a blank React Native project and named it FINAL_APP.', effects: { clientTrust: 2, scopeCreep: 14, technicalDebt: 8, morale: -5 }, chatLine: 'Aarav: New app repo created. No requirements yet. The vibes are strong.' },
    ],
  },
  {
    id: 'd3_qa_vs_vibe', day: 3, title: 'FEATURE OR DEFECT?', objective: 'Settle the Aarav–Meera argument and protect the build.', location: 'BUILD LAB · RELEASE BLOCKER', character: 'meera', characterRole: 'QA Engineer',
    briefing: 'Meera has blocked the build. Aarav says the payment button is "a visual prototype". Meera says it is a button that takes users to a blank page. They have been debating the definition of "done" for 27 minutes.',
    choices: [
      { id: 'severity_first', label: '"Critical user flows first. Cosmetic issues go into the polish queue."', detail: 'Make QA severity-based, not infinite.', reaction: 'Meera accepts a severity ladder. Aarav fixes the payment button. The 2-pixel border issue is moved to a spreadsheet named Someday.', effects: { quality: 8, technicalDebt: -5, taskProgress: { qa: 10 }, employeeMorale: { meera: 4, aarav: -1 } }, chatLine: 'Meera: Critical flow retested. It works. I have not forgiven the border.' },
      { id: 'all_bugs', label: '"Fix every issue before touching another feature."', detail: 'Quality improves, but the team may spend the week polishing pixels.', reaction: 'Meera is delighted. Aarav has started adjusting a shadow that appears only on one monitor made in 2009.', effects: { quality: 7, progress: -2, morale: -3, taskProgress: { qa: 7 }, employeeMorale: { meera: 5, aarav: -4 } }, chatLine: 'Aarav: I have spent 40 minutes on a shadow. It is now emotionally perfect.' },
      { id: 'call_it_feature', label: '"Ship it. We can call the blank page a minimalist design."', detail: 'Protect velocity by pretending the defect is intentional.', reaction: 'Meera puts the test report on your desk. Aarav renames the blank page Minimalist Payment Experience. Nobody laughs except Kunal.', effects: { progress: 6, quality: -12, technicalDebt: 10, clientTrust: -5 }, chatLine: 'Meera: I am documenting that the founder approved a blank payment page.' },
    ],
  },
  {
    id: 'd4_preview', day: 4, title: 'THE CLIENT WANTS A PREVIEW', objective: 'Choose what to show before the client starts clicking everything.', location: 'CLIENT CALL · FIRST PREVIEW', character: 'prakash', characterRole: 'Client · Royal Feast Catering',
    briefing: 'Mr. Prakash wants a preview today. The homepage looks decent, the catalogue is half populated and the WhatsApp button works in the developer’s browser. Bunty has invited three relatives to the call.',
    choices: [
      { id: 'controlled_demo', label: '"Show the working flows only and label what is still in progress."', detail: 'Set expectations and demonstrate verified functionality.', reaction: 'The client likes the transparency. One uncle asks where the AI is. You tell him it is in Phase 2. He nods as if he understands roadmaps.', effects: { clientTrust: 9, quality: 4, taskProgress: { homepage: 5, catalogue: 5 } }, chatLine: 'Mr. Prakash: This is good. I can see what is ready and what is coming.' },
      { id: 'wait_polish', label: '"Ask for one more day so we can polish the preview."', detail: 'Gain time for quality, but risk looking slow.', reaction: 'The client agrees reluctantly. Bunty posts "launch delayed" in the family group before you finish the sentence.', effects: { quality: 6, clientTrust: -5, morale: -2 }, chatLine: 'Kunal: I have prepared a positive update. It contains the phrase "strategic polishing" four times.' },
      { id: 'let_kunal', label: '"Kunal, you handle the presentation. Keep it short."', detail: 'Use Kunal’s client communication strength. Hope he remembers the scope.', reaction: 'Kunal delivers a passionate presentation. He accidentally promises an AI chatbot, a mobile app and free lifetime updates. The client claps.', effects: { clientTrust: 4, morale: 6, scopeCreep: 7, quality: -2, employeeMorale: { kunal: 8 } }, chatLine: 'Kunal: Great news. They loved the pitch. Slight news: I may have promised lifetime updates.' },
    ],
  },
  {
    id: 'd4_varun_integration', day: 4, title: 'INTEGRATION IS 100% (IN THEORY)', objective: 'Verify Varun’s integration claim before it reaches the client.', location: 'TECH BAY · LIVE INTEGRATION', character: 'varun', characterRole: 'Technical Lead',
    briefing: 'Varun reports that frontend and backend are fully integrated. The only evidence is a screenshot of two windows open next to each other. The API endpoint in the browser says 404. Varun says the endpoint is shy.',
    choices: [
      { id: 'test_endpoint', label: '"Run the happy path and one failure case right now."', detail: 'Demand observable behaviour and a reproducible check.', reaction: 'The first request fails, the second works after a restart. Varun fixes the environment variable and updates the runbook. Progress is slower, but now real.', effects: { quality: 7, technicalDebt: -6, taskProgress: { integration: 12 }, employeeMorale: { varun: -1, meera: 3 } }, chatLine: 'Varun: Endpoint verified. Please update the architecture diagram to reflect reality.' },
      { id: 'trust_status', label: '"Okay, mark integration complete."', detail: 'Accept a status message as proof.', reaction: 'The task board turns green. The browser stays red. Varun says both can be true in a distributed system.', effects: { progress: 5, quality: -8, technicalDebt: 9, employeeMorale: { varun: 4 } }, chatLine: 'Varun: Integration completed. The 404 is a routing opportunity.' },
      { id: 'pair_nikhil', label: '"Get Nikhil and Aarav on a 20-minute pairing call."', detail: 'Combine backend context and frontend speed.', reaction: 'Nikhil joins for exactly 19 minutes. Aarav stops adding dependencies. A working request finally reaches the database.', effects: { progress: 7, quality: 5, technicalDebt: -3, taskProgress: { integration: 10, whatsapp: 5 }, employeeMorale: { nikhil: 4, aarav: 2 } }, chatLine: 'Nikhil: paired. endpoint works. recording is not available. obviously.' },
    ],
  },
  {
    id: 'd5_change_request', day: 5, title: 'ONE LAST TINY CHANGE', objective: 'Decide whether the new feature belongs in this release.', location: 'CLIENT DESK · CHANGE REQUEST #03', character: 'bunty', characterRole: 'Client’s Nephew · Scope Expansion Specialist',
    briefing: 'Bunty sends a screenshot of a competitor website and says: "Just make ours like this." The screenshot contains 26 features, three animations and a loyalty programme. The contract has two days left.',
    choices: [
      { id: 'freeze_scope', label: '"We are in release freeze. New ideas go into the next proposal."', detail: 'Protect the delivery date and the working build.', reaction: 'Bunty reacts with a thumbs-down. Mr. Prakash privately thanks you for keeping the launch date intact.', effects: { clientTrust: 7, scopeCreep: -10, quality: 3 }, chatLine: 'Mr. Prakash: Please keep the date. We have already told customers the website is coming.' },
      { id: 'small_tradeoff', label: '"We can add one small item if we remove an equivalent item."', detail: 'Negotiate a trade-off instead of silently expanding scope.', reaction: 'Bunty tries to remove the footer because "nobody reads it". Meera asks where the contact details will go. The trade-off is postponed.', effects: { clientTrust: 4, scopeCreep: -3, progress: -1 }, chatLine: 'Bunty: Fine. But I am keeping the animated logo in my heart.' },
      { id: 'add_everything', label: '"We can squeeze it in. The team can work late."', detail: 'Take the bait. Fatigue and defects are likely.', reaction: 'Kunal orders energy drinks. Meera creates a new test plan. Aarav types "we got this" and opens 14 tabs.', effects: { progress: 6, quality: -8, morale: -7, technicalDebt: 8, scopeCreep: 12 }, chatLine: 'Meera: Please confirm the acceptance criteria for the 26 features. I am not joking.' },
    ],
  },
  {
    id: 'd5_meera_qa', day: 5, title: 'MEERA VS THE ENTIRE INTERNET', objective: 'Help QA distinguish release blockers from cosmetic perfection.', location: 'BUILD LAB · TEST TRIAGE', character: 'meera', characterRole: 'QA Engineer',
    briefing: 'Meera has reported 23 issues. Three are critical, six are major, nine are minor and five concern typography. She has attached a 41-page report and a screenshot of a button that is allegedly "too cheerful".',
    choices: [
      { id: 'critical_first', label: '"Fix critical and major issues first. Log the rest for polish."', detail: 'Prioritise by user impact and release risk.', reaction: 'Meera agrees to severity-based triage. She still circles the cheerful button, but puts it in the minor queue.', effects: { quality: 8, technicalDebt: -4, taskProgress: { qa: 14 }, employeeMorale: { meera: 4 } }, chatLine: 'Meera: Criticals retested. The cheerful button is under observation.' },
      { id: 'polish_everything', label: '"Fix all 23. No compromises."', detail: 'High polish, but the remaining work may not ship.', reaction: 'The button is now perfectly aligned. The deployment checklist is still empty. Meera calls it a beautiful risk.', effects: { quality: 8, progress: -5, morale: -3, employeeFatigue: { meera: 8 } }, chatLine: 'Meera: The UI is immaculate. I cannot confirm it is online.' },
      { id: 'ignore_report', label: '"We are out of time. Close the report."', detail: 'Gain time at the cost of quality and trust.', reaction: 'Meera closes the report, opens a new document and titles it Evidence That I Warned You.', effects: { progress: 4, quality: -11, clientTrust: -5, technicalDebt: 8 }, chatLine: 'Meera: Acknowledged. I have saved the evidence.' },
    ],
  },
  {
    id: 'd6_nikhil_returns', day: 6, title: 'THE GHOST HAS RETURNED', objective: 'Verify Nikhil’s mysterious ZIP before using it in the release.', location: 'BACKEND DESK · FILE HANDOFF', character: 'nikhil', characterRole: 'Backend Developer',
    briefing: 'Nikhil appears online and uploads latest_final_REAL_final_v9.zip. He says the backend is complete. The archive is 480 MB. The README says "run after extracting maybe". Meera has already put on gloves.',
    choices: [
      { id: 'inspect_zip', label: '"Extract it in a clean environment and run the tests."', detail: 'Verify the package before merging it.', reaction: 'The first run fails because an environment file is missing. Nikhil sends it. The second run passes. The backend is real. The filename remains a crime.', effects: { quality: 9, technicalDebt: -7, taskProgress: { whatsapp: 15, deployment: 5 }, employeeMorale: { nikhil: 5, meera: 2 } }, chatLine: 'Nikhil: tests pass. zip name is final. please stop renaming it.' },
      { id: 'trust_zip', label: '"Looks like a lot of work. Merge and deploy."', detail: 'Trust the archive size as evidence.', reaction: 'The ZIP contains node_modules, three copies of the same API and a folder called old_old. The deployment fails with a missing start command.', effects: { progress: 6, quality: -10, technicalDebt: 12 }, chatLine: 'Aarav: I can fix the missing command. I may need to install one thing.' },
      { id: 'pair_handoff', label: '"Nikhil, stay on the call and walk Meera through it."', detail: 'Trade a little time for a reliable handover.', reaction: 'Nikhil stays on the call for 12 minutes, which is his personal record. Meera gets a reproducible test path and the team finally understands the API.', effects: { progress: 6, quality: 7, technicalDebt: -4, taskProgress: { whatsapp: 12 }, employeeMorale: { nikhil: 7, meera: 3 } }, chatLine: 'Meera: Handoff documented. Nikhil has left the meeting. The meeting is still processing.' },
    ],
  },
  {
    id: 'd6_release_freeze', day: 6, title: 'THE FEATURE FREEZE', objective: 'Protect the release candidate from last-minute ideas.', location: 'TEAM ROOM · RELEASE COUNCIL', character: 'kunal', characterRole: 'Chief Motivation Officer',
    briefing: 'Kunal has called an emergency "alignment summit". Aarav wants to add dark mode. Varun wants to refactor routing. Meera wants the payment button tested. Nikhil has gone offline again. The deadline is tomorrow.',
    choices: [
      { id: 'freeze_and_test', label: '"Feature freeze. Only blockers and delivery checks from now on."', detail: 'Stop adding features and stabilise the release.', reaction: 'Meera applauds. Aarav quietly saves the dark-mode branch. Varun asks whether the freeze applies to architecture diagrams.', effects: { quality: 7, technicalDebt: -6, morale: 3, scopeCreep: -5 }, chatLine: 'Kunal: We are in freeze mode. I have made a playlist called Cold but Focused.' },
      { id: 'dark_mode', label: '"Dark mode is quick. Add it."', detail: 'Accept a tempting feature with limited time.', reaction: 'Aarav changes the background to black. The text is also black. He says the theme is "OLED immersive".', effects: { progress: 3, quality: -5, technicalDebt: 5, employeeMorale: { aarav: 4 } }, chatLine: 'Meera: Dark mode is dark. Text is also dark. I have opened a blocker.' },
      { id: 'refactor', label: '"Let Varun refactor the routing before release."', detail: 'Risk destabilising working flows for architectural elegance.', reaction: 'Varun produces a beautiful new route map. The old URL now redirects to a philosophical question.', effects: { quality: -4, technicalDebt: 4, clientTrust: -3, employeeMorale: { varun: 5 } }, chatLine: 'Varun: Routing is cleaner. Some URLs are discovering their identity.' },
    ],
  },
  {
    id: 'd7_rehearsal', day: 7, title: 'THE CLIENT DEMO REHEARSAL', objective: 'Rehearse the delivery with real clicks, not a slide deck.', location: 'MEETING ROOM · DEMO RUN', character: 'kunal', characterRole: 'Client Liaison (Self-appointed)',
    briefing: 'The client demo is in two hours. Kunal has prepared a 34-slide deck. Aarav says the site works locally. Varun says the architecture is ready. Meera asks whether anyone has tried the production link.',
    choices: [
      { id: 'full_rehearsal', label: '"Run the complete demo on the production URL. Everyone take a role."', detail: 'Test the actual path the client will see.', reaction: 'The team rehearses the homepage, catalogue and enquiry flow. One image fails, but Meera catches it before the call. Kunal is limited to three slides.', effects: { quality: 9, clientTrust: 6, taskProgress: { deployment: 12, presentation: 8 }, employeeMorale: { meera: 4, kunal: -1 } }, chatLine: 'Meera: Production path verified. Kunal used only three slides. Historic day.' },
      { id: 'slides_only', label: '"The slides are enough. We know what we built."', detail: 'Save time, but skip the most important test.', reaction: 'Kunal delivers an inspiring talk. The client asks to click the enquiry button. The room becomes very interested in the ceiling.', effects: { morale: 5, clientTrust: -8, quality: -5, employeeMorale: { kunal: 5 } }, chatLine: 'Kunal: Presentation was amazing. The button issue was a surprise to all of us.' },
      { id: 'meera_lead', label: '"Meera drives the demo. Everyone else answers only their own area."', detail: 'Let the person with evidence lead the technical demonstration.', reaction: 'Meera explains the tested flows and known limitations. The client appreciates the honesty. Kunal is asked to hold the clicker.', effects: { quality: 8, clientTrust: 8, morale: 2, taskProgress: { qa: 8, presentation: 5 }, employeeMorale: { meera: 7, kunal: -2 } }, chatLine: 'Meera: I led a demo. I have also filed a bug against the clicker.' },
    ],
  },
  {
    id: 'd7_delivery_call', day: 7, title: 'THE FINAL CALL', objective: 'Deliver honestly and decide what you are willing to promise next.', location: 'CLIENT CALL · FINAL ACCEPTANCE', character: 'prakash', characterRole: 'Client · Royal Feast Catering',
    briefing: 'Mr. Prakash joins the call with Bunty and two relatives. He wants to know if the website is ready, whether the AI chatbot is included and whether the logo can be changed to a rotating 3D biryani. This is the final acceptance conversation.',
    choices: [
      { id: 'honest_handover', label: '"Here is the working Phase 1. These are the verified flows and documented next steps."', detail: 'Deliver what was agreed and make the next phase a separate conversation.', reaction: 'Mr. Prakash tests the menu and sends an enquiry. It works. Bunty asks where the 3D biryani is. The client says, "Next phase, beta." You survive.', effects: { clientTrust: 12, quality: 4, morale: 4 }, chatLine: 'Mr. Prakash: Good work. This is what we agreed. Send the handover details.' },
      { id: 'promise_ai', label: '"AI and the 3D biryani will be live by tomorrow."', detail: 'Win the moment with a promise the team cannot keep.', reaction: 'The client is excited. The team opens the calendar and sees a new deadline titled "Consequences".', effects: { clientTrust: -7, scopeCreep: 10, technicalDebt: 5, morale: -4 }, chatLine: 'Aarav: I can generate an AI button. I cannot guarantee what happens after clicking it.' },
      { id: 'blame_team', label: '"The team could not finish because everyone kept disappearing."', detail: 'Avoid accountability and destroy the room’s trust.', reaction: 'The room goes quiet. Meera closes her laptop. Nikhil leaves the call. Kunal says he will make a playlist for accountability.', effects: { clientTrust: -14, morale: -12, employeeMorale: { kunal: -4, aarav: -3, varun: -4, meera: -4, nikhil: -4 } }, chatLine: 'Meera: The release report records the founder’s statement. Verbatim.' },
    ],
  },
];

export const missionsForDay = (day: number) => founderMissions.filter((mission) => mission.day === day);
