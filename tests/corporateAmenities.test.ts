import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../src/game/store';

describe('Corporate Amenities & Workplace Culture', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame?.();
    useGameStore.setState({
      day: 1,
      phase: 'office',
      coffeeBrewsToday: 0,
      mealsOrderedToday: [],
      likedReels: ['reel-1'],
      metrics: {
        progress: 10,
        quality: 60,
        clientTrust: 70,
        morale: 60,
        technicalDebt: 10,
        cash: 2500,
        scopeCreep: 0,
        bugsOpen: 2,
      },
      employees: [
        {
          id: 'aarav', name: 'Aarav', role: 'Frontend', title: 'Vibe Coder', avatar: '⚡', color: '#ff79a6', tagline: 'Vibes',
          skills: {}, reliability: 70, morale: 60, fatigue: 40, ego: 50, founderTrust: 60, baseProductivity: 1,
          availability: 'online', lastSeen: 'now', hiddenTrait: '', discovered: true, quirks: []
        },
        {
          id: 'varun', name: 'Varun', role: 'Lead', title: 'Tech Lead', avatar: '🧠', color: '#a78bfa', tagline: 'Architecture',
          skills: {}, reliability: 80, morale: 60, fatigue: 30, ego: 70, founderTrust: 70, baseProductivity: 1,
          availability: 'online', lastSeen: 'now', hiddenTrait: '', discovered: true, quirks: []
        }
      ]
    });
  });

  it('allows brewing Cutting Chai for free and updates employee fatigue/morale', () => {
    const res = useGameStore.getState().brewCoffee('chai');
    expect(res.success).toBe(true);
    expect(res.message).toMatch(/Cutting chai dispensed|chai/i);
    expect(useGameStore.getState().coffeeBrewsToday).toBe(1);
    expect(useGameStore.getState().metrics.cash).toBe(2500); // Free

    const employees = useGameStore.getState().employees;
    expect(employees[0].morale).toBeGreaterThan(60);
    expect(employees[0].fatigue).toBeLessThan(40);
  });

  it('allows brewing Filter Kaapi and deducts ₹40', () => {
    const res = useGameStore.getState().brewCoffee('filter');
    expect(res.success).toBe(true);
    expect(useGameStore.getState().coffeeBrewsToday).toBe(1);
    expect(useGameStore.getState().metrics.cash).toBe(2460); // 2500 - 40
  });

  it('enforces maximum 3 coffee brews per day', () => {
    useGameStore.getState().brewCoffee('chai');
    useGameStore.getState().brewCoffee('chai');
    useGameStore.getState().brewCoffee('chai');
    expect(useGameStore.getState().coffeeBrewsToday).toBe(3);

    const fourth = useGameStore.getState().brewCoffee('chai');
    expect(fourth.success).toBe(false);
    expect(fourth.message).toMatch(/limit|smoking/i);
  });

  it('allows ordering team biryani and reduces fatigue, boosting morale', () => {
    const res = useGameStore.getState().orderOfficeFood('biryani');
    expect(res.success).toBe(true);
    expect(useGameStore.getState().metrics.cash).toBe(2050); // 2500 - 450
    expect(useGameStore.getState().mealsOrderedToday).toContain('biryani');

    // Trying to order biryani a second time on the same day fails
    const secondOrder = useGameStore.getState().orderOfficeFood('biryani');
    expect(secondOrder.success).toBe(false);
    expect(secondOrder.message).toMatch(/already ordered/i);
  });

  it('toggles like on reels', () => {
    expect(useGameStore.getState().likedReels).toContain('reel-1');
    useGameStore.getState().toggleLikeReel('reel-1');
    expect(useGameStore.getState().likedReels).not.toContain('reel-1');

    useGameStore.getState().toggleLikeReel('reel-2');
    expect(useGameStore.getState().likedReels).toContain('reel-2');
  });
});

