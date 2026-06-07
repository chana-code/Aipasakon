'use client';

// A single token, shown as a stacked chip: display text on top, vocab id below.
// Clickable so the learner can inspect the embedding of any token.
// ␣ marks a space, matching lab.html.

export function TokenChip({
  text,
  id,
  selected,
  onClick,
}: {
  text: string;
  id: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  const display = text.replace(/ /g, '␣') || '·';
  return (
    <button
      type="button"
      data-testid="token-chip"
      onClick={onClick}
      className={`inline-flex flex-col items-center rounded-[9px] border px-[9px] py-[5px] m-[3px] cursor-pointer transition-colors ${
        selected
          ? 'border-[#14B5AB] bg-[#EAF8F6]'
          : 'border-[#e7ddcf] bg-white hover:border-[#14B5AB]'
      }`}
    >
      <b className="text-[15px] font-semibold text-[#2c2722] whitespace-pre">{display}</b>
      <span className="text-[11px] text-[#7a6f63] tabular-nums">{id}</span>
    </button>
  );
}
