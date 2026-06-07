'use client';

// One next-token candidate: token label, a filled bar, and the percentage.
// Bar width uses rounded percent; the printed figure keeps one decimal,
// matching lab.html.

export function ProbBar({ token, prob }: { token: string; prob: number }) {
  const display = token.replace(/ /g, '␣');
  const pct = Math.round(prob * 100);
  return (
    <div data-testid="prob-bar" className="flex items-center gap-2 my-[5px]">
      <div className="w-[120px] text-right font-semibold whitespace-pre overflow-hidden text-ellipsis text-[#2c2722]">
        {display}
      </div>
      <div className="flex-1 bg-[#f1ece3] rounded-[6px] h-[18px] overflow-hidden">
        <div className="h-[18px] bg-[#14B5AB] rounded-[6px]" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-[54px] text-[13px] text-[#7a6f63] tabular-nums">
        {(prob * 100).toFixed(1)}%
      </div>
    </div>
  );
}
