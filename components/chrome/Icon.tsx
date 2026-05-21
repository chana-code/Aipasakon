/* Lucide-style inline SVG icon, 1.5px stroke, currentColor */
export function Icon({ d, size = 18, viewBox = "0 0 24 24" }: {
  d: string;
  size?: number;
  viewBox?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}

export const Icons = {
  search:  '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  arrowR:  '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowL:  '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  chevD:   '<path d="m6 9 6 6 6-6"/>',
  chevR:   '<path d="m9 6 6 6-6 6"/>',
  book:    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  link:    '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><path d="M8 12h8"/>',
  clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  hash:    '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  copy:    '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
} as const;
