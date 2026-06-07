import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Lab from '@/components/lab/Lab';

// next/dynamic resolves async in jsdom; stub the heavy DissectionLab import.
vi.mock('@/components/lab/DissectionLabClient', () => ({
  default: () => <div data-testid="dissection-lab" />,
}));

describe('<Lab>', () => {
  it('renders an iframe for an html lab', () => {
    render(<Lab id="after-send-walkthrough" />);
    const frame = screen.getByTitle('หลังกดส่ง เกิดอะไรขึ้น');
    expect(frame.tagName).toBe('IFRAME');
    expect(frame).toHaveAttribute('src', '/lab/what_happens_after_send_thai_steps.html');
  });

  it('shows a not-found notice for an unknown id', () => {
    render(<Lab id="does-not-exist" />);
    expect(screen.getByText(/ไม่พบแล็บ/)).toBeInTheDocument();
  });
});
