import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-prose px-6 py-16">
      <div className="flex items-center gap-6 mb-10">
        <Image src="/assets/logo-circular-full.png" alt="AI ภาษาคน" width={88} height={88} priority />
        <div>
          <h1 className="font-thai text-3xl font-semibold">AI ภาษาคน</h1>
          <p className="text-fg-2">AI ไม่ยาก ถ้าพูดภาษาคน</p>
        </div>
      </div>

      <article className="font-thai text-lg leading-relaxed text-navy-900 space-y-5">
        <p>ผม Ong — VP Commercial ที่ Fairdee (Qoala Group) ทำงานในวงการ insurtech ภูมิภาคมา 7+ ปี</p>
        <p>เว็บนี้ไม่ใช่บล็อก ไม่ใช่หน้า landing ขายคอร์ส และไม่ใช่ที่รวมข่าว AI — เป็น <strong>ตำราเรียน</strong> ภาษาไทยสำหรับคนทำงาน ที่อยากเข้าใจ AI ตั้งแต่ระดับพื้นฐานจนถึงระดับลึก</p>
        <p>ทุกบทเขียนจากมุมของ <em>คนที่ใช้งานจริง</em> ไม่ใช่ผู้สอนหรือ influencer — มีอะไรไม่รู้ก็จะบอก มีอะไรที่ overhype ในวงการก็จะชี้ให้เห็น</p>
        <p>ถ้าอ่านแล้วเห็นว่ามีอะไรผิด หรือมีอะไรที่ควรเขียนเพิ่ม — ติดต่อมาทาง email ได้ตลอด</p>
      </article>
    </div>
  );
}
