// Shared types for the LLM Dissection Lab.
// The engine (modelEngine.ts) is the only producer of these; every stage is a
// pure renderer driven by them, so the visuals are testable without a model.

// One token after tokenization.
export interface TokenInfo {
  id: number; // vocabulary id, e.g. 2644
  text: string; // display text for the piece, e.g. "the" or "แมว"
  index: number; // position in the sequence, 0-based
}

// One token's embedding (a real slice of the model's numbers).
export interface EmbedRow {
  tokenIndex: number;
  values: number[]; // the real decimals; a representative slice (first N dims)
  fullDim: number; // true embedding width (e.g. 896) so UI can say "showing 48 of 896"
}

// Attention for one (layer, head): seq x seq weights in [0,1].
export interface AttentionMatrix {
  layer: number;
  head: number;
  weights: number[][]; // weights[i][j] = how much token i attends to token j
}

// One candidate next token with its probability.
export interface Prediction {
  token: string;
  id: number;
  prob: number; // 0..1, already softmaxed
}

// A precomputed attention example (loaded from /lab/attentionExamples.json).
export interface AttentionExample {
  text: string;
  tokens: { id: number; text: string }[];
  // attention[layer][head][i][j]
  attention: number[][][][];
}

// The full precomputed-attention payload.
export interface AttentionData {
  model: string;
  layers: number;
  heads: number;
  sentences: AttentionExample[];
}
