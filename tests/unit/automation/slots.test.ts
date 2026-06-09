import { describe, it, expect } from 'vitest';
import { nextSlots } from '../../../automation/pipeline/slots';

describe('nextSlots', () => {
  it('returns upcoming 08:00/18:00 Bangkok slots (01:00/11:00 UTC)', () => {
    const slots = nextSlots('2026-06-10T05:00:00Z', 3);
    expect(slots).toEqual([
      '2026-06-10T11:00:00.000Z', // 18:00 BKK today
      '2026-06-11T01:00:00.000Z', // 08:00 BKK tomorrow
      '2026-06-11T11:00:00.000Z', // 18:00 BKK tomorrow
    ]);
  });

  it('skips a slot less than 10 minutes away', () => {
    const slots = nextSlots('2026-06-10T00:55:00Z', 1); // 01:00 UTC is only 5 min out -> skip
    expect(slots[0]).toBe('2026-06-10T11:00:00.000Z');
  });
});
