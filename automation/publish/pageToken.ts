import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Loads Meta credentials. Prefers process.env; falls back to the workspace-root
 * .env (one level above the website repo). Never logs the values.
 */
export function loadMetaEnv(): { systemUserToken: string; pageId: string } {
  let systemUserToken = process.env.META_SYSTEM_USER_TOKEN ?? '';
  let pageId = process.env.META_PAGE_ID ?? '992580240609596';
  if (!systemUserToken) {
    const envPath = resolve(process.cwd(), '../.env');
    if (existsSync(envPath)) {
      for (const line of readFileSync(envPath, 'utf8').split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#') || !t.includes('=')) continue;
        const i = t.indexOf('=');
        const k = t.slice(0, i);
        const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
        if (k === 'META_SYSTEM_USER_TOKEN') systemUserToken = v;
        if (k === 'META_PAGE_ID') pageId = v;
      }
    }
  }
  return { systemUserToken, pageId };
}

/** Exchanges a system-user token for the page access token used to publish. */
export async function derivePageToken(systemUserToken: string, pageId: string): Promise<string> {
  const url = `https://graph.facebook.com/v21.0/me/accounts?fields=id,access_token&limit=200&access_token=${systemUserToken}`;
  const resp = await fetch(url);
  const json = await resp.json() as { data?: { id: string; access_token: string }[]; error?: { message: string } };
  if (json.error) throw new Error(`derivePageToken failed: ${json.error.message}`);
  const page = (json.data ?? []).find(p => p.id === pageId);
  if (!page) throw new Error(`page ${pageId} not found in this token's accounts`);
  return page.access_token;
}
