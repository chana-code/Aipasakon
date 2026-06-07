'use client';

import { StageCard } from '../ui/StageCard';

// Stage 4 — append the predicted token and loop. The newly added piece is
// highlighted in yellow (the teacher's-mark wash), matching lab.html.
// ␣ marks spaces in the new piece.

export function GenerateStage({
  baseText,
  newPart,
  busy,
  onStep,
  onAuto,
}: {
  baseText: string;
  newPart: string;
  busy: boolean;
  onStep: () => void;
  onAuto: () => void;
}) {
  const newDisplay = newPart.replace(/ /g, '␣');
  return (
    <StageCard
      no={4}
      title="เขียนต่อ (Generate)"
      desc="เอาคำที่ทำนายได้มาต่อท้าย แล้ววนกลับไปข้อ 1 ใหม่ = การเขียนข้อความ"
    >
      <p className="text-[17px] leading-[1.8] my-[10px] text-[#2c2722]">
        {baseText}
        {newDisplay && (
          <span className="bg-[#FDF6E0] rounded-[4px] px-[2px] whitespace-pre">{newDisplay}</span>
        )}
      </p>
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={onStep}
          disabled={busy}
          className="bg-white text-[#00958F] border border-[#00958F] rounded-[10px] px-4 py-[10px] text-[15px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ＋ คำต่อไป (ทีละคำ)
        </button>
        <button
          type="button"
          onClick={onAuto}
          disabled={busy}
          className="bg-white text-[#00958F] border border-[#00958F] rounded-[10px] px-4 py-[10px] text-[15px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ▶▶ เขียนต่อ 20 คำ
        </button>
      </div>
    </StageCard>
  );
}
