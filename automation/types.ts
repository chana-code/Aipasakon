export type Track = 'tools' | 'news' | 'knowledge';

/** One styled segment of the hook line. */
export interface HookSpan {
  text: string;
  /** lead = muted body, mark = yellow highlighter, accent = teal, plain = ink */
  style: 'lead' | 'mark' | 'accent' | 'plain';
  /** keep this segment from wrapping mid-phrase (e.g. "super computer") */
  nowrap?: boolean;
}

export interface CardConfig {
  track: Track;
  kicker: string;       // top-left label, e.g. "ข่าว AI"
  hook: HookSpan[];     // ordered segments composing the hook line
}

export interface LedgerEntry {
  date: string;                 // ISO date, supplied by caller (no Date.now in pure code)
  track: Track;
  subject: string;              // repo name / headline / page slug
  status: 'posted' | 'skipped' | 'draft';
  sourceUrl?: string;
  blogUrl?: string;
  postId?: string;
  card?: string;                // path to rendered PNG
  angle?: string;               // Tools: which angle/command was used
  skipReason?: string;
}

export interface Ledger {
  rotationIndex: number;        // advances each run; track = ROTATION[idx % 3]
  runs: LedgerEntry[];
}
