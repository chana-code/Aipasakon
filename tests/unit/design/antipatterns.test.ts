import { describe, it, expect } from 'vitest';
import { scanAntipatterns } from '../../../scripts/check-antipatterns.mjs';

describe('design anti-pattern lint', () => {
  it('codebase is clean of banned patterns', () => {
    const findings = scanAntipatterns(['app', 'components']);
    expect(findings, JSON.stringify(findings, null, 2)).toEqual([]);
  });
});
