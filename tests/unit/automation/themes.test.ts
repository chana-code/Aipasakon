import { describe, it, expect } from 'vitest';
import { THEMES } from '../../../automation/cards/themes';

describe('THEMES', () => {
  it('defines all three tracks', () => {
    expect(Object.keys(THEMES).sort()).toEqual(['knowledge', 'news', 'tools']);
  });
  it('each theme has all required fields, non-empty', () => {
    for (const t of Object.values(THEMES)) {
      for (const k of ['bg','ink','lead','kick','accent','site','tag','rule','bar'] as const) {
        expect(typeof t[k]).toBe('string');
        expect(t[k].length).toBeGreaterThan(0);
      }
    }
  });
  it('tools is the navy dark theme', () => {
    expect(THEMES.tools.bg.toUpperCase()).toBe('#00143C');
  });
});
