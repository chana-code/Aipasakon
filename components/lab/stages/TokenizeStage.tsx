'use client';

import type { TokenInfo } from '../types';
import { TokenChip } from '../ui/TokenChip';
import { StageCard } from '../ui/StageCard';

// Stage 1 — chop the sentence into tokens. Clicking a chip selects it for the
// embed stage. The note counts Thai pieces, matching lab.html.

export function TokenizeStage({
  tokens,
  selected,
  onSelect,
}: {
  tokens: TokenInfo[];
  selected: number;
  onSelect: (idx: number) => void;
}) {
  const thai = tokens.filter((t) => /[฀-๿]/.test(t.text)).length;
  return (
    <StageCard
      no={1}
      title="หั่นเป็น Tokens"
      desc="ข้อความแตกเป็นชิ้น ๆ แต่ละชิ้นมีเลขประจำตัว (คลิกชิ้นไหนก็ได้เพื่อดูตัวเลขข้างใน)"
    >
      <div className="flex flex-wrap mt-[10px]">
        {tokens.map((t) => (
          <TokenChip
            key={t.index}
            text={t.text}
            id={t.id}
            selected={t.index === selected}
            onClick={() => onSelect(t.index)}
          />
        ))}
      </div>
      <p className="text-[#7a6f63] text-[14px] mt-2">
        {tokens.length} tokens — สังเกต: ภาษาไทยมักถูกหั่นเป็นชิ้นเล็กกว่า (เจอ {thai}{' '}
        ชิ้นที่เป็นไทย) ขณะที่คำอังกฤษมักอยู่เป็นคำเต็ม ␣ = ช่องว่าง
      </p>
    </StageCard>
  );
}
