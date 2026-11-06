import { describe, expect, it } from 'vitest';
import { campaignEvents, initialChannels, initialDefects, initialEmployees, initialMessages, initialRelationships, initialTasks } from '../src/game/data';
import { calculateDeliveryScore, clamp, resolveDay } from '../src/game/engine';
import { validateGameEvent } from '../src/game/validation';
import type { GameState } from '../src/game/types';

function fixture(): GameState {
  return {
    phase: 'desktop', companyName: 'PANIC LABS', clientName: 'Mr. Prakash', projectName: 'Royal Feast Digital Presence',
    contractValue: 5000, day: 1, campaignSeed: 94821, actionsLeft: 3,
    metrics: { progress: 3, quality: 58, clientTrust: 74, morale: 72, technicalDebt: 12, cash: 2500, scopeCreep: 0, bugsOpen: 4 },
    employees: initialEmployees.map((employee) => ({ ...employee })),
    relationships: initialRelationships.map((relationship) => ({ ...relationship })),
    tasks: initialTasks.map((task) => ({ ...task })),
    channels: initialChannels.map((channel) => ({ ...channel })),
    messages: initialMessages.map((message) => ({ ...message })),
    commits: [], defects: initialDefects.map((defect) => ({ ...defect })),
    pendingEvent: null, notifications: [], dailyReports: [], ending: null, lastAction: '', tutorialSeen: false,
    scopeAccepted: ['homepage', 'catalogue', 'whatsapp', 'contact', 'responsive', 'seo'],
  };
}

describe('simulation engine', () => {
  it('clamps values without producing out-of-range stats', () => {
    expect(clamp(-12)).toBe(0);
    expect(clamp(128)).toBe(100);
    expect(clamp(42)).toBe(42);
  });

  it('resolves a day into deterministic task and repository evidence', () => {
    const first = resolveDay(fixture());
    const second = resolveDay(fixture());
    expect(first.commits.length).toBeGreaterThan(0);
    expect(first.commits.map((commit) => commit.id)).toEqual(second.commits.map((commit) => commit.id));
    expect(first.progress).toBeGreaterThanOrEqual(0);
    expect(first.progress).toBeLessThanOrEqual(100);
    expect(first.tasks.some((task) => task.progress > 0)).toBe(true);
  });

  it('does not let a blocked high-level QA task starve a ready task assigned to the same employee', () => {
    const state = fixture();
    const whatsapp = state.tasks.find((task) => task.id === 'whatsapp');
    if (!whatsapp) throw new Error('Fixture is missing the WhatsApp task');
    whatsapp.assignedTo = 'meera';
    const resolution = resolveDay(state);
    expect(resolution.commits.some((commit) => commit.employeeId === 'meera' && commit.taskId === 'whatsapp')).toBe(true);
  });

  it('lets the Aarav–Varun relationship affect integration throughput', () => {
    const tense = fixture();
    tense.tasks = tense.tasks.map((task) => ({ ...task, assignedTo: task.id === 'integration' ? 'varun' : null, status: task.id === 'integration' ? 'in_progress' : task.status, progress: ['architecture', 'whatsapp'].includes(task.id) ? 60 : task.progress }));
    const calm = { ...tense, relationships: tense.relationships.map((item) => item.employeeA === 'aarav' && item.employeeB === 'varun' ? { ...item, friction: 20 } : item) };
    const tenseResult = resolveDay(tense);
    const calmResult = resolveDay(calm);
    expect(tenseResult.commits.some((commit) => commit.taskId === 'integration')).toBe(true);
    expect(calmResult.tasks.find((task) => task.id === 'integration')!.progress).toBeGreaterThan(tenseResult.tasks.find((task) => task.id === 'integration')!.progress);
  });


  it('does not execute backlog work until the founder assigns it', () => {
    const state = fixture();
    const deployment = state.tasks.find((task) => task.id === 'deployment');
    if (!deployment) throw new Error('Fixture is missing the deployment task');
    deployment.assignedTo = 'varun';
    deployment.status = 'backlog';
    const resolution = resolveDay(state);
    expect(resolution.commits.some((commit) => commit.taskId === 'deployment')).toBe(false);
  });

  it('validates campaign incident content before it reaches the player', () => {
    for (const event of Object.values(campaignEvents)) {
      expect(validateGameEvent(event).choices.length).toBeGreaterThanOrEqual(2);
    }
    expect(() => validateGameEvent({ ...campaignEvents[1], choices: [] })).toThrow();
  });

  it('scores deliverables and release stability separately', () => {
    const state = fixture();
    state.tasks = state.tasks.map((task) => ({ ...task, progress: 90, verifiedProgress: 90, quality: 80 }));
    state.defects = state.defects.map((defect) => ({ ...defect, fixed: true }));
    const score = calculateDeliveryScore(state);
    expect(score.coreDone).toBe(7);
    expect(score.criticalOpen).toBe(0);
    expect(score.total).toBeGreaterThan(70);
  });
});
