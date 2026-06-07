'use client';

import { SCALE_ROWS, FILE_ROWS } from './engine/deepseekFacts';

// Part 1 — "what's in the model file": the real file table plus the
// Qwen-vs-DeepSeek scale comparison. Static, real numbers. Copy verbatim
// from lab.html.

function FileWhat({ what }: { what: string }) {
  // FILE_ROWS encodes emphasis as __word__; render that bold.
  const m = what.match(/^(.*?)__(.+?)__(.*)$/);
  if (!m) return <>{what}</>;
  return (
    <>
      {m[1]}
      <b>{m[2]}</b>
      {m[3]}
    </>
  );
}

const card =
  'bg-[#fffdf9] border border-[#e7ddcf] rounded-[14px] p-5 my-4';

export function ScalePanel() {
  return (
    <div>
      <h3 className="text-[20px] font-bold mt-[34px] mb-1 text-[#2c2722]">
        ส่วนที่ 1 — ในไฟล์โมเดลมีอะไร?
      </h3>
      <p className="text-[#7a6f63] text-[14px] mb-0">
        &quot;โมเดล&quot; คือโฟลเดอร์ที่มีไฟล์ไม่กี่ไฟล์ หัวใจคือไฟล์ตัวเลขมหาศาล (weights)
      </p>

      {/* File-structure table */}
      <div className={card}>
        <strong className="text-[#2c2722]">โครงสร้างไฟล์จริง</strong>{' '}
        <span className="text-[#2c2722]">(จากโมเดล Qwen2.5-0.5B)</span>
        <table className="w-full border-collapse text-[14px] mt-2">
          <tbody>
            <tr>
              <th className="text-left p-[7px_8px] border-b border-[#e7ddcf] text-[#7a6f63] font-semibold">
                ไฟล์
              </th>
              <th className="text-left p-[7px_8px] border-b border-[#e7ddcf] text-[#7a6f63] font-semibold">
                คืออะไร
              </th>
            </tr>
            {FILE_ROWS.map((r) => (
              <tr key={r.file}>
                <td className="text-left p-[7px_8px] border-b border-[#e7ddcf]">
                  <code className="bg-[#f3eee5] px-[5px] py-px rounded-[5px] text-[13px]">
                    {r.file}
                  </code>
                </td>
                <td className="text-left p-[7px_8px] border-b border-[#e7ddcf] text-[#2c2722]">
                  <FileWhat what={r.what} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scale comparison */}
      <div className={card}>
        <strong className="text-[#2c2722]">
          โมเดลเล็กในแล็บนี้ เทียบกับ DeepSeek (ตัวจริงระดับโลก)
        </strong>
        <p className="text-[#7a6f63] text-[14px] mt-1 mb-[10px]">
          ชิ้นส่วนเหมือนกันเป๊ะ ต่างกันแค่ &quot;จำนวน&quot; ประมาณ 1,000 เท่า
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <tbody>
              <tr>
                <th className="text-left p-[7px_8px] border-b border-[#e7ddcf] text-[#7a6f63] font-semibold" />
                <th className="text-left p-[7px_8px] border-b border-[#e7ddcf] text-[#7a6f63] font-semibold">
                  Qwen2.5-0.5B (แล็บนี้)
                </th>
                <th className="text-left p-[7px_8px] border-b border-[#e7ddcf] text-[#7a6f63] font-semibold">
                  DeepSeek-V3
                </th>
              </tr>
              {SCALE_ROWS.map((r) => (
                <tr key={r.label}>
                  <td className="text-left p-[7px_8px] border-b border-[#e7ddcf] text-[#2c2722]">
                    {r.label}
                  </td>
                  <td className="text-left p-[7px_8px] border-b border-[#e7ddcf] font-bold tabular-nums text-[#2c2722]">
                    {r.small}
                  </td>
                  <td className="text-left p-[7px_8px] border-b border-[#e7ddcf] font-bold tabular-nums text-[#2c2722]">
                    {r.deepseek}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
