import { describe, it, expect } from 'vitest';
import { ROTATION, nextTrack, wasPosted, appendRun, recentKnowledgePages, anglesForSubject } from '../../../automation/ledger/ledger';
import type { Ledger } from '../../../automation/types';

const empty: Ledger = { rotationIndex: 0, runs: [] };

describe('ledger', () => {
  it('rotation cycles tools -> news -> knowledge', () => {
    expect(ROTATION).toEqual(['tools', 'news', 'knowledge']);
    expect(nextTrack({ ...empty, rotationIndex: 0 })).toBe('tools');
    expect(nextTrack({ ...empty, rotationIndex: 1 })).toBe('news');
    expect(nextTrack({ ...empty, rotationIndex: 2 })).toBe('knowledge');
    expect(nextTrack({ ...empty, rotationIndex: 3 })).toBe('tools');
  });

  it('appendRun advances rotation and appends', () => {
    const l = appendRun(empty, { date: '2026-06-10', track: 'tools', subject: 'browser-use', status: 'posted' });
    expect(l.runs).toHaveLength(1);
    expect(l.rotationIndex).toBe(1);
  });

  it('wasPosted detects a previously posted source url (posted only)', () => {
    const l: Ledger = { rotationIndex: 0, runs: [
      { date: '2026-06-10', track: 'news', subject: 'x', status: 'posted', sourceUrl: 'https://a.com/1' },
      { date: '2026-06-10', track: 'news', subject: 'y', status: 'skipped', sourceUrl: 'https://a.com/2' },
    ]};
    expect(wasPosted(l, 'https://a.com/1')).toBe(true);
    expect(wasPosted(l, 'https://a.com/2')).toBe(false);
    expect(wasPosted(l, 'https://a.com/3')).toBe(false);
  });

  it('recentKnowledgePages returns last N knowledge subjects, newest first', () => {
    const l: Ledger = { rotationIndex: 0, runs: [
      { date: '1', track: 'knowledge', subject: 'p1', status: 'posted' },
      { date: '2', track: 'news', subject: 'n', status: 'posted' },
      { date: '3', track: 'knowledge', subject: 'p2', status: 'posted' },
    ]};
    expect(recentKnowledgePages(l, 2)).toEqual(['p2', 'p1']);
  });

  it('anglesForSubject lists prior tool angles for a repo', () => {
    const l: Ledger = { rotationIndex: 0, runs: [
      { date: '1', track: 'tools', subject: 'browser-use', status: 'posted', angle: 'fill-forms' },
      { date: '2', track: 'tools', subject: 'browser-use', status: 'posted', angle: 'compare-prices' },
      { date: '3', track: 'tools', subject: 'other', status: 'posted', angle: 'x' },
    ]};
    expect(anglesForSubject(l, 'browser-use')).toEqual(['fill-forms', 'compare-prices']);
  });
});
