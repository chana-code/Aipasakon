import { loadGlossary } from '@/lib/content/glossary';

export default async function GlossaryPage() {
  const entries = (await loadGlossary()).slice().sort((a, b) => a.term_en.localeCompare(b.term_en));

  return (
    <div className="mx-auto max-w-prose px-6 py-12">
      <h1 className="font-thai text-3xl font-semibold mb-2">คำศัพท์</h1>
      <p className="text-fg-2 mb-10">คำศัพท์ AI ที่ใช้ในหลักสูตร พร้อมคำแปลและคำอธิบายภาษาไทย</p>

      <dl className="space-y-6">
        {entries.map(e => (
          <div key={e.term_en} className="border-b border-line pb-4">
            <dt className="font-mono text-navy-900 text-lg">
              {e.term_en} <span className="font-thai text-fg-3 text-base ml-2">— {e.term_th}</span>
            </dt>
            <dd className="font-thai text-fg-2 mt-2 leading-relaxed">{e.definition_th}</dd>
            {e.see_also.length > 0 && (
              <p className="text-sm text-fg-3 mt-2">
                เกี่ยวข้อง: {e.see_also.join(', ')}
              </p>
            )}
          </div>
        ))}
        {entries.length === 0 && <p className="text-fg-3 italic">ยังไม่มีคำศัพท์</p>}
      </dl>
    </div>
  );
}
