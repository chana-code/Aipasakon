import { readFileSync } from 'fs';
import { renderCard } from './render';
import type { CardConfig } from '../types';

const [, , configPath, outPath] = process.argv;
if (!configPath || !outPath) {
  console.error('usage: tsx automation/cards/cli.ts <config.json> <out.png>');
  process.exit(1);
}
const config = JSON.parse(readFileSync(configPath, 'utf8')) as CardConfig;
await renderCard(config, outPath);
console.log('rendered', outPath);
