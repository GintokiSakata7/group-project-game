import type {
  ChatChannel,
  ChatMessage,
  Defect,
  Employee,
  GameEvent,
  ProjectTask,
  Relationship,
} from './types';

export const initialEmployees: Employee[] = [
  {
    id: 'kunal', name: 'Kunal', role: 'Frontend Developer', title: 'Chief Motivation Officer', avatar: '☀️', color: '#e8b75f',
    tagline: 'Let’s lock in. I made a playlist.', skills: { frontend: 24, content: 84, design: 48 }, reliability: 68, morale: 88, fatigue: 8, ego: 52, founderTrust: 76, baseProductivity: 8,
    availability: 'online', lastSeen: 'Now', hiddenTrait: 'He is genuinely excellent at client communication and documentation.', discovered: false,
    quirks: ['Sends “good morning legends” before sunrise', 'Has 14 productivity playlists', 'Calls every meeting a “sync-up”'],
  },
  {
    id: 'aarav', name: 'Aarav', role: 'Full-stack Developer', title: 'AI-Powered Engineering Department', avatar: '⚡', color: '#83b7df',
    tagline: 'Done. AI handled it. Probably.', skills: { frontend: 92, backend: 68, design: 78 }, reliability: 78, morale: 72, fatigue: 12, ego: 78, founderTrust: 54, baseProductivity: 20,
    availability: 'busy', lastSeen: '2 min ago', hiddenTrait: 'His speed is real, but vague tickets turn into technical debt.', discovered: false,
    quirks: ['Uses “bro” as punctuation', 'Commits directly to main', 'Has a folder called final-final-v7'],
  },
  {
    id: 'varun', name: 'Varun', role: 'Technical Lead', title: 'Everything Is Under Control™', avatar: '🧠', color: '#ae9bdd',
    tagline: 'Architecture is complete. Implementation is a detail.', skills: { architecture: 94, backend: 82, frontend: 52, deployment: 58 }, reliability: 72, morale: 68, fatigue: 10, ego: 92, founderTrust: 48, baseProductivity: 11,
    availability: 'busy', lastSeen: 'Now', hiddenTrait: 'He can solve hard problems when asked for a working demo instead of a status update.', discovered: false,
    quirks: ['Draws architecture diagrams for static pages', 'Says “scalable” at least 9 times a day', 'Reports 90% when the README exists'],
  },
  {
    id: 'meera', name: 'Meera', role: 'QA Engineer', title: 'Department of Finding Problems', avatar: '🔬', color: '#dc8c93',
    tagline: 'The button works. But does it work emotionally?', skills: { testing: 99, frontend: 45, backend: 42 }, reliability: 96, morale: 75, fatigue: 9, ego: 46, founderTrust: 72, baseProductivity: 9,
    availability: 'online', lastSeen: 'Now', hiddenTrait: 'She prevents catastrophic releases, but needs severity-based priorities.', discovered: false,
    quirks: ['Tests empty strings with commitment', 'Once reported a 1px alignment issue', 'Has a spreadsheet for the spreadsheet'],
  },
  {
    id: 'nikhil', name: 'Nikhil', role: 'Backend Developer', title: 'Distributed Human Resource', avatar: '👻', color: '#9ca7ad',
    tagline: 'Will send tonight.', skills: { backend: 91, deployment: 78, architecture: 62 }, reliability: 28, morale: 55, fatigue: 18, ego: 32, founderTrust: 22, baseProductivity: 22,
    availability: 'offline', lastSeen: '3 days ago', hiddenTrait: 'When present, he can finish isolated backend tasks exceptionally quickly.', discovered: false,
    quirks: ['Replies “seen” to task assignments', 'Online for 43 seconds at a time', 'Names uploads latest_actual_final.zip'],
  },
];

export const initialRelationships: Relationship[] = [
  { employeeA: 'aarav', employeeB: 'varun', trust: 42, respect: 50, friction: 76, label: 'Mutual blame', history: 'Aarav thinks the architecture is overcomplicated. Varun thinks Aarav is a walking pull request.' },
  { employeeA: 'aarav', employeeB: 'meera', trust: 36, respect: 68, friction: 83, label: 'QA rivalry', history: 'Meera finds bugs. Aarav finds reasons those bugs are actually features.' },
  { employeeA: 'varun', employeeB: 'meera', trust: 63, respect: 78, friction: 37, label: 'Professional tension', history: 'Meera asks for proof. Varun provides a diagram.' },
  { employeeA: 'kunal', employeeB: 'aarav', trust: 79, respect: 62, friction: 12, label: 'Hype squad', history: 'Kunal calls Aarav a genius. Aarav has not corrected him.' },
  { employeeA: 'kunal', employeeB: 'varun', trust: 76, respect: 73, friction: 8, label: 'Mutual admiration', history: 'They can turn a 10-minute stand-up into a 90-minute summit.' },
  { employeeA: 'nikhil', employeeB: 'aarav', trust: 28, respect: 55, friction: 44, label: 'Rare collaborators', history: 'They once shipped a working API. Nobody knows how.' },
  { employeeA: 'nikhil', employeeB: 'meera', trust: 18, respect: 62, friction: 68, label: 'Missing evidence', history: 'Meera has never received a reproducible build from Nikhil.' },
];

export const initialTasks: ProjectTask[] = [
  { id: 'homepage', title: 'Premium homepage', description: 'Responsive landing page with clear catering value proposition and calls to action.', category: 'frontend', effort: 7, progress: 8, reportedProgress: 18, verifiedProgress: 8, quality: 58, assignedTo: 'aarav', priority: 'critical', dependencies: [], dueDay: 5, status: 'in_progress', deliverable: true },
  { id: 'catalogue', title: 'Service & menu catalogue', description: 'Show packages, menu highlights, service types and useful details.', category: 'frontend', effort: 6, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 55, assignedTo: 'aarav', priority: 'high', dependencies: ['homepage'], dueDay: 5, status: 'assigned', deliverable: true },
  { id: 'whatsapp', title: 'WhatsApp enquiry flow', description: 'Prefilled WhatsApp enquiry with service and event details.', category: 'backend', effort: 5, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 60, assignedTo: 'nikhil', priority: 'critical', dependencies: [], dueDay: 6, status: 'assigned', deliverable: true },
  { id: 'contact', title: 'Contact & location section', description: 'Contact details, enquiry CTA, business hours and location.', category: 'content', effort: 3, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 65, assignedTo: 'kunal', priority: 'high', dependencies: [], dueDay: 4, status: 'assigned', deliverable: true },
  { id: 'responsive', title: 'Mobile responsiveness', description: 'Check important screens at phone, tablet and desktop widths.', category: 'frontend', effort: 4, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 48, assignedTo: null, priority: 'high', dependencies: ['homepage', 'catalogue'], dueDay: 6, status: 'backlog', deliverable: true },
  { id: 'seo', title: 'On-page SEO basics', description: 'Page titles, metadata, semantic content, alt text and sitemap checklist.', category: 'content', effort: 3, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 68, assignedTo: 'kunal', priority: 'normal', dependencies: ['homepage'], dueDay: 6, status: 'assigned', deliverable: true },
  { id: 'architecture', title: 'Integration plan', description: 'Define a simple, maintainable frontend and enquiry flow. No microservices for a brochure site.', category: 'architecture', effort: 3, progress: 5, reportedProgress: 90, verifiedProgress: 5, quality: 62, assignedTo: 'varun', priority: 'normal', dependencies: [], dueDay: 2, status: 'in_progress', deliverable: false },
  { id: 'qa', title: 'Functional QA pass', description: 'Verify navigation, forms, responsive layout and key interactions.', category: 'testing', effort: 5, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 70, assignedTo: null, priority: 'high', dependencies: ['homepage', 'catalogue', 'whatsapp'], dueDay: 7, status: 'backlog', deliverable: true },
  { id: 'deployment', title: 'Production deployment', description: 'Deploy the approved build and verify the production URL.', category: 'deployment', effort: 3, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 55, assignedTo: null, priority: 'critical', dependencies: ['homepage', 'catalogue', 'whatsapp'], dueDay: 7, status: 'backlog', deliverable: true },
  { id: 'presentation', title: 'Client handover & demo', description: 'Prepare a concise walkthrough and handover notes.', category: 'content', effort: 2, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 60, assignedTo: 'kunal', priority: 'normal', dependencies: ['deployment'], dueDay: 7, status: 'backlog', deliverable: false },
  { id: 'integration', title: 'Frontend/API integration', description: 'Connect the enquiry form and catalogue data to working endpoints.', category: 'backend', effort: 5, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 55, assignedTo: null, priority: 'high', dependencies: ['architecture', 'whatsapp'], dueDay: 6, status: 'backlog', deliverable: true },
];

export const initialChannels: ChatChannel[] = [
  { id: 'general', name: 'general', type: 'group', memberIds: ['player', 'kunal', 'aarav', 'varun', 'meera', 'nikhil'], subtitle: 'The place where work goes to get discussed.' },
  { id: 'project', name: 'project-royal-feast', type: 'group', memberIds: ['player', 'kunal', 'aarav', 'varun', 'meera', 'nikhil'], subtitle: 'A small website. Allegedly.' },
  { id: 'engineering', name: 'engineering', type: 'group', memberIds: ['player', 'aarav', 'varun', 'nikhil'], subtitle: 'Architecture, pull requests and finger-pointing.' },
  { id: 'qa-room', name: 'qa-room', type: 'group', memberIds: ['player', 'aarav', 'meera'], subtitle: 'A safe space for unsafe builds.' },
  { id: 'random', name: 'random-chaos', type: 'group', memberIds: ['player', 'kunal', 'aarav', 'varun', 'meera', 'nikhil'], subtitle: 'Unofficially the most active channel.' },
  { id: 'prakash', name: 'Mr. Prakash', type: 'client', memberIds: ['player', 'prakash'], subtitle: 'Royal Feast Catering · Client' },
  { id: 'kunal', name: 'Kunal', type: 'direct', memberIds: ['player', 'kunal'], subtitle: 'Chief Motivation Officer' },
  { id: 'aarav', name: 'Aarav', type: 'direct', memberIds: ['player', 'aarav'], subtitle: 'AI-powered engineering' },
  { id: 'varun', name: 'Varun', type: 'direct', memberIds: ['player', 'varun'], subtitle: 'Technical Lead' },
  { id: 'meera', name: 'Meera', type: 'direct', memberIds: ['player', 'meera'], subtitle: 'Quality Assurance' },
  { id: 'nikhil', name: 'Nikhil', type: 'direct', memberIds: ['player', 'nikhil'], subtitle: 'Backend Developer · Last seen 3 days ago' },
  { id: 'bunty', name: 'Bunty (uninvited)', type: 'direct', memberIds: ['player', 'bunty'], subtitle: 'Unofficial technology consultant · Never shipped a product' },
];

export const initialMessages: ChatMessage[] = [
  { id: 'm1', channelId: 'general', senderId: 'kunal', senderName: 'Kunal', text: 'GOOD MORNING LEGENDS 🌞 Today is the day we change the industry. I made a playlist.', day: 1, time: '09:02', kind: 'funny' },
  { id: 'm2', channelId: 'general', senderId: 'aarav', senderName: 'Aarav', text: 'Homepage scaffold done. Took 11 minutes. AI is different bro.', day: 1, time: '09:14' },
  { id: 'm3', channelId: 'general', senderId: 'varun', senderName: 'Varun', text: 'Architecture is under control. I am thinking microservices.', day: 1, time: '09:18' },
  { id: 'm4', channelId: 'general', senderId: 'meera', senderName: 'Meera', text: 'The homepage scaffold has no working navigation. Logging this as a blocker.', day: 1, time: '09:20' },
  { id: 'm5', channelId: 'general', senderId: 'nikhil', senderName: 'Nikhil', text: 'seen', day: 1, time: '09:31', kind: 'funny' },
  { id: 'm6', channelId: 'project', senderId: 'aarav', senderName: 'Aarav', text: 'I pushed a quick UI. Don’t look at the package file.', day: 1, time: '10:04' },
  { id: 'm7', channelId: 'engineering', senderId: 'varun', senderName: 'Varun', text: 'We need a service layer, repository layer, adapter layer and possibly a layer for the layers.', day: 1, time: '10:12', kind: 'funny' },
  { id: 'm8', channelId: 'qa-room', senderId: 'meera', senderName: 'Meera', text: 'I have created 42 test cases. We have not yet received a working build.', day: 1, time: '10:40' },
  { id: 'm9', channelId: 'random', senderId: 'kunal', senderName: 'Kunal', text: 'Team lunch? Asking for culture.', day: 1, time: '11:05' },
  { id: 'm10', channelId: 'prakash', senderId: 'prakash', senderName: 'Mr. Prakash', text: 'Just checking. Can you also make it look like Swiggy? But simpler. And cheaper.', day: 1, time: '11:18', kind: 'client' },
  { id: 'm11', channelId: 'prakash', senderId: 'player', senderName: 'You', text: 'We’ll keep the first release focused on enquiries and your service catalogue. I’ll share a clear delivery scope.', day: 1, time: '11:21' },
  { id: 'm12', channelId: 'bunty', senderId: 'bunty', senderName: 'Bunty', text: 'Hi founder. I have a few suggestions. First: blockchain. Second: AI. Third: make the logo 3D. I have not seen the website yet.', day: 1, time: '11:24', kind: 'funny' },
];

export const initialDefects: Defect[] = [
  { id: 'bug-1', title: 'Enquiry button has no destination', description: 'The primary CTA looks clickable but does not open a WhatsApp enquiry.', severity: 'critical', area: 'WhatsApp flow', reportedBy: 'Meera', fixed: false, discoveredDay: 1 },
  { id: 'bug-2', title: 'Mobile navigation overlaps hero text', description: 'At 390px width the menu overlaps the page heading.', severity: 'major', area: 'Responsive UI', reportedBy: 'Meera', fixed: false, discoveredDay: 1 },
  { id: 'bug-3', title: 'Catalogue cards have inconsistent image ratios', description: 'Three cards jump in height and push the CTA out of alignment.', severity: 'minor', area: 'Catalogue', reportedBy: 'Meera', fixed: false, discoveredDay: 2 },
  { id: 'bug-4', title: 'Footer icon is 2px off-centre', description: 'An issue of the highest possible urgency, according to QA.', severity: 'cosmetic', area: 'Footer', reportedBy: 'Meera', fixed: false, discoveredDay: 2 },
];

export const campaignEvents: Record<number, GameEvent> = {
  1: {
    id: 'architecture', eyebrow: 'DAY 01 · 10:18 AM · ENGINEERING', title: 'A Microservices Proposal',
    body: 'Varun has opened a whiteboard and drawn 11 boxes. The proposed architecture has more services than the client has menu items. Aarav has already created a Vite app and is waiting for nobody.',
    character: 'Varun', characterRole: 'Technical Lead',
    choices: [
      { id: 'simplify', label: 'Ask for a working, simple architecture', hint: 'Reduce ceremony. Ask Varun to prove the integration plan.' },
      { id: 'approve', label: 'Approve the microservices architecture', hint: 'Impresses Varun. Adds technical debt and consumes time.' },
      { id: 'prototype', label: 'Ask Aarav for a working vertical slice', hint: 'See real progress before committing to architecture.' },
    ],
  },
  2: {
    id: 'ai_cooked', eyebrow: 'DAY 02 · 11:42 AM · REPOSITORY ALERT', title: '“Bro, AI Has Cooked”',
    body: 'Aarav announces that the entire frontend is done. Repo Studio shows 14 commits, 9 new dependencies and a button that confidently navigates to /undefined. He says the design is “basically production-ready”.',
    character: 'Aarav', characterRole: 'Full-stack Developer',
    choices: [
      { id: 'audit', label: 'Inspect the commits and request a proper review', hint: 'Find what is real. Reduce debt and expose the gaps.' },
      { id: 'ship_it', label: 'Trust the 14 commits and move on', hint: 'Save time now. Pay for it in integration and QA.' },
      { id: 'pair_aarav', label: 'Pair Aarav with Meera for a focused review', hint: 'Improve quality and reduce the QA rivalry slightly.' },
    ],
  },
  3: {
    id: 'scope_creep', eyebrow: 'DAY 03 · 09:26 AM · CLIENT BROWSER', title: 'One Small Requirement™',
    body: 'Mr. Prakash has sent a voice note. “Everything is lovely. Just one small addition: live order tracking, customer login, loyalty points, an AI chatbot and an app. Bunty says it is two hours.”',
    character: 'Mr. Prakash', characterRole: 'Client · Royal Feast Catering',
    choices: [
      { id: 'defer', label: 'Move the new requests to Phase 2', hint: 'Protect delivery. Explain the change-control process.' },
      { id: 'accept_scope', label: 'Accept the extra scope without changing the deadline', hint: 'Client is delighted. The team and timeline are not.' },
      { id: 'counter', label: 'Offer a paid change request and revised timeline', hint: 'Professional boundary. A little negotiation required.' },
    ],
  },
  4: {
    id: 'integration_hell', eyebrow: 'DAY 04 · 02:14 PM · BUILD MONITOR', title: 'Works on My Machine',
    body: 'The frontend expects /api/menu. The backend provides /api/products. Varun says the contract is correct. Aarav says the API is “not matching the vibe”. The build has failed in three different ways.',
    character: 'Meera', characterRole: 'QA Engineer',
    choices: [
      { id: 'pair_integration', label: 'Put Aarav and Varun in a pairing session', hint: 'Risk a lively argument. Improve integration and their respect.' },
      { id: 'simplify_integration', label: 'Cut the unnecessary API layer and simplify', hint: 'Reduce technical debt and get a working path sooner.' },
      { id: 'blame', label: 'Ask everyone to explain whose fault it is', hint: 'No progress. Morale takes a hit.' },
    ],
  },
  5: {
    id: 'qa_report', eyebrow: 'DAY 05 · 10:05 AM · QA LAB', title: 'Meera Has a Spreadsheet',
    body: 'Meera has found 23 defects. Two are critical. One is a 1px icon alignment issue. She has labelled the spreadsheet “Release blockers FINAL v3”. The client demo is approaching.',
    character: 'Meera', characterRole: 'QA Engineer',
    choices: [
      { id: 'fix_critical', label: 'Fix critical and major defects first', hint: 'Focus on functional quality. Keep the team aligned.' },
      { id: 'polish', label: 'Polish all visual details before anything else', hint: 'The UI gets prettier while core defects remain.' },
      { id: 'ask_meera', label: 'Ask Meera to rank defects by user impact', hint: 'Improve prioritisation and her trust in management.' },
    ],
  },
  6: {
    id: 'ghost_returns', eyebrow: 'DAY 06 · 09:51 AM · PRESENCE UPDATE', title: 'A Wild Nikhil Appears',
    body: 'Nikhil is online. His status says “deep work”. He has uploaded latest_actual_final_v6.zip and written “backend done”. It is 1.8MB. The team has questions. The file has no README.',
    character: 'Nikhil', characterRole: 'Backend Developer',
    choices: [
      { id: 'small_task', label: 'Give him one isolated task with a short checkpoint', hint: 'Use his skill without making delivery depend on him.' },
      { id: 'inspect_zip', label: 'Inspect the upload before accepting it', hint: 'Verify the work. Reveal his hidden trait.' },
      { id: 'confront_ghost', label: 'Confront him about the disappearing act', hint: 'Increase accountability, risk lower morale.' },
    ],
  },
  7: {
    id: 'demo_pressure', eyebrow: 'DAY 07 · 09:00 AM · CLIENT DEMO COUNTDOWN', title: 'The Client Is Already in the Waiting Room',
    body: 'Mr. Prakash has sent a calendar invite titled “Final demo + one tiny request”. Bunty has joined as optional attendee and made himself presenter. Meera has asked whether the build is frozen. Aarav is typing.',
    character: 'Mr. Prakash', characterRole: 'Client · Royal Feast Catering',
    choices: [
      { id: 'freeze_scope', label: 'Freeze scope. Only fix release blockers.', hint: 'Protect the build, improve confidence and stop new work.' },
      { id: 'last_feature', label: 'Accept Bunty’s loyalty-points feature', hint: 'The client is delighted. The deadline is not moving.' },
      { id: 'rehearse_demo', label: 'Rehearse the core journey with Meera', hint: 'Improve quality and demo readiness without expanding scope.' },
    ],
  },
};

export const employeeById = (id: string, employees: Employee[]) => employees.find((employee) => employee.id === id);
