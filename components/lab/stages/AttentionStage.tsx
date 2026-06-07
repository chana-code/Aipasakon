'use client';

import type { AttentionData, AttentionExample } from '../types';
import { StageCard } from '../ui/StageCard';

// Stage 5 — attention is example-mode: real PyTorch-precomputed weights for a
// few curated sentences (ONNX exposes only logits, not attentions). When the
// current text matches an example, show the seq x seq grid with a layer/head
// picker. Otherwise prompt the learner to pick a preset. Copy verbatim from
// lab.html.

function escSpace(s: string): string {
  return s.replace(/ /g, '␣') || '·';
}

export function AttentionStage({
  data,
  example,
  layer,
  head,
  onLayer,
  onHead,
}: {
  data: AttentionData | null;
  example: AttentionExample | null;
  layer: number;
  head: number;
  onLayer: (l: number) => void;
  onHead: (h: number) => void;
}) {
  const toks = example ? example.tokens.map((t) => escSpace(t.text)) : [];
  const n = toks.length;
  const matrix = example ? example.attention[layer]?.[head] : null;

  return (
    <StageCard
      no={5}
      title='Attention — คำไหน "มอง" คำไหน'
      desc='หัวใจของ Transformer: ก่อนทายคำต่อไป แต่ละคำจะ "มอง" คำอื่น ๆ เพื่อเก็บบริบท'
    >
      {example ? (
        <p className="text-[#7a6f63] text-[14px] mt-2">
          ค่าจริงจากโมเดล (คำนวณไว้ล่วงหน้าด้วย PyTorch) สำหรับประโยคนี้:
        </p>
      ) : (
        <p className="text-[#7a6f63] text-[14px] mt-2">
          💡 attention คำนวณล่วงหน้าเฉพาะประโยคตัวอย่าง — กดปุ่ม &quot;ประโยคตัวอย่าง&quot;
          ด้านบนเพื่อดูแบบจริง
        </p>
      )}

      {example && data && matrix && (
        <>
          <div className="flex flex-wrap gap-2 items-center my-[10px]">
            <label className="text-[#7a6f63] text-[14px] flex items-center gap-1">
              ชั้น (layer):
              <select
                value={layer}
                onChange={(e) => onLayer(Number(e.target.value))}
                className="px-2 py-1 border border-[#e7ddcf] rounded-[7px] bg-white text-[14px] text-[#2c2722]"
              >
                {Array.from({ length: data.layers }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[#7a6f63] text-[14px] flex items-center gap-1">
              หัว (head):
              <select
                value={head}
                onChange={(e) => onHead(Number(e.target.value))}
                className="px-2 py-1 border border-[#e7ddcf] rounded-[7px] bg-white text-[14px] text-[#2c2722]"
              >
                {Array.from({ length: data.heads }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <th />
                  {toks.map((t, j) => (
                    <th
                      key={j}
                      className="text-[11px] text-[#7a6f63] font-medium h-[62px] whitespace-nowrap align-bottom text-center p-0"
                    >
                      <span
                        className="inline-block pb-1"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        {t}
                      </span>
                    </th>
                  ))}
                </tr>
                {Array.from({ length: n }, (_, i) => (
                  <tr key={i}>
                    <th className="text-[12px] text-[#2c2722] font-medium text-right pr-2 whitespace-nowrap p-0">
                      {toks[i]}
                    </th>
                    {Array.from({ length: n }, (_, j) => {
                      const v = matrix[i]?.[j] ?? 0;
                      return (
                        <td
                          key={j}
                          data-testid="attn-cell"
                          title={v.toFixed(3)}
                          className="w-[30px] h-[30px] text-center p-0"
                          style={{
                            border: '1px solid #fff',
                            background: `rgba(15,118,110,${Math.min(1, v).toFixed(3)})`,
                          }}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[#7a6f63] text-[14px] mt-2">
            ชั้นที่ {layer} · หัวที่ {head} — แต่ละแถวคือคำหนึ่งคำ ช่องเข้ม = คำนั้น &quot;มอง&quot;
            คำในคอลัมน์มาก (ค่าจริงจากโมเดล แต่ละแถวรวมกัน = 1). สังเกต: มุมขวาบนว่าง
            เพราะคำมองได้แค่คำ &quot;ก่อนหน้า&quot; เท่านั้น
          </p>
        </>
      )}
    </StageCard>
  );
}
