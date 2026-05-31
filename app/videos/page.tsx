import Link from 'next/link';
import { loadAllVideos } from '@/lib/content/videos';
import { LEVELS, LEVEL_META } from '@/lib/content/levels';

const SERIF = "font-['Noto_Serif_Thai',serif]";

// Fixed hex values per PORT-CONVENTIONS.md per-level colors
const LEVEL_HEX: Record<string, string> = {
  foundations:        '#14B5AB',
  'using-ai':         '#2D7CD6',
  'building-with-ai': '#B45A1A',
  advanced:           '#7A3FA0',
};

export default async function VideosIndex() {
  const videos = await loadAllVideos();

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-12 md:py-16">

        {/* Page header */}
        <div className="mb-12">
          <h1 className={`${SERIF} text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3`}>
            วิดีโอ
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-[18px] leading-[1.8] text-[#00143C]/70">
            เนื้อหาเสริมแบบวิดีโอ จัดเรียงตามระดับของหลักสูตร
          </p>
        </div>

        {/* Level sections */}
        {LEVELS.map(level => {
          const items = videos.filter(v => v.level === level);
          if (items.length === 0) return null;
          const hex = LEVEL_HEX[level] ?? '#14B5AB';
          const meta = LEVEL_META[level];

          return (
            <section key={level} className="mb-14">
              <h2 className={`${SERIF} text-[28px] leading-[1.3] font-semibold mb-6`} style={{ color: hex }}>
                {meta.label_th}
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                {items.map(v => {
                  const cardHex = LEVEL_HEX[v.level] ?? '#14B5AB';
                  return (
                    <Link
                      key={v.slug}
                      href={`/videos/${v.slug}`}
                      className="group block bg-white rounded-lg border border-[#E8E2D4] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* Thumbnail placeholder with play icon */}
                      <div
                        className="relative w-full"
                        style={{ paddingBottom: '56.25%' /* 16:9 */ }}
                      >
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: `${cardHex}14` }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '56px', color: cardHex, opacity: 0.7 }}
                          >
                            play_circle
                          </span>
                        </div>
                        {/* Teal top-border accent on hover */}
                        <div
                          className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ background: cardHex }}
                        />
                      </div>

                      {/* Card body */}
                      <div className="p-5">
                        {/* Level chip */}
                        <span
                          className="inline-block font-['DM_Sans',sans-serif] text-[14px] font-medium px-3 py-0.5 rounded-full mb-3"
                          style={{ background: `${cardHex}1a`, color: cardHex }}
                        >
                          {meta.label_th}
                        </span>

                        <h3 className={`${SERIF} text-[18px] leading-[1.4] font-semibold text-[#00143C] mb-2`}>
                          {v.title}
                        </h3>

                        {v.description && (
                          <p className="font-['DM_Sans',sans-serif] text-[14px] leading-[1.6] text-[#00143C]/70">
                            {v.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {videos.length === 0 && (
          <p className="font-['DM_Sans',sans-serif] text-[#6c7a78] italic">ยังไม่มีวิดีโอ</p>
        )}
      </div>
    </div>
  );
}
