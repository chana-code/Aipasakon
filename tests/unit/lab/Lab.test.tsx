import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Lab from '@/components/lab/Lab';

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

  it('renders the dissection lab as a self-contained html iframe', () => {
    render(<Lab id="dissection-lab" />);
    const frame = screen.getByTitle('ผ่าตัดดูข้างใน LLM');
    expect(frame.tagName).toBe('IFRAME');
    expect(frame).toHaveAttribute('src', '/lab/dissection-lab.html');
  });
});
