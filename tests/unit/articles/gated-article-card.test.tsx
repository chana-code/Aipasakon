import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GatedArticleCard } from '@/components/articles/GatedArticleCard';

const article = {
  slug: 'sample-locked',
  title: 'บทความล็อก',
  summary: 'คำโปรย',
  type: 'inline' as const,
  file: 'sample-locked.html',
};

describe('GatedArticleCard', () => {
  it('renders title, summary, and links to the article', () => {
    render(<GatedArticleCard article={article} />);
    expect(screen.getByText('บทความล็อก')).toBeInTheDocument();
    expect(screen.getByText('คำโปรย')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/articles/sample-locked');
  });

  it('shows a lock indicator', () => {
    render(<GatedArticleCard article={article} />);
    expect(screen.getByLabelText('ล็อก')).toBeInTheDocument();
  });
});
