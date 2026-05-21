import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer style={{ marginTop: 80, padding: "32px 28px 48px", borderTop: "1px solid var(--line)" }}>
      <div style={{
        maxWidth: 1180,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}>
        <Wordmark size={15} />
        <span style={{ fontFamily: "var(--font-thai)", fontSize: 13, color: "var(--fg-3)" }}>
          AI ไม่ยาก ถ้าพูดภาษาคน · by Ong
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>
          v0.1 · last updated 2026-05-22
        </span>
      </div>
    </footer>
  );
}
