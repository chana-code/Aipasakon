'use client';

// Renders a row of embedding values as colored cells.
// Color logic ported verbatim from lab.html: values are small, amplified x6,
// clamped to [-1,1]. Red = positive, blue = negative. Hover shows the real value.

function heatColor(v: number): string {
  const c = Math.max(-1, Math.min(1, v * 6));
  return c >= 0
    ? `rgba(220,38,38,${c.toFixed(3)})`
    : `rgba(37,99,235,${(-c).toFixed(3)})`;
}

export function Heatmap({ values }: { values: number[] }) {
  return (
    <div className="flex flex-wrap gap-[3px] mt-[6px]">
      {values.map((v, i) => (
        <span
          key={i}
          data-testid="heat-cell"
          title={v.toFixed(5)}
          className="w-5 h-5 rounded-[3px]"
          style={{ background: heatColor(v), border: '1px solid #0001' }}
        />
      ))}
    </div>
  );
}
