import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../src/game/store';
import { calculateDeliveryScore } from '../src/game/engine';
import { generateChatReplies } from '../src/game/chatReplies';

const dayMissionMap: Record<number, string[]> = {
  1: ['d1_varun_demo', 'd1_aarav_commit'],
  2: ['d2_nikhil_api', 'd2_bunty_scope'],
  3: ['d3_chaos_note', 'd3_qa_vs_vibe'],
  4: ['d4_preview', 'd4_varun_integration'],
  5: ['d5_change_request', 'd5_meera_qa'],
  6: ['d6_nikhil_returns', 'd6_release_freeze'],
  7: ['d7_rehearsal', 'd7_delivery_call'],
};

describe('End-to-End Game Flow and Delivery Verification', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('verifies defect singular/plural grammar in calculateDeliveryScore breakdown', () => {
    const state = useGameStore.getState();

    // 1 defect open
    state.defects = [
      { id: 'crit-1', title: 'Fatal crash', description: 'desc', severity: 'critical', fixed: false, discoveredDay: 1, category: 'frontend' }
    ];
    const scoreWithOne = calculateDeliveryScore(state);
    const stabilityOne = scoreWithOne.breakdown.find(b => b.label === 'Release stability');
    expect(stabilityOne?.detail).toBe('1 critical defect remains open.');

    // 0 defects open
    state.defects = [
      { id: 'crit-1', title: 'Fatal crash', description: 'desc', severity: 'critical', fixed: true, discoveredDay: 1, category: 'frontend' }
    ];
    const scoreWithZero = calculateDeliveryScore(state);
    const stabilityZero = scoreWithZero.breakdown.find(b => b.label === 'Release stability');
    expect(stabilityZero?.detail).toBe('No critical defects remain open.');

    // 2 defects open
    state.defects = [
      { id: 'crit-1', title: 'Crash 1', description: 'desc', severity: 'critical', fixed: false, discoveredDay: 1, category: 'frontend' },
      { id: 'crit-2', title: 'Crash 2', description: 'desc', severity: 'critical', fixed: false, discoveredDay: 2, category: 'backend' }
    ];
    const scoreWithTwo = calculateDeliveryScore(state);
    const stabilityTwo = scoreWithTwo.breakdown.find(b => b.label === 'Release stability');
    expect(stabilityTwo?.detail).toBe('2 critical defects remain open.');
  });

  it('verifies Delivery Failed scenario does NOT show SOLID DELIVERY rating', () => {
    useGameStore.setState({
      phase: 'live_demo',
      day: 7,
      scopeAccepted: ['homepage', 'catalogue', 'whatsapp', 'contact'],
      tasks: [
        { id: 'homepage', title: 'Homepage', description: 'Hero', category: 'frontend', assignedTo: 'aarav', progress: 80, verifiedProgress: 80, reportedProgress: 80, quality: 70, status: 'review', deliverable: true },
        { id: 'catalogue', title: 'Catalogue', description: 'Menu', category: 'content', assignedTo: 'kunal', progress: 80, verifiedProgress: 80, reportedProgress: 80, quality: 70, status: 'review', deliverable: true },
        { id: 'whatsapp', title: 'WhatsApp', description: 'Enquiry', category: 'frontend', assignedTo: 'aarav', progress: 40, verifiedProgress: 40, reportedProgress: 40, quality: 50, status: 'in_progress', deliverable: true },
        { id: 'contact', title: 'Contact', description: 'Form', category: 'architecture', assignedTo: 'varun', progress: 30, verifiedProgress: 30, reportedProgress: 30, quality: 40, status: 'in_progress', deliverable: true },
        { id: 'deployment', title: 'Deploy', description: 'Prod', category: 'testing', assignedTo: 'meera', progress: 20, verifiedProgress: 20, reportedProgress: 20, quality: 30, status: 'in_progress', deliverable: true },
      ],
      defects: [
        { id: 'bug-crit', title: 'WhatsApp TypeError', description: 'Missing function', severity: 'critical', fixed: false, discoveredDay: 1, category: 'frontend' }
      ],
      completedMissionIds: dayMissionMap[7],
    });

    useGameStore.getState().deliverProject();
    const finalState = useGameStore.getState();

    expect(finalState.phase).toBe('ending');
    expect(finalState.ending).not.toBeNull();
    expect(finalState.ending?.kind).toBe('deadline');
    // Must NOT be SOLID DELIVERY!
    expect(finalState.ending?.rating).not.toBe('SOLID DELIVERY');
    expect(finalState.ending?.rating).toBe('DEADLINE MISSED');
    expect(finalState.ending?.title).toBe('DEADLINE: 0 · PANIC: 100');
  });

  it('verifies QA Rejection scenario sets QA REJECTION rating', () => {
    useGameStore.setState({
      phase: 'live_demo',
      day: 7,
      scopeAccepted: ['homepage', 'catalogue'],
      tasks: [
        { id: 'homepage', title: 'Homepage', description: 'Hero', category: 'frontend', assignedTo: 'aarav', progress: 100, verifiedProgress: 100, reportedProgress: 100, quality: 75, status: 'done', deliverable: true },
        { id: 'catalogue', title: 'Catalogue', description: 'Menu', category: 'content', assignedTo: 'kunal', progress: 100, verifiedProgress: 100, reportedProgress: 100, quality: 75, status: 'done', deliverable: true },
        { id: 'deployment', title: 'Deploy', description: 'Prod', category: 'testing', assignedTo: 'meera', progress: 100, verifiedProgress: 100, reportedProgress: 100, quality: 75, status: 'done', deliverable: true },
      ],
      defects: [
        { id: 'bug-blocker', title: 'Crash on submit', description: '500 error', severity: 'critical', fixed: false, discoveredDay: 4, category: 'backend' }
      ],
      metrics: {
        ...useGameStore.getState().metrics,
        clientTrust: 80,
        quality: 60,
      },
      completedMissionIds: dayMissionMap[7],
    });

    useGameStore.getState().deliverProject();
    const finalState = useGameStore.getState();

    expect(finalState.phase).toBe('ending');
    expect(finalState.ending?.kind).toBe('quality');
    expect(finalState.ending?.rating).toBe('QA REJECTION');
    expect(finalState.ending?.title).toBe('IT WORKS ON MY MACHINE');
  });

  it('verifies Successful Delivery scenario gives LEGENDARY or PROFESSIONAL rating', () => {
    useGameStore.setState({
      phase: 'live_demo',
      day: 7,
      scopeAccepted: ['homepage', 'catalogue', 'whatsapp'],
      tasks: [
        { id: 'homepage', title: 'Homepage', description: 'Hero', category: 'frontend', assignedTo: 'aarav', progress: 100, verifiedProgress: 100, reportedProgress: 100, quality: 90, status: 'done', deliverable: true },
        { id: 'catalogue', title: 'Catalogue', description: 'Menu', category: 'content', assignedTo: 'kunal', progress: 100, verifiedProgress: 100, reportedProgress: 100, quality: 90, status: 'done', deliverable: true },
        { id: 'whatsapp', title: 'WhatsApp', description: 'Enquiry', category: 'frontend', assignedTo: 'aarav', progress: 100, verifiedProgress: 100, reportedProgress: 100, quality: 85, status: 'done', deliverable: true },
        { id: 'deployment', title: 'Deploy', description: 'Prod', category: 'testing', assignedTo: 'meera', progress: 100, verifiedProgress: 100, reportedProgress: 100, quality: 90, status: 'done', deliverable: true },
      ],
      defects: [],
      metrics: {
        ...useGameStore.getState().metrics,
        clientTrust: 95,
        quality: 88,
        morale: 90,
        technicalDebt: 10,
      },
      completedMissionIds: dayMissionMap[7],
    });

    useGameStore.getState().deliverProject();
    const finalState = useGameStore.getState();

    expect(finalState.phase).toBe('ending');
    expect(finalState.ending?.kind).toBe('success');
    expect(finalState.ending?.rating).toMatch(/LEGENDARY DELIVERY|PROFESSIONAL DELIVERY/);
    expect(finalState.ending?.score).toBeGreaterThanOrEqual(75);
  });

  it('verifies chat replies never repeat the same line twice consecutively', () => {
    const inputs = ['no', 'is not possible', 'impossible', 'cancel this', 'nah'];
    let lastText = '';
    for (const input of inputs) {
      const replies = generateChatReplies('bunty', 'direct', input, 2);
      expect(replies.length).toBeGreaterThan(0);
      const currentText = replies[0].text;
      expect(currentText).not.toBe(lastText);
      lastText = currentText;
    }

    const nikhilInputs = ['hi', 'are you there', 'ping', 'status', 'where'];
    let lastNikhilText = '';
    for (const input of nikhilInputs) {
      const replies = generateChatReplies('nikhil', 'direct', input, 2);
      expect(replies.length).toBeGreaterThan(0);
      const currentText = replies[0].text;
      expect(currentText).not.toBe(lastNikhilText);
      lastNikhilText = currentText;
    }
  });

  it('verifies entire 7-day loop can transition seamlessly without exceptions', () => {
    useGameStore.setState({ phase: 'office', day: 1 });
    expect(useGameStore.getState().day).toBe(1);

    // Play through Day 1 to 6
    for (let currentDay = 1; currentDay <= 6; currentDay++) {
      // Complete day missions
      useGameStore.setState((s) => ({
        completedMissionIds: [...s.completedMissionIds, ...dayMissionMap[currentDay]],
        actionsLeft: 5,
      }));

      // Use a breakroom amenity
      useGameStore.getState().brewCoffee('chai');

      // End day
      useGameStore.getState().endDay();
      expect(useGameStore.getState().day).toBe(currentDay + 1);
    }

    expect(useGameStore.getState().day).toBe(7);

    // On Day 7, endDay transitions to live_demo
    useGameStore.setState((s) => ({
      completedMissionIds: [...s.completedMissionIds, ...dayMissionMap[7]],
    }));
    useGameStore.getState().endDay();
    expect(useGameStore.getState().phase).toBe('live_demo');
  });
});
