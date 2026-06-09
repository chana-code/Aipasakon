import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { CardConfig } from '../types';
import { buildCardHtml } from './template';

const __dirname = dirname(fileURLToPath(import.meta.url));
// website/automation/cards -> website/public/assets/logo-circular-full.png
const LOGO_PATH = join(__dirname, '../../public/assets/logo-circular-full.png');

const MAX_SIZE = 110;
const MIN_SIZE = 54;

export async function renderCard(config: CardConfig, outPath: string): Promise<void> {
  const logoDataUri = 'data:image/png;base64,' + readFileSync(LOGO_PATH).toString('base64');
  const html = buildCardHtml(config, logoDataUri);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => (document as any).fonts.ready);

    // Auto-fit: largest size in [MIN,MAX] where the hook does not overflow the body.
    await page.evaluate(({ max, min }) => {
      const hook = document.querySelector('.hook') as HTMLElement;
      const body = document.querySelector('.body') as HTMLElement;
      let size = max;
      hook.style.setProperty('--hooksize', size + 'px');
      while (size > min && hook.scrollHeight > body.clientHeight) {
        size -= 2;
        hook.style.setProperty('--hooksize', size + 'px');
      }
    }, { max: MAX_SIZE, min: MIN_SIZE });

    await page.waitForTimeout(150);
    await page.locator('.card').screenshot({ path: outPath });
  } finally {
    await browser.close();
  }
}
