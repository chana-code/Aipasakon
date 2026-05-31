import { loadGlossary } from '@/lib/content/glossary';
import { GlossaryFilter } from '@/components/glossary/GlossaryFilter';

export default async function GlossaryPage() {
  const entries = (await loadGlossary()).slice().sort((a, b) =>
    a.term_en.localeCompare(b.term_en)
  );

  return (
    <main style={{ background: "var(--bg-page)" }}>
      <div className="max-w-[880px] mx-auto px-4 md:px-7 pt-8 md:pt-14 pb-16 md:pb-24">
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--fg-3)",
          marginBottom: 12,
        }}>Glossary · ภาคผนวกศัพท์</div>

        <h1 className="text-[28px] md:text-[44px]" style={{
          margin: "0 0 16px",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          color: "var(--fg-1)",
          letterSpacing: "-0.01em",
        }}>คำศัพท์ — Thai + English</h1>

        <p style={{
          fontFamily: "var(--font-thai)",
          fontSize: 17,
          lineHeight: 1.8,
          color: "var(--fg-2)",
          maxWidth: 640,
          margin: "0 0 40px",
        }}>
          ศัพท์เทคนิคทุกคำในตำราถูก link มาที่นี่ครั้งแรกที่ปรากฏ.
          ถ้าศัพท์ไหนต้องการอธิบายยาวกว่านี้ มี topic note แยกในหลักสูตร — ดู &ldquo;บทเต็ม&rdquo; ด้านขวาของแต่ละ entry.
        </p>

        <GlossaryFilter entries={entries} />
      </div>
    </main>
  );
}
