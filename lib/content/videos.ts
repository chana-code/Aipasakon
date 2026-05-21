import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { Video } from './schemas';

const ROOT = path.resolve(process.cwd(), 'content/videos');

export async function loadAllVideos() {
  const files = (await readdir(ROOT)).filter(f => f.endsWith('.json'));
  return Promise.all(files.map(async f => {
    const raw = JSON.parse(await readFile(path.join(ROOT, f), 'utf-8'));
    return Video.parse(raw);
  }));
}

export async function loadVideo(slug: string) {
  const raw = JSON.parse(await readFile(path.join(ROOT, `${slug}.json`), 'utf-8'));
  return Video.parse(raw);
}
