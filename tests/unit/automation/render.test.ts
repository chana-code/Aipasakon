import { describe, it, expect } from 'vitest';
import { renderCard } from '../../../automation/cards/render';
import type { CardConfig } from '../../../automation/types';
import { readFileSync, existsSync, rmSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

function pngSize(path: string) {
  const b = readFileSync(path);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

const config: CardConfig = {
  track: 'news',
  kicker: 'ข่าว AI',
  hook: [
    { text: 'อัพเดทโมเดลใหม่ของ Google', style: 'lead' },
    { text: 'Gemini 3.5 Flash', style: 'accent', nowrap: true },
    { text: 'เก่งขึ้นมาก', style: 'mark' },
  ],
};

describe('renderCard', () => {
  it('renders a 2160x2700 PNG that exists and is non-trivial', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'card-'));
    const out = join(dir, 'out.png');
    await renderCard(config, out);
    expect(existsSync(out)).toBe(true);
    expect(pngSize(out)).toEqual({ w: 2160, h: 2700 });
    expect(readFileSync(out).length).toBeGreaterThan(10_000);
    rmSync(dir, { recursive: true, force: true });
  }, 60_000);
});
