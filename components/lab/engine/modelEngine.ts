// The ONLY file that imports @huggingface/transformers.
// Ports lab.html's engine logic faithfully:
//  - tokenize via AutoTokenizer
//  - embed via HTTP Range-read of the safetensors (embedRow), bf16 decode
//  - predict via logits softmax top-k
//  - generate (greedy single step + auto multi-step via model.generate)
// Stages never import this; they consume plain types from ../types.

import type { TokenInfo, EmbedRow, Prediction } from '../types';

const ONNX_ID = 'onnx-community/Qwen2.5-0.5B'; // BASE model = continues text naturally
const WEIGHTS_URL = 'https://huggingface.co/Qwen/Qwen2.5-0.5B/resolve/main/model.safetensors';

export type LoadProgress = (pct: number, label: string) => void;

export interface DissectionEngine {
  ready: boolean;
  load(onProgress?: LoadProgress): Promise<void>;
  tokenize(text: string): Promise<TokenInfo[]>;
  // text for one token id (for greedy-append display)
  tokenText(id: number): string;
  embed(id: number, n?: number): Promise<EmbedRow>;
  predict(text: string, topK?: number): Promise<Prediction[]>;
  // greedy auto-continue; returns the appended text only
  autoContinue(text: string, maxNewTokens?: number): Promise<string>;
}

// ---------- safetensors / bf16 helpers (ported verbatim from lab.html) ----------
function bf16(b0: number, b1: number): number {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint16(2, (b1 << 8) | b0, true);
  return new DataView(b).getFloat32(0, true);
}

function softmaxTopK(
  logits: Float32Array | number[],
  start: number,
  vocab: number,
  k: number,
): Array<[number, number]> {
  const at = (i: number): number => logits[start + i] as number;
  let max = -Infinity;
  for (let i = 0; i < vocab; i++) {
    const v = at(i);
    if (v > max) max = v;
  }
  let sum = 0;
  for (let i = 0; i < vocab; i++) sum += Math.exp(at(i) - max);
  const top: Array<[number, number]> = [];
  for (let i = 0; i < vocab; i++) {
    const p = Math.exp(at(i) - max) / sum;
    if (top.length < k || p > top[top.length - 1]![1]) {
      top.push([i, p]);
      top.sort((a, b) => b[1] - a[1]);
      if (top.length > k) top.pop();
    }
  }
  return top;
}

export function createEngine(modelId: string = ONNX_ID): DissectionEngine {
  // transformers.js objects are intentionally `any` — typings are loose and the
  // tensor `.data`/`.dims` shapes are confirmed against lab.html's working code.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let tokenizer: any = null;
  let model: any = null;

  // safetensors embed cache (ported from lab.html)
  let embHeader: Record<string, any> | null = null;
  let embDataStart = 0;
  let embInfo: { name: string; shape: number[]; data_offsets: number[] } | null = null;

  const range = async (s: number, e: number): Promise<Uint8Array> =>
    new Uint8Array(
      await (await fetch(WEIGHTS_URL, { headers: { Range: `bytes=${s}-${e}` } })).arrayBuffer(),
    );

  const engine: DissectionEngine = {
    ready: false,

    async load(onProgress?: LoadProgress) {
      const t = await import('@huggingface/transformers');
      t.env.allowRemoteModels = true;
      tokenizer = await t.AutoTokenizer.from_pretrained(modelId);
      model = await t.AutoModelForCausalLM.from_pretrained(modelId, {
        dtype: 'q4',
        device:
          typeof navigator !== 'undefined' && (navigator as any).gpu ? 'webgpu' : 'wasm',
        progress_callback: (p: any) => {
          if (p.status === 'progress' && p.total) {
            const pct = Math.round((p.loaded / p.total) * 100);
            onProgress?.(pct, p.file || '');
          }
        },
      });
      this.ready = true;
    },

    async tokenize(text: string): Promise<TokenInfo[]> {
      const enc = await tokenizer(text);
      const ids = Array.from(enc.input_ids.data as ArrayLike<number>).map(Number);
      return ids.map((id, index) => ({ id, text: tokenizer.decode([id]), index }));
    },

    tokenText(id: number): string {
      return tokenizer.decode([id]);
    },

    // read one real embedding row from the weight file via HTTP range requests
    async embed(id: number, n = 48): Promise<EmbedRow> {
      if (!embHeader) {
        const lenB = await range(0, 7);
        const hLen = Number(new DataView(lenB.buffer).getBigUint64(0, true));
        embHeader = JSON.parse(new TextDecoder().decode(await range(8, 8 + hLen - 1)));
        embDataStart = 8 + hLen;
        const name = Object.keys(embHeader!).find((k) => /embed_tokens\.weight$/.test(k))!;
        embInfo = { name, ...embHeader![name] };
      }
      const dim = embInfo!.shape[1]!;
      const rs = embDataStart + embInfo!.data_offsets[0]! + id * dim * 2;
      const rb = await range(rs, rs + n * 2 - 1);
      const values: number[] = [];
      for (let i = 0; i < n; i++) values.push(bf16(rb[i * 2]!, rb[i * 2 + 1]!));
      return { tokenIndex: -1, values, fullDim: dim };
    },

    async predict(text: string, topK = 6): Promise<Prediction[]> {
      const enc = await tokenizer(text);
      const out = await model(enc);
      const { dims, data } = out.logits;
      const vocab = dims[2];
      const start = (dims[1] - 1) * vocab;
      const top = softmaxTopK(data, start, vocab, topK);
      return top.map(([id, prob]) => ({ id, prob, token: tokenizer.decode([id]) }));
    },

    async autoContinue(text: string, maxNewTokens = 20): Promise<string> {
      const enc = await tokenizer(text);
      const ids = await model.generate({ ...enc, max_new_tokens: maxNewTokens, do_sample: false });
      const arr = Array.from((ids.data ?? ids[0].data) as ArrayLike<number>).map(Number);
      const full = tokenizer.decode(arr, { skip_special_tokens: true });
      return full.slice(text.length);
    },
  };

  return engine;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export { ONNX_ID };
