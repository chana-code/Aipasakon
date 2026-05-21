import { describe, it, expect } from 'vitest';
import { loadAllVideos, loadVideo } from '@/lib/content/videos';

describe('videos loader', () => {
  it('loads all videos and validates schema', async () => {
    const videos = await loadAllVideos();
    expect(videos.length).toBeGreaterThan(0);
    expect(videos[0]!.youtube_id).toBeTruthy();
  });

  it('loads a single video by slug', async () => {
    const v = await loadVideo('intro-to-ai');
    expect(v.title).toContain('AI');
  });
});
