import type { Track } from '../types';

export interface Theme {
  bg: string; ink: string; lead: string; kick: string; accent: string;
  site: string; tag: string; rule: string; bar: string;
}

const BAR = 'linear-gradient(90deg,#14B5AB 0 38%,#E8C547 38% 100%)';

export const THEMES: Record<Track, Theme> = {
  tools: { bg:'#00143C', ink:'#FFFFFF', lead:'#C7D2E6', kick:'#39D0C6', accent:'#39D0C6', site:'#FFFFFF', tag:'#9FB0C9', rule:'rgba(255,255,255,.16)', bar:BAR },
  news:  { bg:'#EAF8F6', ink:'#00143C', lead:'#1E3463', kick:'#006B7A', accent:'#006B7A', site:'#00143C', tag:'#5B6577', rule:'#CDE9E5', bar:BAR },
  knowledge: { bg:'#FBF9F4', ink:'#00143C', lead:'#1E3463', kick:'#006B7A', accent:'#006B7A', site:'#00143C', tag:'#5B6577', rule:'#ECE7DA', bar:BAR },
};
