import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { initialChannels, initialDefects, initialEmployees, initialMessages, initialRelationships, initialTasks } from './data';
import { calculateDeliveryScore, clamp, resolveDay } from './engine';
import { founderMissions } from './missions';
import type { ActionKind, AppId, ChatMessage, Defect, Ending, GameEvent, GameOverInfo, GameState, NotificationItem, Phase, ProjectTask } from './types';

interface CampaignSetup {
  scopeAccepted: string[];
  negotiationScore: number;
  contractPrice: number;
}

interface GameStore extends GameState {
  setPhase: (phase: Phase) => void;
  beginPrologue: () => void;
  beginClientMeeting: () => void;
  beginNegotiation: () => void;
  triggerGameOver: (info: GameOverInfo) => void;
  goToOffice: () => void;
  openDesktop: (initialApp?: AppId) => void;
  startCampaign: (setup: CampaignSetup) => void;
  resetGame: () => void;
  performAction: (kind: ActionKind, targetId?: string) => void;
  assignTask: (taskId: string, employeeId: string | null) => void;
  approveTask: (taskId: string) => void;
  sendMessage: (channelId: string, text: string) => void;
  resolveEvent: (choiceId: string) => void;
  endDay: () => void;
  deliverProject: () => void;
  fixDefect: (defectId: string) => void;
  markNotificationsRead: () => void;
  discoverTrait: (employeeId: string) => void;
  dismissEvent: () => void;
  beginKickoffMeeting: () => void;
  completeKickoff: (assignments: Record<string, string>) => void;
  completeFounderMission: (missionId: string, choiceId: string) => void;
}

const makeMessage = (channelId: string, senderId: string, senderName: string, text: string, day: number, kind: ChatMessage['kind'] = 'normal'): ChatMessage => ({
  id: `msg-${day}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  channelId, senderId, senderName, text, day,
  time: day === 1 ? '09:00' : `${String(8 + Math.floor(Math.random() * 9)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  kind,
});

const makeNotification = (title: string, body: string, app: AppId, tone: NotificationItem['tone'], day: number): NotificationItem => ({
  id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title, body, app, tone, day, read: false,
});

const confrontationalFallback = (text: string) => /where were you|why didn't|why did you|late again|deadline|you promised/i.test(text);

const initialState = (): GameState => ({
  phase: 'title', companyName: 'PANIC LABS', clientName: 'Mr. Prakash', projectName: 'Royal Feast Digital Presence', contractValue: 5000, day: 1, campaignSeed: Math.floor(Math.random() * 1_000_000_000), actionsLeft: 5,
  metrics: { progress: 3, quality: 58, clientTrust: 74, morale: 72, technicalDebt: 12, cash: 2500, scopeCreep: 0, bugsOpen: 4 },
  employees: initialEmployees.map((employee) => ({ ...employee })),
  relationships: initialRelationships.map((relationship) => ({ ...relationship })),
  tasks: initialTasks.map((task) => ({ ...task })),
  channels: initialChannels.map((channel) => ({ ...channel })),
  messages: initialMessages.map((message) => ({ ...message })),
  commits: [], defects: initialDefects.map((defect) => ({ ...defect })),
  pendingEvent: null, notifications: [], dailyReports: [], ending: null, gameOver: null, lastAction: '', tutorialSeen: false, scopeAccepted: ['homepage', 'catalogue', 'whatsapp', 'contact', 'responsive', 'seo'],
  completedMissionIds: [], roleAssignments: { kunal: 'communication', aarav: 'frontend', varun: 'technical', meera: 'quality', nikhil: 'backend' },
});

const endingFor = (kind: Ending['kind'], title: string, subtitle: string, body: string, score?: number): Ending => ({ kind, title, subtitle, body, score });

const safeStorage = (() => {
  const memoryStore = new Map<string, string>();
  return {
    getItem: (key: string): string | null => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const val = window.localStorage.getItem(key);
          if (val !== null) return val;
        }
      } catch (e) {
        console.warn('localStorage.getItem unavailable, using memory store', e);
      }
      return memoryStore.get(key) ?? null;
    },
    setItem: (key: string, value: string): void => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
      } catch (e) {
        console.warn('localStorage.setItem unavailable, using memory store', e);
      }
      memoryStore.set(key, value);
    },
    removeItem: (key: string): void => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
      } catch (e) {
        console.warn('localStorage.removeItem unavailable, using memory store', e);
      }
      memoryStore.delete(key);
    },
  };
})();

export const useGameStore = create<GameStore>()(persist((set, get) => ({
  ...initialState(),

  setPhase: (phase) => set({ phase }),
  beginPrologue: () => set({ ...initialState(), phase: 'prologue' }),
  beginClientMeeting: () => set({ phase: 'client_meeting' }),
  beginNegotiation: () => set({ phase: 'client_meeting' }),
  triggerGameOver: (info) => set({ phase: 'game_over', gameOver: info }),
  goToOffice: () => set({ phase: 'office' }),
  beginKickoffMeeting: () => set({ phase: 'kickoff_meeting' }),
  openDesktop: (initialApp) => set({ phase: 'desktop', activeAppOnDesktop: initialApp ?? null }),

  startCampaign: (setup) => {
    const price = setup.contractPrice;
    const companyName = get().companyName || 'PANIC LABS';
    const fresh = initialState();
    set({
      ...fresh,
      companyName,
      phase: 'contract_signed',
      contractValue: price,
      day: 1,
      actionsLeft: 5,
      metrics: { ...fresh.metrics, cash: Math.max(500, Math.round(price * 0.5)), clientTrust: clamp(68 + setup.negotiationScore * 0.22), progress: 3 },
      scopeAccepted: setup.scopeAccepted,
      pendingEvent: null,
      notifications: [makeNotification('CONTRACT SIGNED', `Royal Feast is officially on the board. ₹${price.toLocaleString('en-IN')} project value. Seven days. Five employees. Deep breaths.`, 'browser', 'success', 1)],
      messages: [
        ...fresh.messages,
        makeMessage('general', 'system', 'ALMOSTOS', 'New project workspace created: ROYAL FEAST. Deadline: 7 days. Management actions available: 3/day.', 1, 'system'),
        makeMessage('general', 'kunal', 'Kunal', 'WE GOT A CLIENT!!! I am making a celebration playlist. Nobody panic. (I am panicking.)', 1, 'funny'),
        makeMessage('general', 'varun', 'Varun', 'I will lead the technical workstream. The architecture is already 90% complete.', 1, 'funny'),
        makeMessage('general', 'meera', 'Meera', 'Please define acceptance criteria before anyone says 90%.', 1),
        makeMessage('general', 'aarav', 'Aarav', 'I have scaffolded the project. It has 11 dependencies and one button. We are moving.', 1, 'funny'),
        makeMessage('general', 'nikhil', 'Nikhil', 'seen', 1),
      ],
    });
  },

  completeKickoff: (assignments) => {
    const state = get();
    if (state.phase !== 'kickoff_meeting') return;
    const taskOwners: Record<string, string[]> = {
      communication: ['contact', 'seo', 'presentation'],
      frontend: ['homepage', 'catalogue', 'responsive'],
      technical: ['architecture', 'integration'],
      quality: ['qa'],
      backend: ['whatsapp', 'deployment'],
    };
    const alwaysNeeded = new Set(['deployment', 'qa', 'integration', 'architecture', 'presentation']);
    const tasks = state.tasks.map((task) => {
      const inScope = state.scopeAccepted.includes(task.id) || alwaysNeeded.has(task.id);
      if (!inScope) return { ...task, assignedTo: null, status: 'backlog' as const, deliverable: false };
      const owner = Object.entries(assignments).find(([, workstream]) => taskOwners[workstream]?.includes(task.id))?.[0];
      const isContractDeliverable = state.scopeAccepted.includes(task.id) || task.id === 'deployment';
      return owner ? { ...task, assignedTo: owner, deliverable: isContractDeliverable, status: task.progress > 0 ? 'in_progress' as const : 'assigned' as const } : { ...task, deliverable: isContractDeliverable };
    });
    const employeeLines: Record<string, string> = {
      kunal: 'I have accepted responsibility for client communication. I will also be the emotional support department.',
      aarav: 'Frontend assigned. I have already created the component. It renders a div. Big day.',
      varun: 'Technical ownership confirmed. I will send the architecture after I finish the architecture of the architecture.',
      meera: 'QA ownership confirmed. Please stop merging directly to main. I am begging.',
      nikhil: 'backend assigned. will send progress when network permits.',
    };
    const messages = [...state.messages, makeMessage('general', 'system', 'ALMOSTOS', 'Kickoff meeting closed. Workstream ownership has been recorded. The deadline is now real.', 1, 'system'), ...Object.entries(assignments).map(([id]) => makeMessage('general', id, state.employees.find((e) => e.id === id)?.name ?? id, employeeLines[id] ?? 'Assignment received.', 1, 'funny'))];
    set({ phase: 'office', roleAssignments: assignments, tasks, messages, lastAction: 'Kickoff meeting completed. Day 1 is ready.' });
  },

  completeFounderMission: (missionId, choiceId) => {
    const state = get();
    if (state.phase !== 'office' && state.phase !== 'desktop') return;
    if (state.completedMissionIds.includes(missionId)) return;
    const mission = founderMissions.find((item) => item.id === missionId && item.day === state.day);
    const choice = mission?.choices.find((item) => item.id === choiceId);
    if (!mission || !choice) return;
    const effects = choice.effects;
    const metrics = { ...state.metrics };
    (['progress', 'quality', 'clientTrust', 'morale', 'technicalDebt', 'scopeCreep'] as const).forEach((key) => {
      const delta = effects[key];
      if (typeof delta === 'number') metrics[key] = clamp(metrics[key] + delta);
    });
    if (typeof effects.cash === 'number') metrics.cash = Math.max(0, metrics.cash + effects.cash);
    const employees = state.employees.map((employee) => ({
      ...employee,
      morale: clamp(employee.morale + (effects.employeeMorale?.[employee.id] ?? 0)),
      fatigue: clamp(employee.fatigue + (effects.employeeFatigue?.[employee.id] ?? 0)),
    }));
    const tasks = state.tasks.map((task) => {
      const progressDelta = effects.taskProgress?.[task.id] ?? 0;
      const qualityDelta = effects.taskQuality?.[task.id] ?? 0;
      const progress = clamp(task.progress + progressDelta);
      return {
        ...task, progress, verifiedProgress: clamp(task.verifiedProgress + progressDelta),
        reportedProgress: clamp(task.reportedProgress + progressDelta), quality: clamp(task.quality + qualityDelta),
        status: progress >= 99 ? 'review' as const : progress > 0 ? 'in_progress' as const : task.status,
      };
    });
    const defects = state.defects.map((defect) => effects.fixDefects?.includes(defect.id) ? { ...defect, fixed: true } : defect);
    metrics.progress = clamp(Math.round(metrics.progress));
    metrics.morale = clamp(Math.round(employees.reduce((sum, employee) => sum + employee.morale, 0) / employees.length));
    metrics.bugsOpen = defects.filter((defect) => !defect.fixed).length;
    const missionMessage = choice.chatLine ?? choice.reaction;
    const channel = mission.character === 'prakash' || mission.character === 'bunty' ? 'prakash' : 'general';
    const senderName = mission.character === 'prakash' ? 'Mr. Prakash' : mission.character === 'bunty' ? 'Bunty' : employees.find((employee) => employee.id === mission.character)?.name ?? mission.character;
    const message = makeMessage(channel, mission.character, senderName, missionMessage, state.day, mission.character === 'prakash' || mission.character === 'bunty' ? 'client' : 'funny');
    const notification = makeNotification(`MISSION COMPLETE · ${mission.title}`, choice.reaction, 'hq', 'success', state.day);
    set({
      metrics, employees, tasks, defects,
      completedMissionIds: [...state.completedMissionIds, missionId],
      messages: [...state.messages, message],
      notifications: [notification, ...state.notifications].slice(0, 30),
      lastAction: `Mission complete: ${mission.title}`,
    });
  },

  resetGame: () => set(initialState()),

  performAction: (kind, targetId) => {
    const state = get();
    if ((state.phase !== 'desktop' && state.phase !== 'office') || state.actionsLeft <= 0) return;
    let employees = state.employees.map((employee) => ({ ...employee }));
    let tasks = state.tasks.map((task) => ({ ...task }));
    let metrics = { ...state.metrics };
    let relationships = state.relationships.map((relationship) => ({ ...relationship }));
    let defects = state.defects.map((defect) => ({ ...defect }));
    let message: ChatMessage | null = null;
    let notification: NotificationItem | null = null;
    let lastAction = '';

    if (kind === 'code') {
      const task = tasks.find((item) => item.id === targetId);
      if (!task) return;
      const gain = task.category === 'testing' ? 10 : 15;
      task.progress = clamp(task.progress + gain);
      task.verifiedProgress = task.progress;
      task.reportedProgress = task.progress;
      task.quality = clamp(task.quality + 3);
      task.status = task.progress >= 99 ? 'review' : 'in_progress';
      metrics.technicalDebt = clamp(metrics.technicalDebt + 1);
      lastAction = `You personally contributed to ${task.title}.`;
      message = makeMessage('project', 'player', 'You', `I took a pass at “${task.title}”. Verified progress is now ${Math.round(task.progress)}%.`, state.day);
      notification = makeNotification('PLAYER CONTRIBUTION', `${task.title} moved forward by ${gain}%.`, 'repo', 'success', state.day);
    } else if (kind === 'motivate') {
      const employee = employees.find((item) => item.id === targetId);
      if (!employee) return;
      employee.morale = clamp(employee.morale + 13);
      employee.founderTrust = clamp(employee.founderTrust + 5);
      employee.fatigue = clamp(employee.fatigue + 2);
      const relationship = relationships.find((item) => item.employeeA === employee.id || item.employeeB === employee.id);
      if (relationship) relationship.trust = clamp(relationship.trust + 3);
      metrics.morale = clamp(Math.round(employees.reduce((sum, item) => sum + item.morale, 0) / employees.length));
      lastAction = `You checked in with ${employee.name}. Morale improved; the group chat may become louder.`;
      message = makeMessage(employee.id, 'player', 'You', 'Quick check-in. Need anything from me to unblock your work?', state.day);
      notification = makeNotification('TEAM CHECK-IN', `${employee.name} appreciated the attention. Mostly.`, 'people', 'success', state.day);
    } else if (kind === 'pair') {
      const employee = employees.find((item) => item.id === targetId);
      if (!employee) return;
      const task = tasks.find((item) => item.assignedTo === employee.id && item.progress < 100);
      if (!task) return;
      task.progress = clamp(task.progress + 13);
      task.verifiedProgress = task.progress;
      task.reportedProgress = task.progress;
      task.quality = clamp(task.quality + 7);
      task.status = task.progress >= 99 ? 'review' : 'in_progress';
      employee.morale = clamp(employee.morale + 4);
      employee.founderTrust = clamp(employee.founderTrust + 3);
      employee.fatigue = clamp(employee.fatigue + 4);
      const relation = relationships.find((item) => item.employeeA === employee.id || item.employeeB === employee.id);
      if (relation) relation.trust = clamp(relation.trust + 4);
      lastAction = `You paired with ${employee.name} on ${task.title}.`;
      message = makeMessage('engineering', 'player', 'You', `Let's work through ${task.title} together. Show me the running version, not the diagram.`, state.day);
      notification = makeNotification('PAIRING SESSION', `${task.title} gained progress and quality.`, 'sprint', 'success', state.day);
    } else if (kind === 'audit' || kind === 'investigate') {
      const task = tasks.find((item) => item.id === targetId) ?? tasks.find((item) => item.assignedTo === 'varun');
      if (!task) return;
      const reported = task.reportedProgress;
      const verified = task.verifiedProgress;
      task.reportedProgress = verified;
      if (reported - verified > 20) {
        const employee = employees.find((item) => item.id === task.assignedTo);
        if (employee) employee.discovered = true;
        metrics.technicalDebt = clamp(metrics.technicalDebt - 5);
        lastAction = `Audit exposed a ${Math.round(reported - verified)} point reporting gap on ${task.title}.`;
        message = makeMessage('engineering', 'player', 'You', `I checked the actual evidence for ${task.title}. Please report verified progress, not vibes.`, state.day);
        notification = makeNotification('CLAIM VS EVIDENCE', `Reported ${Math.round(reported)}%; verified ${Math.round(verified)}%. Audit trail updated.`, 'repo', 'warning', state.day);
      } else {
        task.quality = clamp(task.quality + 7);
        lastAction = `You reviewed ${task.title}; the evidence checks out.`;
        notification = makeNotification('REVIEW COMPLETE', `${task.title} passed your review.`, 'repo', 'success', state.day);
      }
    } else if (kind === 'client') {
      metrics.clientTrust = clamp(metrics.clientTrust + 8);
      lastAction = 'You proactively updated the client with a realistic progress summary.';
      message = makeMessage('prakash', 'player', 'You', 'Quick update: the agreed Phase 1 scope remains our priority. I’ll flag any change that affects the delivery date before committing to it.', state.day);
      notification = makeNotification('CLIENT UPDATED', 'Trust improved. No new feature was accidentally promised.', 'browser', 'success', state.day);
    } else if (kind === 'triage') {
      const defect = defects.find((item) => item.id === targetId && !item.fixed);
      if (!defect) return;
      defect.fixed = true;
      metrics.quality = clamp(metrics.quality + (defect.severity === 'critical' ? 8 : defect.severity === 'major' ? 5 : 2));
      metrics.technicalDebt = clamp(metrics.technicalDebt - 2);
      lastAction = `You prioritised and resolved: ${defect.title}.`;
      message = makeMessage('qa-room', 'player', 'You', `Fix verified: ${defect.title}. Please run the relevant regression check.`, state.day);
      notification = makeNotification('DEFECT RESOLVED', `${defect.title} marked fixed.`, 'qa', 'success', state.day);
    }

    const deliverable = tasks.filter((task) => task.deliverable);
    metrics.progress = clamp(Math.round(deliverable.reduce((sum, task) => sum + task.progress, 0) / Math.max(1, deliverable.length)));
    metrics.quality = clamp(Math.round((metrics.quality * 0.78) + (deliverable.reduce((sum, task) => sum + task.quality, 0) / Math.max(1, deliverable.length)) * 0.22));
    metrics.bugsOpen = defects.filter((defect) => !defect.fixed).length;
    const nextMessages = message ? [...state.messages, message] : state.messages;
    const nextNotifications = notification ? [notification, ...state.notifications].slice(0, 30) : state.notifications;
    set({ employees, tasks, metrics, relationships, defects, messages: nextMessages, notifications: nextNotifications, actionsLeft: state.actionsLeft - 1, lastAction });
  },

  assignTask: (taskId, employeeId) => {
    const state = get();
    if (state.phase !== 'desktop' && state.phase !== 'office') return;
    const existing = state.tasks.find((task) => task.id === taskId);
    if (!existing || existing.status === 'done' || existing.assignedTo === employeeId) return;
    if (employeeId && !state.employees.some((employee) => employee.id === employeeId)) return;
    // Initial assignment of an unowned task is part of daily planning. Changing an owner costs an action.
    const costsAction = existing.assignedTo !== null;
    if (costsAction && state.actionsLeft <= 0) return;
    const tasks = state.tasks.map((task) => task.id === taskId ? { ...task, assignedTo: employeeId, status: (employeeId ? (task.progress > 0 ? 'in_progress' : 'assigned') : 'backlog') as ProjectTask['status'] } : task);
    const employeeName = state.employees.find((employee) => employee.id === employeeId)?.name ?? 'Unassigned';
    const message = makeMessage('project', 'system', 'ALMOSTOS', `${existing.title} ${costsAction ? 'reassigned' : 'assigned'} to ${employeeName}. ${employeeName === 'Nikhil' ? 'A delivery confirmation is not included.' : 'Ownership has been recorded.'}`, state.day, 'system');
    set({ tasks, actionsLeft: Math.max(0, state.actionsLeft - (costsAction ? 1 : 0)), messages: [...state.messages, message], lastAction: `${costsAction ? 'Reassigned' : 'Assigned'} ${existing.title}.` });
  },

  approveTask: (taskId) => {
    const state = get();
    if ((state.phase !== 'desktop' && state.phase !== 'office') || state.actionsLeft <= 0) return;
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task || task.status === 'done' || task.progress < 85 || task.quality < 42) return;
    const tasks = state.tasks.map((item) => item.id === taskId ? { ...item, status: 'done' as const } : item);
    const deliverables = tasks.filter((item) => item.deliverable);
    const metrics = {
      ...state.metrics,
      progress: clamp(Math.round(deliverables.reduce((sum, item) => sum + item.verifiedProgress, 0) / Math.max(1, deliverables.length))),
    };
    const message = makeMessage('project', 'player', 'You', `Approved ${task.title}. The evidence has been reviewed; the task is now accepted.`, state.day, 'system');
    set({ tasks, metrics, actionsLeft: state.actionsLeft - 1, lastAction: `You approved ${task.title} after reviewing the evidence.`, messages: [...state.messages, message] });
  },

  sendMessage: (channelId, text) => {
    const state = get();
    const clean = text.trim();
    if (!clean) return;
    const channel = state.channels.find((item) => item.id === channelId);
    if (!channel) return;

    const lower = clean.toLowerCase();
    const metrics = { ...state.metrics };
    const relationships = state.relationships.map((item) => ({ ...item }));
    const employees = state.employees.map((item) => ({ ...item }));
    const messages = [...state.messages, makeMessage(channelId, 'player', 'You', clean, state.day)];
    const addReply = (senderId: string, senderName: string, body: string, kind: ChatMessage['kind'] = 'normal') => {
      messages.push(makeMessage(channelId, senderId, senderName, body, state.day, kind));
    };

    if (channel.type === 'client') {
      if (lower.includes('phase 2') || lower.includes('scope') || lower.includes('timeline') || lower.includes('agreed') || lower.includes('change request')) {
        metrics.clientTrust = clamp(metrics.clientTrust + 2);
        addReply('prakash', 'Mr. Prakash', 'Okay, okay. Send me the revised list. I will discuss it with Bunty. He is very technical.', 'client');
      } else if (lower.includes('yes') || lower.includes('sure') || lower.includes('can do') || lower.includes('everything')) {
        metrics.clientTrust = clamp(metrics.clientTrust + 1);
        metrics.scopeCreep = clamp(metrics.scopeCreep + 5);
        metrics.technicalDebt = clamp(metrics.technicalDebt + 2);
        addReply('prakash', 'Mr. Prakash', 'Excellent. I knew you could do it. One more small thing...', 'client');
      } else if (lower.includes('no') || lower.includes('cannot') || lower.includes("can't") || lower.includes('not included')) {
        metrics.clientTrust = clamp(metrics.clientTrust - 3);
        addReply('prakash', 'Mr. Prakash', 'Hmm. Let me ask Bunty. He says it should be possible with a plugin.', 'client');
      } else if (lower.includes('preview') || lower.includes('progress') || lower.includes('ready')) {
        metrics.clientTrust = clamp(metrics.clientTrust + 3);
        addReply('prakash', 'Mr. Prakash', 'Thank you for the update. The website is looking promising. Please make the logo a little bigger. My wife mentioned it.', 'client');
      } else {
        addReply('prakash', 'Mr. Prakash', 'Understood. Please keep me updated. Also, can the logo be a little bigger?', 'client');
      }
    } else if (channel.type === 'direct') {
      const employee = employees.find((item) => item.id === channelId);
      if (employee) {
        const supportive = /thanks|appreciate|good work|great job|well done|nice work|how can i help|need anything|you handled/i.test(clean);
        const confrontational = /where were you|why didn't|why did you|late again|this is wrong|not acceptable|deadline|you promised/i.test(clean);
        employee.founderTrust = clamp(employee.founderTrust + (supportive ? 4 : confrontational ? -3 : 1));
        employee.morale = clamp(employee.morale + (supportive ? 2 : confrontational ? -2 : 0));
        metrics.morale = clamp(Math.round(employees.reduce((sum, item) => sum + item.morale, 0) / employees.length));
      }

      const replies: Record<string, string> = {
        kunal: lower.includes('work') || lower.includes('task')
          ? 'Absolutely. I can take ownership. I will send a structured update after I finish aligning the team.'
          : 'Absolutely. I am aligned. Shall I schedule a quick alignment call about the alignment?',
        aarav: lower.includes('test') || lower.includes('review')
          ? 'Sure bro. I pushed a fix. Meera may find 12 more, but that is a tomorrow problem.'
          : 'Got it bro. Pushing a fix. If the build breaks, it was already like that.',
        varun: lower.includes('demo') || lower.includes('show') || lower.includes('prove')
          ? 'I can share a working demonstration. Give me a moment to locate the branch that contains the implementation.'
          : 'Acknowledged. I will update the technical documentation and provide a status.',
        meera: lower.includes('priority') || lower.includes('critical')
          ? 'Thank you. I have sorted the defects by user impact. The 1px issue has been placed in emotional support.'
          : 'Please attach the build and acceptance criteria. I will test the actual behaviour.',
        nikhil: confrontationalFallback(lower)
          ? 'Network issue. Will send tonight.'
          : 'will do',
        bunty: 'I have discussed this with my cousin. He says we can add blockchain in the footer. It is very lightweight.',
      };
      addReply(channelId, channel.name, replies[channelId] ?? 'Noted.', channelId === 'bunty' ? 'funny' : 'normal');

      if (channelId === 'bunty' && /yes|sure|good idea|add it|blockchain|ai/i.test(clean)) {
        metrics.scopeCreep = clamp(metrics.scopeCreep + 4);
        metrics.technicalDebt = clamp(metrics.technicalDebt + 2);
      }
    } else if (channelId === 'random') {
      addReply('kunal', 'Kunal', 'This is why culture matters. Great message, founder. I have made a playlist for this conversation.', 'funny');
      if (lower.includes('lunch') || lower.includes('food')) addReply('aarav', 'Aarav', 'I can build a lunch ordering app before the food arrives.', 'funny');
    } else if (channelId === 'engineering') {
      const pair = relationships.find((item) => (item.employeeA === 'aarav' && item.employeeB === 'varun') || (item.employeeA === 'varun' && item.employeeB === 'aarav'));
      if (pair && /pair|together|collaborat|work with/i.test(lower)) {
        pair.friction = clamp(pair.friction - 5);
        pair.respect = clamp(pair.respect + 3);
        addReply('aarav', 'Aarav', 'Fine. I will pair with Varun. But if he opens another architecture diagram, I am opening a new career.', 'funny');
        addReply('varun', 'Varun', 'I have prepared a lightweight diagram. It has only four boxes. We are making progress.', 'funny');
      } else if (pair && /blame|fault|who broke|not my|your code/i.test(lower)) {
        pair.friction = clamp(pair.friction + 5);
        pair.trust = clamp(pair.trust - 2);
        addReply('varun', 'Varun', 'For the record, the architecture was correct. The implementation chose a different career path.');
        addReply('aarav', 'Aarav', 'The endpoint name was /products-v2-final. I did not invent the laws of physics.', 'funny');
      } else if (/api|integration|backend|build|endpoint/i.test(lower)) {
        addReply('varun', 'Varun', 'The integration contract is documented. Please check the latest documentation version.', 'normal');
        addReply('aarav', 'Aarav', 'The documentation says /api/menu. The backend says /api/products. They are in a long-distance relationship.', 'funny');
      } else {
        addReply('aarav', 'Aarav', 'I am on it bro. Define “it” and I can make it 60% complete.', 'funny');
      }
    } else if (channelId === 'qa-room') {
      if (/skip|ignore|later|minor|cosmetic/i.test(lower)) {
        addReply('meera', 'Meera', 'I have marked that as deferred. It is not deleted from my memory or the spreadsheet.', 'funny');
      } else {
        addReply('meera', 'Meera', 'Please provide a reproducible build, expected behaviour and actual behaviour. I have a fresh tab open.', 'normal');
      }
    } else {
      if (/meeting|sync|stand.?up|call/i.test(lower)) {
        addReply('kunal', 'Kunal', 'I have scheduled a 15-minute sync. The calendar says 45 minutes. I am working on it.', 'funny');
      } else if (/nikhil|ghost|online/i.test(lower)) {
        addReply('nikhil', 'Nikhil', 'seen', 'funny');
        addReply('kunal', 'Kunal', 'He is online! Everybody act natural.', 'funny');
      } else if (/deadline|deliver|ship|finish/i.test(lower)) {
        addReply('meera', 'Meera', 'I need the release candidate and acceptance criteria before anyone declares victory.', 'normal');
        addReply('aarav', 'Aarav', 'It is basically done. I am defining basically as “the page loads”.', 'funny');
      } else {
        addReply('kunal', 'Kunal', 'Love the initiative. I will capture this in the meeting notes and the meeting notes about the meeting notes.', 'funny');
      }
    }

    set({ messages, metrics, relationships, employees, lastAction: `You sent a message in #${channel.name}.` });
  },

  resolveEvent: (choiceId) => {
    const state = get();
    const event = state.pendingEvent;
    if (!event || !event.choices.some((choice) => choice.id === choiceId)) return;
    let metrics = { ...state.metrics };
    let tasks = state.tasks.map((task) => ({ ...task }));
    let employees = state.employees.map((employee) => ({ ...employee }));
    let relationships = state.relationships.map((relationship) => ({ ...relationship }));
    let defects = state.defects.map((defect) => ({ ...defect }));
    let messages = [...state.messages];
    let notifications = [...state.notifications];
    const addChat = (channel: string, sender: string, name: string, text: string, kind: ChatMessage['kind'] = 'normal') => messages.push(makeMessage(channel, sender, name, text, state.day, kind));
    const relation = (a: string, b: string) => relationships.find((item) => (item.employeeA === a && item.employeeB === b) || (item.employeeA === b && item.employeeB === a));

    switch (event.id) {
      case 'architecture':
        if (choiceId === 'simplify') {
          metrics.technicalDebt = clamp(metrics.technicalDebt - 7);
          const task = tasks.find((item) => item.id === 'architecture');
          if (task) { task.progress = clamp(task.progress + 20); task.verifiedProgress = task.progress; task.reportedProgress = task.progress; }
          addChat('engineering', 'varun', 'Varun', 'I have reduced the architecture to one sensible flow. It only hurt a little.', 'funny');
        } else if (choiceId === 'approve') {
          metrics.technicalDebt = clamp(metrics.technicalDebt + 15);
          employees.find((item) => item.id === 'varun')!.morale = clamp(employees.find((item) => item.id === 'varun')!.morale + 10);
          addChat('engineering', 'varun', 'Varun', 'The service mesh is approved. We are now enterprise-ready. The client has 11 menu items.', 'funny');
        } else {
          const task = tasks.find((item) => item.id === 'homepage');
          if (task) { task.progress = clamp(task.progress + 9); task.verifiedProgress = task.progress; }
          employees.find((item) => item.id === 'aarav')!.morale = clamp(employees.find((item) => item.id === 'aarav')!.morale + 4);
          addChat('project', 'aarav', 'Aarav', 'Vertical slice is up. It has one route and a confident button.', 'funny');
        }
        break;
      case 'ai_cooked':
        if (choiceId === 'audit') {
          metrics.technicalDebt = clamp(metrics.technicalDebt - 8);
          tasks.find((item) => item.id === 'homepage')!.quality = clamp(tasks.find((item) => item.id === 'homepage')!.quality + 8);
          employees.find((item) => item.id === 'aarav')!.discovered = true;
          addChat('engineering', 'meera', 'Meera', 'Thank you for asking for evidence. I have a list. It is not short.', 'funny');
        } else if (choiceId === 'ship_it') {
          metrics.technicalDebt = clamp(metrics.technicalDebt + 17);
          metrics.quality = clamp(metrics.quality - 7);
          addChat('qa-room', 'meera', 'Meera', 'I am recording “trust the vibes” as the release strategy.', 'funny');
        } else {
          tasks.find((item) => item.id === 'homepage')!.quality = clamp(tasks.find((item) => item.id === 'homepage')!.quality + 10);
          const rel = relation('aarav', 'meera'); if (rel) rel.friction = clamp(rel.friction - 12);
          addChat('qa-room', 'aarav', 'Aarav', 'Meera found actual bugs. I hate that this is useful.', 'funny');
        }
        break;
      case 'scope_creep':
        if (choiceId === 'defer') {
          metrics.clientTrust = clamp(metrics.clientTrust + 5);
          addChat('prakash', 'prakash', 'Mr. Prakash', 'Fine. Put the app and AI in Phase 2. But please make the website look premium.', 'client');
        } else if (choiceId === 'accept_scope') {
          metrics.clientTrust = clamp(metrics.clientTrust + 8);
          metrics.scopeCreep = clamp(metrics.scopeCreep + 24);
          metrics.technicalDebt = clamp(metrics.technicalDebt + 10);
          tasks.push({ id: 'live-tracking', title: 'Live order tracking (surprise scope)', description: 'A new request accepted without a revised deadline.', category: 'backend', effort: 9, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 25, assignedTo: 'nikhil', priority: 'critical', dependencies: ['whatsapp'], dueDay: 7, status: 'assigned', deliverable: true });
          addChat('general', 'kunal', 'Kunal', 'The client is excited. We should be excited. Why is everyone quiet?', 'funny');
        } else {
          metrics.clientTrust = clamp(metrics.clientTrust + 3);
          metrics.cash = clamp(metrics.cash + 500, 0, 999999);
          addChat('prakash', 'prakash', 'Mr. Prakash', 'Okay. I will approve a small change request. Bunty says live tracking is “just a map”.', 'client');
        }
        break;
      case 'integration_hell':
        if (choiceId === 'pair_integration') {
          const rel = relation('aarav', 'varun'); if (rel) { rel.respect = clamp(rel.respect + 12); rel.friction = clamp(rel.friction - 8); }
          const task = tasks.find((item) => item.id === 'integration'); if (task) { task.progress = clamp(task.progress + 15); task.verifiedProgress = task.progress; task.quality = clamp(task.quality + 8); }
          addChat('engineering', 'aarav', 'Aarav', 'Varun and I agree on one thing: the endpoint names were terrible.', 'funny');
        } else if (choiceId === 'simplify_integration') {
          metrics.technicalDebt = clamp(metrics.technicalDebt - 14);
          const task = tasks.find((item) => item.id === 'integration'); if (task) { task.progress = clamp(task.progress + 18); task.verifiedProgress = task.progress; }
          addChat('engineering', 'varun', 'Varun', 'We removed two abstraction layers. I have updated the architecture diagram to show their funeral.', 'funny');
        } else {
          metrics.morale = clamp(metrics.morale - 12);
          employees.forEach((employee) => { employee.morale = clamp(employee.morale - 8); });
          const rel = relation('aarav', 'varun'); if (rel) rel.friction = clamp(rel.friction + 12);
          addChat('general', 'meera', 'Meera', 'We have successfully identified the problem: we are in a meeting.', 'funny');
        }
        break;
      case 'qa_report':
        if (choiceId === 'fix_critical') {
          defects = defects.map((defect) => defect.severity === 'critical' || defect.severity === 'major' ? { ...defect, fixed: true } : defect);
          metrics.quality = clamp(metrics.quality + 12);
          metrics.technicalDebt = clamp(metrics.technicalDebt - 5);
          addChat('qa-room', 'meera', 'Meera', 'Critical and major defects are addressed. I have not forgotten the 1px issue.', 'funny');
        } else if (choiceId === 'polish') {
          defects = defects.map((defect) => defect.severity === 'cosmetic' ? { ...defect, fixed: true } : defect);
          metrics.quality = clamp(metrics.quality + 5);
          addChat('qa-room', 'meera', 'Meera', 'The icon is centred. The enquiry button is still not doing anything.', 'funny');
        } else {
          employees.find((item) => item.id === 'meera')!.morale = clamp(employees.find((item) => item.id === 'meera')!.morale + 10);
          defects = defects.map((defect) => defect.severity === 'critical' ? { ...defect, fixed: true } : defect);
          metrics.quality = clamp(metrics.quality + 8);
          addChat('qa-room', 'meera', 'Meera', 'Thank you. I have prioritised by user impact. The icon can wait. I am growing.', 'funny');
        }
        break;
      case 'ghost_returns':
        if (choiceId === 'small_task') {
          const nikhil = employees.find((item) => item.id === 'nikhil')!;
          nikhil.reliability = clamp(nikhil.reliability + 8); nikhil.availability = 'online'; nikhil.lastSeen = 'Now';
          const task = tasks.find((item) => item.id === 'whatsapp'); if (task) task.assignedTo = 'nikhil';
          addChat('engineering', 'nikhil', 'Nikhil', 'Okay. Small task. I will send it tonight.', 'funny');
        } else if (choiceId === 'inspect_zip') {
          employees.find((item) => item.id === 'nikhil')!.discovered = true;
          employees.find((item) => item.id === 'nikhil')!.availability = 'online';
          const task = tasks.find((item) => item.id === 'whatsapp'); if (task) { task.progress = clamp(task.progress + 24); task.verifiedProgress = task.progress; task.quality = clamp(task.quality + 8); }
          addChat('engineering', 'meera', 'Meera', 'I inspected the archive. There is actual source code inside. I am as surprised as you.', 'funny');
        } else {
          employees.find((item) => item.id === 'nikhil')!.reliability = clamp(employees.find((item) => item.id === 'nikhil')!.reliability + 10);
          employees.forEach((employee) => { employee.morale = clamp(employee.morale - 2); });
          addChat('general', 'nikhil', 'Nikhil', 'Sorry. Will be more active. Network was weird.', 'funny');
        }
        break;
      case 'demo_pressure':
        if (choiceId === 'freeze_scope') {
          metrics.clientTrust = clamp(metrics.clientTrust + 4);
          metrics.quality = clamp(metrics.quality + 6);
          metrics.technicalDebt = clamp(metrics.technicalDebt - 5);
          addChat('project', 'system', 'ALMOSTOS', 'Scope frozen. Bunty has been moved to the waiting room.', 'system');
        } else if (choiceId === 'last_feature') {
          metrics.clientTrust = clamp(metrics.clientTrust + 5);
          metrics.scopeCreep = clamp(metrics.scopeCreep + 16);
          metrics.technicalDebt = clamp(metrics.technicalDebt + 12);
          tasks.push({ id: 'loyalty-points', title: 'Bunty’s loyalty points feature', description: 'A last-minute feature accepted on demo day. No one can explain the loyalty rules.', category: 'frontend', effort: 8, progress: 0, reportedProgress: 0, verifiedProgress: 0, quality: 20, assignedTo: 'aarav', priority: 'critical', dependencies: ['catalogue'], dueDay: 7, status: 'assigned', deliverable: false });
          addChat('general', 'aarav', 'Aarav', 'I can vibe-code loyalty points. I cannot vibe-code the deadline.', 'funny');
        } else {
          metrics.quality = clamp(metrics.quality + 9);
          employees.forEach((employee) => { employee.morale = clamp(employee.morale + 4); });
          const demo = tasks.find((item) => item.id === 'presentation');
          if (demo) { demo.progress = clamp(demo.progress + 25); demo.verifiedProgress = demo.progress; demo.reportedProgress = demo.progress; }
          addChat('qa-room', 'meera', 'Meera', 'Demo rehearsal complete. I clicked every button twice. One of them apologised.', 'funny');
        }
        break;
    }

    metrics.morale = clamp(Math.round(employees.reduce((sum, employee) => sum + employee.morale, 0) / employees.length));
    metrics.progress = clamp(Math.round(tasks.filter((task) => task.deliverable).reduce((sum, task) => sum + task.progress, 0) / Math.max(1, tasks.filter((task) => task.deliverable).length)));
    metrics.bugsOpen = defects.filter((defect) => !defect.fixed).length;
    notifications = [makeNotification('DECISION RECORDED', `${event.title}: your choice changed the project state.`, 'hq', 'info', state.day), ...notifications].slice(0, 30);
    set({ metrics, tasks, employees, relationships, defects, messages, notifications, pendingEvent: null, lastAction: `Resolved: ${event.title}` });

    if (metrics.clientTrust <= 5) {
      get().deliverProject();
      set({ phase: 'ending', ending: endingFor('cancelled', 'THE CLIENT HAS LEFT THE CHAT', 'Contract terminated', 'The client has lost confidence in the project. Bunty has recommended another developer. Your company has received a one-star review and a voice note.', 0) });
    }
  },

  endDay: () => {
    const state = get();
    if ((state.phase !== 'desktop' && state.phase !== 'office') || state.pendingEvent) return;
    const requiredMissions = founderMissions.filter((mission) => mission.day === state.day);
    if (requiredMissions.some((mission) => !state.completedMissionIds.includes(mission.id))) return;
    if (state.day >= 7) { set({ phase: 'live_demo' }); return; }
    const result = resolveDay(state);
    const nextDay = state.day + 1;
    const newMessages = [...state.messages, ...result.messages];
    const dayClientLines: Record<number, string> = {
      2: 'The homepage preview looks nice. Can the logo be 40% bigger? My nephew says bigger logos mean more trust.',
      3: 'One small addition: can customers track orders live? It is just a map, right?',
      4: 'Bunty says we should add an AI chatbot. He has already written the welcome message.',
      5: 'Can you send a preview today? My business partner is asking. He is also Bunty.',
      6: 'Please confirm tomorrow’s delivery. We have announced it to the family WhatsApp group.',
      7: 'Looking forward to the demo. Please make sure the buttons work. Last time one button took me to a blank page.',
    };
    if (dayClientLines[nextDay]) newMessages.push(makeMessage('prakash', 'prakash', 'Mr. Prakash', dayClientLines[nextDay], nextDay, 'client'));
    const dailyReport = [...state.dailyReports, result.report];
    const notification = makeNotification(`DAY ${state.day} REPORT READY`, result.report.summary, 'hq', result.technicalDebt > 65 ? 'warning' : 'info', state.day);
    let metrics = {
      ...state.metrics,
      progress: result.progress,
      quality: result.quality,
      morale: result.morale,
      technicalDebt: result.technicalDebt,
      bugsOpen: state.defects.filter((defect) => !defect.fixed).length,
    };
    let employees = result.employees;
    if (metrics.technicalDebt > 82) {
      metrics.quality = clamp(metrics.quality - 7);
      newMessages.push(makeMessage('engineering', 'system', 'BUILD MONITOR', 'Build stability has degraded. A new warning has appeared: “The codebase is asking for a weekend.”', nextDay, 'system'));
    }
    if (metrics.clientTrust <= 10) {
      set({ phase: 'ending', ending: endingFor('cancelled', 'CONTRACT CANCELLED', 'The client ran out of patience', 'Mr. Prakash has paused the project and moved the work to someone who promised “everything by tonight”. The client has not yet discovered that person is Bunty.', 0) });
      return;
    }
    set({
      day: nextDay,
      actionsLeft: 5,
      employees,
      tasks: result.tasks,
      commits: [...state.commits, ...result.commits],
      messages: newMessages,
      metrics,
      dailyReports: dailyReport,
      pendingEvent: null,
      notifications: [notification, ...state.notifications].slice(0, 30),
      lastAction: `Day ${state.day} closed. Day ${nextDay} has begun.`,
    });
  },

  deliverProject: () => {
    const state = get();
    if (state.phase !== 'desktop' && state.phase !== 'office' && state.phase !== 'live_demo') return;
    const requiredMissions = founderMissions.filter((mission) => mission.day === state.day);
    if (requiredMissions.some((mission) => !state.completedMissionIds.includes(mission.id))) return;
    const finalResolution = state.day >= 7 && !state.dailyReports.some((report) => report.day === 7) ? resolveDay(state) : null;
    const finalMetrics = finalResolution ? {
      ...state.metrics,
      progress: finalResolution.progress,
      quality: finalResolution.quality,
      morale: finalResolution.morale,
      technicalDebt: finalResolution.technicalDebt,
      bugsOpen: state.defects.filter((defect) => !defect.fixed).length,
    } : state.metrics;
    const finalState = finalResolution ? {
      ...state,
      employees: finalResolution.employees,
      tasks: finalResolution.tasks,
      commits: [...state.commits, ...finalResolution.commits],
      messages: [...state.messages, ...finalResolution.messages],
      metrics: finalMetrics,
      dailyReports: [...state.dailyReports, finalResolution.report],
    } : state;
    const result = calculateDeliveryScore(finalState);
    const coreDone = result.coreDone;
    const trust = finalState.metrics.clientTrust;
    const criticalOpen = result.criticalOpen;
    const quality = finalState.metrics.quality;
    const sharedUpdate = finalResolution ? {
      employees: finalState.employees,
      tasks: finalState.tasks,
      commits: finalState.commits,
      messages: finalState.messages,
      metrics: finalState.metrics,
      dailyReports: finalState.dailyReports,
    } : {};
    if (trust < 18) {
      set({ ...sharedUpdate, phase: 'ending', ending: { kind: 'cancelled', title: 'THE CLIENT HAS LEFT THE CHAT', subtitle: 'Contract terminated', body: 'Mr. Prakash has cancelled the project. His final message: “No hard feelings. Bunty found a guy.” There are, in fact, hard feelings.', score: result.total, breakdown: result.breakdown } });
      return;
    }
    if (coreDone < result.requiredCore) {
      set({ ...sharedUpdate, phase: 'ending', ending: { kind: 'deadline', title: 'DEADLINE: 0 · PANIC: 100', subtitle: 'The delivery never materialised', body: `Only ${coreDone} of ${result.coreTotal} scoped deliverables reached a usable state. ${result.requiredCore} were required for acceptance. The client opened the link, saw a loading spinner and asked whether that was the final logo.`, score: result.total, breakdown: result.breakdown } });
      return;
    }
    if (criticalOpen > 0 || quality < 36) {
      set({ ...sharedUpdate, phase: 'ending', ending: { kind: 'quality', title: 'IT WORKS ON MY MACHINE', subtitle: 'Rejected during acceptance testing', body: `${criticalOpen} critical defect(s) remain open and verified quality is ${Math.round(quality)}%. The client clicked the primary button. Nothing happened. Meera quietly closed her laptop.`, score: result.total, breakdown: result.breakdown } });
      return;
    }
    const rating = result.total >= 82 ? 'LEGENDARY DELIVERY' : result.total >= 68 ? 'PROFESSIONAL DELIVERY' : result.total >= 52 ? 'ACCEPTABLE DELIVERY' : 'BARELY SHIPPED';
    const title = result.total >= 82 ? 'SOMEHOW, YOU COOKED' : result.total >= 68 ? 'A REAL PRODUCT. IN THIS ECONOMY.' : result.total >= 52 ? 'IT IS ACTUALLY LIVE' : 'THE SITE IS UP. PLEASE DON’T CLICK TOO MUCH.';
    set({ ...sharedUpdate, phase: 'ending', ending: { kind: 'success', title, subtitle: rating, body: `Royal Feast has accepted the Phase 1 delivery. The team survived seven days, several questionable commits and at least one motivational playlist. Mr. Prakash has confirmed the handover. Your first client is officially in the books.`, score: result.total, rating, breakdown: result.breakdown } });
  },

  fixDefect: (defectId) => {
    get().performAction('triage', defectId);
  },

  markNotificationsRead: () => set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, read: true })) })),

  discoverTrait: (employeeId) => set((state) => {
    if ((state.phase !== 'desktop' && state.phase !== 'office') || state.actionsLeft <= 0) return {};
    const target = state.employees.find((employee) => employee.id === employeeId);
    if (!target || target.discovered) return {};
    return {
      actionsLeft: state.actionsLeft - 1,
      employees: state.employees.map((employee) => employee.id === employeeId ? { ...employee, discovered: true, founderTrust: clamp(employee.founderTrust + 1) } : employee),
      lastAction: `You spent time understanding ${target.name}'s working style.`,
      notifications: [makeNotification('EMPLOYEE INSIGHT', `${target.name}'s hidden working trait has been revealed.`, 'people', 'info', state.day), ...state.notifications].slice(0, 30),
    };
  }),

  dismissEvent: () => set({ pendingEvent: null }),
}), {
  name: 'the-group-project-save',
  version: 3,
  migrate: (persistedState: any) => {
    const fresh = initialState();
    if (!persistedState || typeof persistedState !== 'object') {
      return fresh;
    }
    return {
      ...fresh,
      ...persistedState,
      metrics: {
        ...fresh.metrics,
        ...(persistedState?.metrics || {}),
      },
      employees: Array.isArray(persistedState?.employees) && persistedState.employees.length > 0
        ? persistedState.employees.map((employee: any, index: number) => ({
            ...(fresh.employees[index] || {}),
            ...employee,
            founderTrust: Number.isFinite(employee?.founderTrust) ? employee.founderTrust : 50,
          }))
        : fresh.employees,
      relationships: Array.isArray(persistedState?.relationships) && persistedState.relationships.length > 0
        ? persistedState.relationships
        : fresh.relationships,
      tasks: Array.isArray(persistedState?.tasks) && persistedState.tasks.length > 0
        ? persistedState.tasks
        : fresh.tasks,
      channels: Array.isArray(persistedState?.channels) && persistedState.channels.length > 0
        ? persistedState.channels
        : fresh.channels,
      messages: Array.isArray(persistedState?.messages) && persistedState.messages.length > 0
        ? persistedState.messages
        : fresh.messages,
      commits: Array.isArray(persistedState?.commits) ? persistedState.commits : fresh.commits,
      defects: Array.isArray(persistedState?.defects) && persistedState.defects.length > 0
        ? persistedState.defects
        : fresh.defects,
      notifications: Array.isArray(persistedState?.notifications) ? persistedState.notifications : fresh.notifications,
      dailyReports: Array.isArray(persistedState?.dailyReports) ? persistedState.dailyReports : fresh.dailyReports,
      completedMissionIds: Array.isArray(persistedState?.completedMissionIds) ? persistedState.completedMissionIds : fresh.completedMissionIds,
      roleAssignments: persistedState?.roleAssignments && typeof persistedState.roleAssignments === 'object' ? { ...fresh.roleAssignments, ...persistedState.roleAssignments } : fresh.roleAssignments,
      scopeAccepted: Array.isArray(persistedState?.scopeAccepted) && persistedState.scopeAccepted.length > 0 ? persistedState.scopeAccepted : fresh.scopeAccepted,
      actionsLeft: Number.isFinite(persistedState?.actionsLeft) ? persistedState.actionsLeft : fresh.actionsLeft,
    };
  },
  storage: createJSONStorage(() => safeStorage),
  partialize: (state: GameStore) => ({
    phase: state.phase,
    companyName: state.companyName,
    clientName: state.clientName,
    projectName: state.projectName,
    contractValue: state.contractValue,
    day: state.day,
    campaignSeed: state.campaignSeed,
    actionsLeft: state.actionsLeft,
    metrics: state.metrics,
    employees: state.employees,
    relationships: state.relationships,
    tasks: state.tasks,
    channels: state.channels,
    messages: state.messages,
    commits: state.commits,
    defects: state.defects,
    pendingEvent: state.pendingEvent,
    notifications: state.notifications,
    dailyReports: state.dailyReports,
    ending: state.ending,
    gameOver: state.gameOver,
    lastAction: state.lastAction,
    tutorialSeen: state.tutorialSeen,
    scopeAccepted: state.scopeAccepted,
    completedMissionIds: state.completedMissionIds,
    roleAssignments: state.roleAssignments,
  }),
}));

export const getEmployee = (id: string) => useGameStore.getState().employees.find((employee) => employee.id === id);
export const getTask = (id: string) => useGameStore.getState().tasks.find((task) => task.id === id);

if (typeof window !== 'undefined') {
  (window as any).__store = useGameStore;
}
