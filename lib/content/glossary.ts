import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Glossary } from './schemas';

const FILE = path.resolve(process.cwd(), 'content/glossary.json');

export async function loadGlossary() {
  const raw = JSON.parse(await readFile(FILE, 'utf-8'));
  return Glossary.parse(raw);
}
