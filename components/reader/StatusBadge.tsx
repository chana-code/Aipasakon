const STATUS_COLOR: Record<string, string> = {
  stub:     '#94896E',
  drafting: '#C18A2E',
  reviewed: '#14B5AB',
  stable:   '#2A7A3F',
};

export function StatusBadge({ status }: { status: 'stub' | 'drafting' | 'reviewed' | 'stable' }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 10px 3px 8px",
      borderRadius: 999,
      background: "#fff",
      border: "1px solid var(--line-2)",
      fontFamily: "var(--font-latin)",
      fontSize: 11.5,
      fontWeight: 500,
      color: "var(--fg-2)",
      letterSpacing: "0.01em",
      lineHeight: 1.4,
    }}>
      <span style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: STATUS_COLOR[status] ?? STATUS_COLOR.stub,
        flexShrink: 0,
      }} />
      {status}
    </span>
  );
}
