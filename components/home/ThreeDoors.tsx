import Link from 'next/link';

const DOORS = [
  { href: '/foundations',       label: 'ไม่เคยรู้จัก AI เลย',         color: 'var(--teal-500)' },
  { href: '/using-ai',          label: 'ใช้ AI อยู่บ้าง อยากใช้ดีขึ้น', color: 'var(--blue-500)' },
  { href: '/building-with-ai',  label: 'อยากสร้างของด้วย AI',          color: 'var(--orange-500)' },
];

export function ThreeDoors() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <h2 className="font-thai text-xl mb-6 text-fg-2">เริ่มจากตรงนี้</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {DOORS.map(d => (
          <Link
            key={d.href}
            href={d.href}
            className="block rounded-lg border border-line bg-white p-6 hover:bg-teal-50 hover:border-line-strong transition-colors duration-150 ease-calm"
            style={{ borderLeftWidth: '3px', borderLeftColor: d.color }}
          >
            <span className="font-thai text-lg text-navy-900">{d.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
