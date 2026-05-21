const COLORS = {
  stub:     'border-fg-3 text-fg-3',
  drafting: 'border-orange-500 text-orange-600',
  reviewed: 'border-teal-500 text-teal-600',
  stable:   'border-navy-900 text-navy-900',
} as const;

const LABELS = {
  stub: 'stub', drafting: 'drafting', reviewed: 'reviewed', stable: 'stable',
} as const;

export function StatusBadge({ status }: { status: keyof typeof COLORS }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${COLORS[status]}`}>
      {LABELS[status]}
    </span>
  );
}
