import { describe, it, expect } from 'vitest';
import { buildPhotoPost, publishCardPost } from '../../../automation/publish/meta';

describe('buildPhotoPost', () => {
  it('targets the page /photos endpoint', () => {
    const { endpoint } = buildPhotoPost({ pageId: '123', caption: 'hello' });
    expect(endpoint).toBe('https://graph.facebook.com/v21.0/123/photos');
  });
  it('puts the caption in the message field', () => {
    const { fields } = buildPhotoPost({ pageId: '123', caption: 'สวัสดี' });
    expect(fields.message).toBe('สวัสดี');
  });
});

describe('publishCardPost dry-run', () => {
  it('returns the intended call without the token and without posting', async () => {
    const res = await publishCardPost({
      pageId: '123', token: 'SECRET_TOKEN', imagePath: '/tmp/whatever.png',
      caption: 'cap', dryRun: true,
    });
    expect(res.dryRun).toBe(true);
    expect(res.endpoint).toBe('https://graph.facebook.com/v21.0/123/photos');
    expect(res.fields.message).toBe('cap');
    expect(JSON.stringify(res)).not.toContain('SECRET_TOKEN');
  });
});
