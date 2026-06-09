import { readFileSync } from 'fs';
import { basename } from 'path';

const GRAPH = 'https://graph.facebook.com/v21.0';

export interface PhotoPostInput { pageId: string; caption: string; }
export interface PhotoPost { endpoint: string; fields: { message: string }; }

/** Pure: the endpoint + non-secret fields for a page photo post. */
export function buildPhotoPost({ pageId, caption }: PhotoPostInput): PhotoPost {
  return { endpoint: `${GRAPH}/${pageId}/photos`, fields: { message: caption } };
}

export interface PublishInput {
  pageId: string;
  token: string;
  imagePath: string;
  caption: string;
  dryRun?: boolean;
  /** Unix time (seconds) for Facebook to publish the post itself. Must be 10 min–6 months out.
   *  When set, the post is created unpublished and Facebook publishes it at that time —
   *  so it goes live on schedule regardless of whether this machine is on. */
  scheduledPublishTime?: number;
}

export interface PublishResult {
  dryRun: boolean;
  endpoint: string;
  fields: { message: string };
  postId?: string;
  scheduledPublishTime?: number;
}

export async function publishCardPost(input: PublishInput): Promise<PublishResult> {
  const { endpoint, fields } = buildPhotoPost({ pageId: input.pageId, caption: input.caption });
  const scheduledPublishTime = input.scheduledPublishTime;
  if (input.dryRun) {
    return { dryRun: true, endpoint, fields, scheduledPublishTime }; // token deliberately excluded
  }
  const form = new FormData();
  form.set('message', fields.message);
  form.set('access_token', input.token);
  if (scheduledPublishTime) {
    // Hand timing to Facebook: create unpublished + let FB publish at the scheduled time.
    form.set('published', 'false');
    form.set('scheduled_publish_time', String(scheduledPublishTime));
  }
  const bytes = readFileSync(input.imagePath);
  form.set('source', new Blob([bytes], { type: 'image/png' }), basename(input.imagePath));

  const resp = await fetch(endpoint, { method: 'POST', body: form });
  const json = await resp.json() as { id?: string; post_id?: string; error?: { message: string } };
  if (!resp.ok || json.error) {
    throw new Error(`Meta publish failed: ${json.error?.message ?? resp.status}`);
  }
  return { dryRun: false, endpoint, fields, postId: json.post_id ?? json.id, scheduledPublishTime };
}
