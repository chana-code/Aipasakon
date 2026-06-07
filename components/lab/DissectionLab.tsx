'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  AttentionData,
  AttentionExample,
  EmbedRow,
  Prediction,
  TokenInfo,
} from './types';
import { createEngine, type DissectionEngine } from './engine/modelEngine';
import { ScalePanel } from './ScalePanel';
import { TokenizeStage } from './stages/TokenizeStage';
import { EmbedStage } from './stages/EmbedStage';
import { PredictStage } from './stages/PredictStage';
import { GenerateStage } from './stages/GenerateStage';
import { AttentionStage } from './stages/AttentionStage';

const ATTENTION_URL = '/lab/attentionExamples.json';

// Client-only orchestrator. Loads Qwen2.5-0.5B in the browser, runs a sentence
// through five stages, and exposes the generate loop. Faithful port of lab.html
// behavior; all Thai copy carried over verbatim. The engine is the only
// transformers.js consumer.

export function DissectionLab({
  defaultText = 'The cat sat on the mat',
}: {
  defaultText?: string;
}) {
  const engineRef = useRef<DissectionEngine | null>(null);

  const [text, setText] = useState(defaultText);
  const [status, setStatus] = useState(
    'กำลังโหลดสมองของโมเดล… (ครั้งแรกครั้งเดียว ~0.5GB แล้วจะถูกแคชไว้)',
  );
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  // attention examples (independent of model; may load before/after it)
  const [attData, setAttData] = useState<AttentionData | null>(null);

  // run results
  const [tokens, setTokens] = useState<TokenInfo[] | null>(null);
  const [selected, setSelected] = useState(0);
  const [embedRow, setEmbedRow] = useState<EmbedRow | null>(null);
  const [embedLoading, setEmbedLoading] = useState(false);
  const [embedError, setEmbedError] = useState<string | undefined>();
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);

  // generate
  const [genBase, setGenBase] = useState('');
  const [genNew, setGenNew] = useState('');

  // attention view
  const [attExample, setAttExample] = useState<AttentionExample | null>(null);
  const [attLayer, setAttLayer] = useState(0);
  const [attHead, setAttHead] = useState(0);
  const [ran, setRan] = useState(false);

  // ---------- load precomputed attention ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(ATTENTION_URL);
        if (r.ok && !cancelled) {
          const data: AttentionData = await r.json();
          setAttData(data);
          setAttLayer(Math.floor(data.layers / 2)); // a middle layer is most interpretable
          setAttHead(0);
        }
      } catch {
        /* presets are optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- load model ----------
  useEffect(() => {
    let cancelled = false;
    const engine = createEngine();
    engineRef.current = engine;
    (async () => {
      try {
        await engine.load((pct, file) => {
          if (cancelled) return;
          setProgress(pct);
          setStatus(`กำลังโหลด ${file} … ${pct}%`);
        });
        if (cancelled) return;
        setProgress(null);
        setReady(true);
        setStatus('พร้อมแล้ว ✓ (โมเดลรันอยู่ในเบราว์เซอร์คุณ ไม่มีการส่งข้อมูลออกไปไหน)');
      } catch (e) {
        if (!cancelled) setStatus('โหลดโมเดลไม่สำเร็จ: ' + (e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- embed the selected token (live range-read) ----------
  async function selectToken(idx: number, toks: TokenInfo[]) {
    setSelected(idx);
    const engine = engineRef.current;
    if (!engine) return;
    setEmbedError(undefined);
    setEmbedLoading(true);
    setEmbedRow(null);
    const tok = toks[idx];
    if (!tok) return;
    try {
      const row = await engine.embed(tok.id, 48);
      setEmbedRow({ ...row, tokenIndex: idx });
    } catch (e) {
      setEmbedError((e as Error).message);
    } finally {
      setEmbedLoading(false);
    }
  }

  function updateAttention(t: string) {
    const ex = attData ? attData.sentences.find((s) => s.text === t) ?? null : null;
    setAttExample(ex);
  }

  // ---------- run the full pipeline ----------
  async function run(inputText: string) {
    const engine = engineRef.current;
    if (!engine || !engine.ready) return;
    setBusy(true);
    setStatus('กำลังคิด…');
    try {
      const t = inputText.trim();
      const toks = await engine.tokenize(t);
      setTokens(toks);
      setRan(true);
      if (toks.length) await selectToken(toks.length - 1, toks);
      const preds = await engine.predict(t, 6);
      setPredictions(preds);
      setGenBase(t);
      setGenNew('');
      updateAttention(t);
      setStatus('เสร็จ ✓ ลองคลิก token ดูตัวเลข, เปลี่ยนชั้น/หัวใน attention, หรือกด ＋คำต่อไป');
    } catch (e) {
      setStatus('ผิดพลาด: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // ---------- generate: one greedy step ----------
  async function stepOnce() {
    const engine = engineRef.current;
    if (!engine || !engine.ready) return;
    setBusy(true);
    try {
      const preds = await engine.predict(text, 6);
      setPredictions(preds);
      if (!preds[0]) return;
      const piece = engine.tokenText(preds[0].id);
      const newText = text + piece;
      setText(newText);
      const toks = await engine.tokenize(newText);
      setTokens(toks);
      setGenBase(newText.slice(0, newText.length - piece.length));
      setGenNew(piece);
    } catch (e) {
      setStatus('ผิดพลาด: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // ---------- generate: auto 20 ----------
  async function autoContinue() {
    const engine = engineRef.current;
    if (!engine || !engine.ready) return;
    setBusy(true);
    try {
      const added = await engine.autoContinue(text, 20);
      const full = text + added;
      setGenBase(text);
      setGenNew(added);
      setText(full);
      const toks = await engine.tokenize(full);
      setTokens(toks);
    } catch (e) {
      setStatus('ผิดพลาด: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const selectedToken = tokens && tokens[selected] ? tokens[selected] : null;

  return (
    <div className="text-[#2c2722] font-['IBM_Plex_Sans_Thai_Looped',sans-serif]">
      <h2 className="text-[30px] font-bold mb-[6px] tracking-[-0.01em]">🔬 LLM Dissection Lab</h2>
      <p className="text-[#7a6f63] mb-6">
        เปิดดูข้างในโมเดล AI จริง ๆ — ว่าในไฟล์เก็บอะไรไว้ แล้วมันทำงานยังไง
        <br />
        <span className="text-[14px]">
          เครื่องยนต์: Qwen2.5-0.5B (โมเดลโอเพนซอร์สจริง ~500 ล้านตัวเลข) รันในเบราว์เซอร์ของคุณเอง
        </span>
      </p>

      {/* PART 1 */}
      <ScalePanel />

      {/* PART 2 */}
      <h3 className="text-[20px] font-bold mt-[34px] mb-1">ส่วนที่ 2 — ดูมันทำงานสด ๆ</h3>
      <p className="text-[#7a6f63] text-[14px] mb-0">
        พิมพ์ประโยคอะไรก็ได้ (ไทยหรืออังกฤษ) แล้วกดรัน — ทุกตัวเลขเป็นของจริงจากไฟล์โมเดล
      </p>

      <div className="bg-[#fffdf9] border border-[#e7ddcf] rounded-[14px] p-5 my-4">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 min-w-[240px] px-3 py-[10px] border border-[#e7ddcf] rounded-[10px] text-[16px] bg-white text-[#2c2722]"
          />
          <button
            type="button"
            onClick={() => run(text)}
            disabled={!ready || busy}
            className="bg-[#14B5AB] text-white border-0 rounded-[10px] px-4 py-[10px] text-[15px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            รัน ▶
          </button>
        </div>

        {attData && (
          <div className="flex flex-wrap gap-2 items-center mt-[10px]">
            <span className="text-[#7a6f63] text-[14px] mr-[2px]">
              ประโยคตัวอย่าง (ดู attention ได้):
            </span>
            {attData.sentences.map((s) => (
              <button
                key={s.text}
                type="button"
                onClick={() => {
                  setText(s.text);
                  run(s.text);
                }}
                disabled={!ready || busy}
                className="bg-white text-[#00958F] border border-[#e7ddcf] rounded-full px-3 py-[6px] text-[13px] font-medium cursor-pointer hover:border-[#14B5AB] hover:bg-[#EAF8F6] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {s.text}
              </button>
            ))}
          </div>
        )}

        <div className="text-[14px] text-[#b45309] min-h-[20px] mt-2">{status}</div>
        {progress !== null && (
          <div className="h-2 bg-[#f1ece3] rounded-[6px] overflow-hidden mt-2">
            <div
              className="h-2 bg-[#14B5AB] transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* STAGES */}
      {ran && tokens && (
        <TokenizeStage
          tokens={tokens}
          selected={selected}
          onSelect={(idx) => selectToken(idx, tokens)}
        />
      )}
      {ran && tokens && (
        <EmbedStage
          token={selectedToken}
          row={embedRow}
          loading={embedLoading}
          error={embedError}
        />
      )}
      {ran && predictions && <PredictStage predictions={predictions} />}
      {ran && (
        <GenerateStage
          baseText={genBase}
          newPart={genNew}
          busy={busy}
          onStep={stepOnce}
          onAuto={autoContinue}
        />
      )}
      {ran && (
        <AttentionStage
          data={attData}
          example={attExample}
          layer={attLayer}
          head={attHead}
          onLayer={setAttLayer}
          onHead={setAttHead}
        />
      )}
    </div>
  );
}

export default DissectionLab;
