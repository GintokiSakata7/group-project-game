import { describe, it, expect } from 'vitest';
import { generateChatReplies, isGibberishOrShort } from '../src/game/chatReplies';

describe('chatReplies Engine', () => {
  it('detects short and gibberish inputs correctly', () => {
    expect(isGibberishOrShort('gvr')).toBe(true);
    expect(isGibberishOrShort('nb')).toBe(true);
    expect(isGibberishOrShort('jnbj')).toBe(true);
    expect(isGibberishOrShort('jj')).toBe(true);
    expect(isGibberishOrShort('gbgb')).toBe(true);
    expect(isGibberishOrShort('.,i')).toBe(true);

    // Common valid words are not gibberish
    expect(isGibberishOrShort('no')).toBe(false);
    expect(isGibberishOrShort('yes')).toBe(false);
    expect(isGibberishOrShort('hi')).toBe(false);
    expect(isGibberishOrShort('how')).toBe(false);
  });

  it('Bunty responds specifically to rejections without repeating identical text', () => {
    const reply1 = generateChatReplies('bunty', 'direct', 'no', 1);
    expect(reply1).toHaveLength(1);
    expect(reply1[0].text).toContain('Wait, hear me out');

    const reply2 = generateChatReplies('bunty', 'direct', 'is not possible', 1);
    expect(reply2).toHaveLength(1);
    expect(reply2[0].text).toContain('Elon Musk');
  });

  it('Nikhil handles greetings, tasks, and gibberish distinctively', () => {
    const greeting = generateChatReplies('nikhil', 'direct', 'hi', 1);
    expect(greeting).toHaveLength(1);
    expect(greeting[0].text).toContain('station');

    const gibberish = generateChatReplies('nikhil', 'direct', 'gvr', 1);
    expect(gibberish).toHaveLength(1);
    expect(['seen', '...', 'terminal output: syntax error. just like that message.']).toContain(gibberish[0].text);

    const task = generateChatReplies('nikhil', 'direct', 'how is the backend api', 1);
    expect(task).toHaveLength(1);
    expect(task[0].text).toMatch(/endpoint|api|table/i);
  });

  it('Meera distinguishes critical bugs, fixed states, and gibberish', () => {
    const gibberish = generateChatReplies('meera', 'direct', 'jnbj', 1);
    expect(gibberish).toHaveLength(1);
    expect(gibberish[0].text).toContain('SQL injection');

    const critical = generateChatReplies('meera', 'direct', 'this is critical priority', 1);
    expect(critical).toHaveLength(1);
    expect(critical[0].text).toContain('primary checkout flow');

    const fixed = generateChatReplies('meera', 'direct', 'the bug is fixed and done', 1);
    expect(fixed).toHaveLength(1);
    expect(fixed[0].text).toMatch(/fix/i);
  });

  it('General channel handles gibberish with varied fun banter rather than repeating the same note', () => {
    const gibberish1 = generateChatReplies('general', 'group', 'gbgb', 1);
    expect(gibberish1.length).toBeGreaterThanOrEqual(1);

    const gibberish2 = generateChatReplies('general', 'group', '.,i', 1);
    expect(gibberish2.length).toBeGreaterThanOrEqual(1);

    // One mentions keyboard enthusiasm or packet loss
    const allText = [...gibberish1, ...gibberish2].map(r => r.text).join(' ');
    expect(allText).toMatch(/keyboard|syntax|seen/i);
  });
});
