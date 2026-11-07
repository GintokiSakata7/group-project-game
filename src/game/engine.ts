import type { ChatMessage, CommitRecord, DailyReport, Employee, GameState, ProjectTask } from './types';

export const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const timeFor = (index: number) => {
  const minutes = 8 * 60 + 25 + index * 47;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
};

const commitText: Record<string, string[]> = {
  kunal: ['Update content draft and add positive energy', 'Add service descriptions (with enthusiasm)', 'Polish homepage copy and metadata'],
  aarav: ['Build UI quickly (review pending)', 'Refactor components and add three dependencies', 'Implement frontend flow; works on local machine'],
  varun: ['Update architecture documentation', 'Add service abstraction layer', 'Refine integration strategy'],
  meera: ['Add regression checks and edge cases', 'Document reproducible defects', 'Verify primary user flow'],
  nikhil: ['Upload backend module', 'Add enquiry endpoint (README coming soon)', 'Fix API response mapping'],
};

const fileByCategory: Record<string, string[]> = {
  frontend: ['src/pages/Home.tsx', 'src/components/ServiceCard.tsx', 'src/styles/responsive.css'],
  backend: ['src/api/enquiry.ts', 'src/services/contactService.ts', 'src/config/routes.ts'],
  content: ['src/content/services.ts', 'public/robots.txt', 'index.html'],
  architecture: ['README.md', 'docs/architecture.md', 'src/config/app.ts'],
  testing: ['tests/enquiry.test.ts', 'tests/responsive.spec.ts', 'qa/release-checklist.md'],
  deployment: ['vercel.json', '.env.example', 'docs/deployment.md'],
  design: ['src/styles/theme.css', 'public/assets/brand.svg'],
};

export interface DayResolution {
  employees: Employee[];
  tasks: ProjectTask[];
  commits: CommitRecord[];
  messages: ChatMessage[];
  progress: number;
  quality: number;
  morale: number;
  technicalDebt: number;
  report: DailyReport;
}

export function resolveDay(state: GameState): DayResolution {
  const random = seededRandom(state.campaignSeed + state.day * 173);
  const employees = state.employees.map((employee) => ({ ...employee }));
  const tasks = state.tasks.map((task) => ({ ...task }));
  const commits: CommitRecord[] = [];
  const messages: ChatMessage[] = [];
  const completedBefore = new Set(tasks.filter((task) => task.progress >= 99).map((task) => task.id));
  let debt = state.metrics.technicalDebt;

  employees.forEach((employee, employeeIndex) => {
    const assignedTasks = tasks.filter((candidate) => candidate.assignedTo === employee.id && candidate.progress < 100 && !['backlog', 'blocked', 'done', 'review'].includes(candidate.status));
    const priorityWeight: Record<ProjectTask['priority'], number> = { critical: 4, high: 3, normal: 2, low: 1 };
    const task = assignedTasks
      .filter((candidate) => (candidate.dependencies ?? []).every((dependency) => {
        const dependencyTask = tasks.find((item) => item.id === dependency);
        return !dependencyTask || dependencyTask.progress >= 45 || completedBefore.has(dependency);
      }))
      .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority] || a.dueDay - b.dueDay || b.progress - a.progress)[0];
    const attendanceChance = employee.id === 'nikhil' ? 0.25 : employee.reliability / 100;
    const attended = random() < attendanceChance;

    if (!attended) {
      employee.availability = 'offline';
      employee.lastSeen = employee.id === 'nikhil' ? 'Unknown' : 'Yesterday';
      employee.morale = clamp(employee.morale - (employee.id === 'nikhil' ? 0 : 2));
      if (employee.id === 'nikhil') {
        messages.push({ id: `d${state.day}-absent-${employee.id}`, channelId: 'general', senderId: 'system', senderName: 'ALMOSTOS', text: 'Nikhil did not check in. His calendar says “focus time”. The calendar has said that since Monday.', day: state.day, time: '10:02', kind: 'system' });
      } else if (task) {
        messages.push({ id: `d${state.day}-absent-${employee.id}`, channelId: 'project', senderId: employee.id, senderName: employee.name, text: 'Running a little behind. Will pick this up shortly.', day: state.day, time: '10:14' });
      }
      return;
    }

    employee.availability = employee.id === 'meera' ? 'online' : 'busy';
    employee.lastSeen = 'Now';
    employee.fatigue = clamp(employee.fatigue + 5);
    if (!task) {
      if (assignedTasks.length > 0) {
        const blocked = assignedTasks.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])[0];
        messages.push({ id: `d${state.day}-blocked-${employee.id}`, channelId: 'project', senderId: employee.id, senderName: employee.name, text: `Blocked on “${blocked.title}”. I checked the dependency graph. It checked me back.`, day: state.day, time: timeFor(employeeIndex) });
      } else {
        const idleLines: Record<string, string> = {
          kunal: 'I have aligned the team around a shared vision. The vision is still loading.',
          aarav: 'I can take another task. Current one is basically done (definition of basically may vary).',
          varun: 'I am reviewing the architecture. Again.',
          meera: 'I need a build to test. A screenshot is not a build.',
          nikhil: 'seen',
        };
        messages.push({ id: `d${state.day}-idle-${employee.id}`, channelId: 'general', senderId: employee.id, senderName: employee.name, text: idleLines[employee.id], day: state.day, time: timeFor(employeeIndex), kind: employee.id === 'kunal' ? 'funny' : 'normal' });
      }
      return;
    }

    const skill = (employee.skills[task.category] ?? 48) / 100;
    const moraleFactor = 0.72 + employee.morale / 300;
    const fatigueFactor = 1 - employee.fatigue / 180;
    const clarityFactor = task.description.length > 50 ? 1.05 : 0.82;
    const noise = 0.76 + random() * 0.46;
    let output = employee.baseProductivity * (0.48 + skill * 0.72) * moraleFactor * fatigueFactor * clarityFactor * noise;

    if (employee.id === 'aarav' && task.category === 'frontend') output *= 1.22;
    if (employee.id === 'varun' && task.category === 'architecture') output *= 1.17;
    if (employee.id === 'meera' && task.category === 'testing') output *= 1.38;
    if (employee.id === 'nikhil') output *= 1.12;
    if (employee.id === 'kunal' && task.category === 'content') output *= 1.18;
    if (task.id === 'integration') {
      const pairing = state.relationships.find((item) =>
        (item.employeeA === 'aarav' && item.employeeB === 'varun') ||
        (item.employeeA === 'varun' && item.employeeB === 'aarav'),
      );
      if (pairing && pairing.friction > 70) output *= 0.75;
      else if (pairing && pairing.friction > 50) output *= 0.9;
      else if (pairing) output *= 1.08;
    }

    // One simulated workday represents a meaningful slice of a small startup task.
    // The cap keeps even high-output employees from finishing an entire feature instantly.
    const progressGain = clamp(output * 2.0, 12, 42);
    task.progress = clamp(task.progress + progressGain);
    task.verifiedProgress = task.progress;
    const qualityGain = employee.id === 'aarav'
      ? 1.2 + skill * 2 - (debt > 55 ? 1.5 : 0)
      : employee.id === 'meera'
        ? 2.4
        : employee.id === 'varun'
          ? 1.5
          : 1.3 + skill;
    task.quality = clamp(task.quality + qualityGain);
    task.reportedProgress = clamp(task.progress + (employee.id === 'varun' ? 34 : employee.id === 'aarav' ? 12 : employee.id === 'nikhil' ? 7 : 0));
    task.status = task.progress >= 99 ? (task.category === 'testing' ? 'done' : 'review') : 'in_progress';

    if (employee.id === 'aarav' && random() < 0.58) debt = clamp(debt + 2.4);
    if (employee.id === 'varun' && task.category === 'architecture' && random() < 0.45) debt = clamp(debt + 1.5);
    if (employee.id === 'meera' && task.category === 'testing') debt = clamp(debt - 1.4);

    const commitOptions = commitText[employee.id] ?? ['Update project files'];
    const title = commitOptions[Math.floor(random() * commitOptions.length)];
    const fileOptions = fileByCategory[task.category] ?? ['src/project/notes.md'];
    const qualitySignal = clamp(task.quality - debt * 0.22 + (employee.id === 'meera' ? 12 : 0));
    commits.push({
      id: `commit-${state.day}-${employee.id}-${commits.length + 1}`,
      employeeId: employee.id,
      employeeName: employee.name,
      taskId: task.id,
      message: title,
      filesChanged: [fileOptions[Math.floor(random() * fileOptions.length)]],
      additions: Math.floor(12 + random() * 92),
      deletions: Math.floor(random() * 28),
      day: state.day,
      time: timeFor(employeeIndex),
      buildStatus: qualitySignal < 48 || debt > 72 ? 'failed' : qualitySignal < 62 ? 'pending' : 'passed',
      testStatus: employee.id === 'meera' ? (qualitySignal > 58 ? 'passed' : 'failed') : 'not_run',
      qualitySignal,
      detail: `${employee.name} worked on “${task.title}”. Verified task progress is now ${Math.round(task.progress)}%. This is simulated repository evidence, not executable code.`,
    });

    if (employee.id === 'aarav') {
      messages.push({ id: `d${state.day}-dev-${employee.id}`, channelId: 'engineering', senderId: employee.id, senderName: employee.name, text: `Pushed ${Math.floor(3 + random() * 8)} commits. Please don't inspect all of them individually.`, day: state.day, time: timeFor(employeeIndex), kind: 'funny' });
    } else if (employee.id === 'varun') {
      messages.push({ id: `d${state.day}-dev-${employee.id}`, channelId: 'engineering', senderId: employee.id, senderName: employee.name, text: 'Integration is progressing according to the architecture. The architecture is also progressing.', day: state.day, time: timeFor(employeeIndex) });
    } else if (employee.id === 'meera') {
      messages.push({ id: `d${state.day}-dev-${employee.id}`, channelId: 'qa-room', senderId: employee.id, senderName: employee.name, text: 'I verified one flow and discovered two new edge cases. You are welcome.', day: state.day, time: timeFor(employeeIndex) });
    }
  });

  const progress = clamp(Math.round(tasks.filter((task) => task.deliverable).reduce((sum, task) => sum + task.progress, 0) / Math.max(1, tasks.filter((task) => task.deliverable).length)));
  const quality = clamp(Math.round(tasks.filter((task) => task.deliverable).reduce((sum, task) => sum + task.quality, 0) / Math.max(1, tasks.filter((task) => task.deliverable).length)));
  const morale = clamp(Math.round(employees.reduce((sum, employee) => sum + employee.morale, 0) / employees.length));
  const completed = tasks.filter((task) => task.progress >= 99).map((task) => task.title);
  const previousProgress = state.metrics.progress;
  const report: DailyReport = {
    day: state.day,
    headline: state.day === 1 ? 'The plan met reality.' : state.day === 6 ? 'The deadline has entered the chat.' : 'A productive day, depending on your definition.',
    summary: `${commits.length} employee contribution${commits.length === 1 ? '' : 's'} recorded. ${completed.length} task${completed.length === 1 ? '' : 's'} currently at 100%. ${employees.filter((employee) => employee.availability === 'offline').length} team member(s) did not check in.`,
    completed,
    incidents: [debt > 55 ? 'Technical debt is starting to show up in the build.' : 'No new architecture emergency. Yet.', employees.find((employee) => employee.id === 'nikhil')?.availability === 'offline' ? 'Nikhil remains an abstract concept.' : 'Nikhil left evidence of human activity.'],
    moraleDelta: morale - state.metrics.morale,
    progressDelta: progress - previousProgress,
    qualityDelta: quality - state.metrics.quality,
  };

  return { employees, tasks, commits, messages, progress, quality, morale, technicalDebt: debt, report };
}

export function calculateDeliveryScore(state: GameState) {
  const coreIds = [...new Set([...(state.scopeAccepted.length ? state.scopeAccepted : ['homepage', 'catalogue', 'whatsapp', 'contact', 'responsive', 'seo']), 'deployment'])];
  const coreTasks = coreIds.map((id) => state.tasks.find((task) => task.id === id)).filter((task): task is ProjectTask => Boolean(task));
  const coreDone = coreTasks.filter((task) => task.progress >= 75).length;
  const requiredCore = Math.max(1, Math.ceil(coreTasks.length * 0.7));
  const criticalOpen = state.defects.filter((defect) => !defect.fixed && defect.severity === 'critical').length;
  const quality = state.metrics.quality;
  const deadline = Math.round((coreDone / coreIds.length) * 40);
  const qualityScore = Math.round(quality * 0.25);
  const trust = Math.round(state.metrics.clientTrust * 0.15);
  const stability = Math.max(0, 15 - criticalOpen * 8 - Math.round(state.metrics.technicalDebt * 0.08));
  const team = Math.round(state.metrics.morale * 0.05);
  const total = Math.min(100, deadline + qualityScore + trust + stability + team);
  const defectDetail = criticalOpen === 0
    ? 'No critical defects remain open.'
    : criticalOpen === 1
      ? '1 critical defect remains open.'
      : `${criticalOpen} critical defects remain open.`;
  return {
    total,
    coreDone,
    coreTotal: coreTasks.length,
    requiredCore,
    criticalOpen,
    breakdown: [
      { label: 'Deliverable coverage', score: deadline, detail: `${coreDone} of ${coreIds.length} core deliverables reached 75%.` },
      { label: 'Product quality', score: qualityScore, detail: `Average verified quality: ${Math.round(quality)}%.` },
      { label: 'Client trust', score: trust, detail: `Client confidence: ${Math.round(state.metrics.clientTrust)}%.` },
      { label: 'Release stability', score: stability, detail: defectDetail },
      { label: 'Team health', score: team, detail: `Team morale: ${Math.round(state.metrics.morale)}%.` },
    ],
  };
}
