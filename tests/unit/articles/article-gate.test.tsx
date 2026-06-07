import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleGate } from '@/components/articles/ArticleGate';

// AuthForm uses the Supabase browser client + next/navigation; stub it for this unit test.
vi.mock('@/components/auth/AuthForm', () => ({
  AuthForm: ({ redirectTo }: { redirectTo?: string }) => (
    <div data-testid="auth-form">redirect:{redirectTo}</div>
  ),
}));

describe('ArticleGate', () => {
  it('shows the title and a sign-in prompt', () => {
    render(<ArticleGate title="บทความล็อก" summary="คำโปรย" slug="sample-locked" />);
    expect(screen.getByText('บทความล็อก')).toBeInTheDocument();
    expect(screen.getByText(/เข้าสู่ระบบ/)).toBeInTheDocument();
  });

  it('passes the article path as the post-login redirect', () => {
    render(<ArticleGate title="t" slug="sample-locked" />);
    expect(screen.getByTestId('auth-form')).toHaveTextContent('redirect:/articles/sample-locked');
  });
});
