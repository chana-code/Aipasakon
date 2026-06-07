import Link from 'next/link';
import { labsBySection, type Lab } from '@/lib/lab/registry';

export const metadata = { title: 'AI Lab — เล่นกับ AI ให้เข้าใจจริง — AI ภาษาคน' };

// Exhaustive by Lab['status'] so a new status added to the registry forces an update here.
const STATUS_LABEL: Record<Lab['status'], string> = { live: '', beta: 'BETA', soon: 'เร็วๆ นี้' };

export default function LabPage() {
  const groups = labsBySection();

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3">AI Lab</h1>
          <p className="text-[18px] leading-[1.8] text-[#00143C]/70 max-w-[640px]">
            เครื่องมือทดลองแบบโต้ตอบ ที่ให้คุณ &quot;เล่น&quot; กับแนวคิด AI ได้จริง
            แต่ละชิ้นจับคู่กับบทเรียน เพื่อให้เข้าใจจากการลงมือ ไม่ใช่แค่การอ่าน
          </p>
        </div>

        {groups.map(group => (
          <section key={group.key} className="mb-14">
            <h2 className="text-[24px] leading-[1.3] font-bold text-[#00143C] mb-6">{group.label_th}</h2>

            <div className="grid md:grid-cols-2 gap-5">
              {group.labs.map(lab => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </div>
          </section>
        ))}

        {/* groups.length (not LABS.length): labsBySection drops empty sections, so an
            empty groups array means there are no labs to show at all. */}
        {groups.length === 0 && <p className="text-[#6c7a78] italic">ยังไม่มีแล็บ</p>}
      </div>
    </div>
  );
}

const CARD_BASE =
  'group flex flex-col bg-white rounded-lg border border-[#E8E2D4] p-6 no-underline transition-all duration-200';

function LabCard({ lab }: { lab: Lab }) {
  const soon = lab.status === 'soon';

  const inner = (
    <>
      <div className="flex items-start gap-2 mb-2">
        <h3 className="text-[20px] leading-[1.3] font-semibold text-[#00143C] flex-1">{lab.title_th}</h3>
        {STATUS_LABEL[lab.status] && (
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4F1E9] text-[#00143C]/50">
            {STATUS_LABEL[lab.status]}
          </span>
        )}
      </div>
      <p className="text-[15px] leading-[1.7] text-[#00143C]/80 mb-4">{lab.blurb}</p>
      {soon ? (
        <span className="mt-auto inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#00143C]/40">
          เร็วๆ นี้
        </span>
      ) : (
        <span className="mt-auto inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#14B5AB] group-hover:gap-2 transition-all">
          เปิดแล็บ
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </span>
      )}
    </>
  );

  // "soon" labs are not yet interactive — render a non-clickable card instead of a dead link.
  if (soon) {
    return <div className={`${CARD_BASE} opacity-70`} aria-disabled="true">{inner}</div>;
  }
  return (
    <Link href={`/lab/${lab.id}`} className={`${CARD_BASE} hover:-translate-y-0.5 hover:shadow-md`}>
      {inner}
    </Link>
  );
}
