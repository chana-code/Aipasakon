import { describe, it, expect } from 'vitest';
import { loadAllPosts, loadPost } from '@/lib/content/blog';

describe('blog loader', () => {
  it('loads the seed post with string date', async () => {
    const post = await loadPost('welcome');
    expect(post.title).toBe('ยินดีต้อนรับสู่บล็อก AI ภาษาคน');
    expect(post.date).toBe('2026-06-07');
    expect(typeof post.body).toBe('string');
  });

  it('lists posts newest-first', async () => {
    const posts = await loadAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1]!.date >= posts[i]!.date).toBe(true);
    }
  });
});
