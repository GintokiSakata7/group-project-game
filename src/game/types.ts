export type AppId =
  | 'hq'
  | 'chat'
  | 'repo'
  | 'sprint'
  | 'browser'
  | 'qa'
  | 'people'
  | 'finance'
  | 'files'
  | 'terminal'
  | 'preview'
  | 'music';

export type Phase =
  | 'title'
  | 'prologue'
  | 'negotiation'
  | 'client_meeting'
  | 'contract_signed'
  | 'kickoff_meeting'
  | 'office'
  | 'desktop'
  | 'live_demo'
  | 'game_over'
  | 'ending';
export type Availability = 'online' | 'busy' | 'offline' | 'afk';
export type TaskStatus = 'backlog' | 'assigned' | 'in_progress' | 'review' | 'done' | 'blocked';
export type TaskCategory = 'frontend' | 'backend' | 'design' | 'content' | 'testing' | 'deployment' | 'architecture';
export type Priority = 'low' | 'normal' | 'high' | 'critical';

export interface Employee {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  color: string;
  tagline: string;
  skills: Partial<Record<TaskCategory, number>>;
  reliability: number;
  morale: number;
  fatigue: number;
  ego: number;
  founderTrust: number;
  baseProductivity: number;
  availability: Availability;
  lastSeen: string;
  hiddenTrait: string;
  discovered: boolean;
  quirks: string[];
}

export interface Relationship {
  employeeA: string;
  employeeB: string;
  trust: number;
  respect: number;
  friction: number;
  label: string;
  history: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  effort: number;
  progress: number;
  reportedProgress: number;
  verifiedProgress: number;
  quality: number;
  assignedTo: string | null;
  priority: Priority;
  dependencies: string[];
  dueDay: number;
  status: TaskStatus;
  deliverable: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'group' | 'direct' | 'client';
  memberIds: string[];
  subtitle: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  text: string;
  day: number;
  time: string;
  kind?: 'system' | 'client' | 'funny' | 'normal';
}

export interface CommitRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  taskId: string;
  message: string;
  filesChanged: string[];
  additions: number;
  deletions: number;
  day: number;
  time: string;
  buildStatus: 'passed' | 'failed' | 'pending';
  testStatus: 'passed' | 'failed' | 'not_run';
  qualitySignal: number;
  detail: string;
}

export interface Defect {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'cosmetic';
  area: string;
  reportedBy: string;
  fixed: boolean;
  discoveredDay: number;
}

export interface GameMetrics {
  progress: number;
  quality: number;
  clientTrust: number;
  morale: number;
  technicalDebt: number;
  cash: number;
  scopeCreep: number;
  bugsOpen: number;
}

export interface DailyReport {
  day: number;
  headline: string;
  summary: string;
  completed: string[];
  incidents: string[];
  moraleDelta: number;
  progressDelta: number;
  qualityDelta: number;
}

export interface GameEventChoice {
  id: string;
  label: string;
  hint: string;
}

export interface GameEvent {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  character: string;
  characterRole: string;
  choices: GameEventChoice[];
}

export interface Ending {
  kind: 'negotiation' | 'cancelled' | 'deadline' | 'quality' | 'success';
  title: string;
  subtitle: string;
  body: string;
  rating?: string;
  score?: number;
  breakdown?: { label: string; score: number; detail: string }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  app: AppId;
  tone: 'info' | 'warning' | 'danger' | 'success';
  day: number;
  read: boolean;
}

export interface GameOverInfo {
  title: string;
  subtitle: string;
  body: string;
  reason: 'failed_negotiation' | 'insolvency' | 'client_fired';
}

export interface GameState {
  phase: Phase;
  companyName: string;
  clientName: string;
  projectName: string;
  contractValue: number;
  day: number;
  campaignSeed: number;
  actionsLeft: number;
  metrics: GameMetrics;
  employees: Employee[];
  relationships: Relationship[];
  tasks: ProjectTask[];
  channels: ChatChannel[];
  messages: ChatMessage[];
  commits: CommitRecord[];
  defects: Defect[];
  pendingEvent: GameEvent | null;
  notifications: NotificationItem[];
  dailyReports: DailyReport[];
  ending: Ending | null;
  gameOver: GameOverInfo | null;
  lastAction: string;
  tutorialSeen: boolean;
  scopeAccepted: string[];
  completedMissionIds: string[];
  roleAssignments: Record<string, string>;
  activeAppOnDesktop?: AppId | null;
}

export type ActionKind = 'code' | 'motivate' | 'pair' | 'audit' | 'client' | 'triage' | 'investigate';
