/* Small "tools I use" strip — sits under the hero avatar.
   Mixed logo set (transparent marks + app-icon tiles) is unified by giving
   each one an identical white rounded tile, so it reads as a deliberate set. */

const TOOLS = [
  { name: 'Claude Code', src: '/landing/tools/claude.svg' },
  { name: 'Codex', src: '/landing/tools/openai.svg' },
  { name: 'NotebookLM', src: '/landing/tools/notebooklm.svg' },
  { name: 'Stitch', src: '/landing/tools/stitch.png' },
  { name: 'Higgsfield', src: '/landing/tools/higgsfield.png' },
  { name: 'HeyGen', src: '/landing/tools/heygen.svg' },
];

export function ToolStrip() {
  return (
    <div className="relative z-10 mt-9">
      <p className="mb-3 text-center text-[12px] font-medium text-[#00143C]/50">
        เครื่องมือที่ผมใช้
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {TOOLS.map((tool) => (
          <div
            key={tool.name}
            title={tool.name}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border border-[#00143C]/10 bg-white p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#00143C]/20 hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tool.src}
              alt={`${tool.name} logo`}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
