'use client';

import type { EmbedRow, TokenInfo } from '../types';
import { Heatmap } from '../ui/Heatmap';
import { StageCard } from '../ui/StageCard';

// Stage 2 — the selected token becomes a real vector read live from the
// safetensors file. Copy carried verbatim from lab.html. `row` may be null
// while the bytes are being fetched.

export function EmbedStage({
  token,
  row,
  loading,
  error,
}: {
  token: TokenInfo | null;
  row: EmbedRow | null;
  loading: boolean;
  error?: string;
}) {
  const tokenDisplay = token ? token.text.replace(/ /g, '␣') || '·' : '';
  return (
    <StageCard
      no={2}
      title="กลายเป็นตัวเลข (Embedding)"
      desc='คำที่เลือกถูกแทนด้วย "เวกเตอร์" ตัวเลขจริงจากไฟล์'
    >
      {token && (
        <p className="text-[#7a6f63] text-[14px] mt-2">
          คำว่า{' '}
          <code className="bg-[#f3eee5] px-[5px] py-px rounded-[5px] text-[13px]">
            {tokenDisplay}
          </code>{' '}
          (id {token.id}) = รายการตัวเลขจริง:
        </p>
      )}
      {error ? (
        <div className="flex flex-wrap gap-[3px] mt-[6px]">
          <span className="text-[#7a6f63] text-[14px]">อ่านไฟล์ไม่สำเร็จ ({error})</span>
        </div>
      ) : loading || !row ? (
        <div className="mt-[6px]">
          <span className="text-[#7a6f63] text-[14px]">กำลังอ่านจากไฟล์…</span>
        </div>
      ) : (
        <>
          <Heatmap values={row.values} />
          <p className="text-[#7a6f63] text-[14px] mt-2">
            แสดง {row.values.length} จาก {row.fullDim} ตัวเลข — ทุกตัวอ่านสด ๆ จาก{' '}
            <code className="bg-[#f3eee5] px-[5px] py-px rounded-[5px] text-[13px]">
              model.safetensors
            </code>{' '}
            (เอาเมาส์ชี้เพื่อดูค่าจริง) แดง=บวก น้ำเงิน=ลบ
          </p>
        </>
      )}
    </StageCard>
  );
}
