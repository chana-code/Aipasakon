export function Wordmark({ size = 18 }: { size?: number }) {
  return (
    <span style={{
      fontFamily: "var(--font-display)",
      fontSize: size,
      fontWeight: 600,
      color: "var(--fg-1)",
      letterSpacing: "-0.005em",
      whiteSpace: "nowrap",
    }}>
      AI <span style={{ color: "var(--teal-500)" }}>ภาษาคน</span>
    </span>
  );
}
