import Link from 'next/link';
import { AvatarMedia } from '@/components/landing/AvatarMedia';


export default function AboutPage() {
  return (
    <>
      {/* Header Section */}
      <section className="max-w-[720px] mx-auto px-6 mb-20 mt-8 text-center md:text-left">
        <h1
          className={`text-[40px] leading-[1.2] font-bold text-[#00143C] mb-6`}
        >
          เกี่ยวกับ AI ภาษาคน
        </h1>
        <p className="text-[18px] leading-[1.8] text-[#00143C]/70">
          AI กำลังมา และไม่มีใครหยุดมันได้ — เป้าหมายของที่นี่คือช่วยให้คนไทยปรับตัวทัน
          ด้วยภาษาที่คนเข้าใจจริงๆ ไม่ใช่ศัพท์เทคนิคที่ยากเกินเข้าถึง
        </p>
      </section>

      {/* Founder Section */}
      <section className="max-w-[720px] mx-auto px-6 mb-24">
        <div
          className="flex flex-col md:flex-row items-center gap-10 bg-white p-8 rounded-xl border border-[#E8E2D4]/30"
          style={{ boxShadow: '0 4px 20px rgba(0, 20, 60, 0.05)' }}
        >
          {/* Avatar: looping face video (B2, cropped to face + white-clipped). The
              mp4 has an opaque near-white bg hidden by mix-blend-mode:multiply inside
              AvatarMedia; the cream circle below is its blend backdrop, so white melts
              into cream and only the navy line-art face shows. Static circle (no
              opacity/transform animation) keeps multiply working. */}
          <div
            className="w-40 h-40 shrink-0 relative overflow-hidden rounded-full border-4 border-[#f5f3ee] bg-[#f0eee9]"
            aria-label="ผู้ก่อตั้ง อ๋อง"
          >
            <AvatarMedia
              cover
              video="/landing/video/ong-face.mp4"
              poster="/landing/avatar/ong-face.png"
              className="h-full w-full"
            />
          </div>

          <div>
            <h2
              className={`text-[28px] leading-[1.3] font-semibold text-[#00143C] mb-2`}
            >
              อ๋อง (Ong)
            </h2>
            <p className="text-[#14B5AB] font-medium mb-4">
              ผู้ก่อตั้งและเรียบเรียงเนื้อหา
            </p>
            <p className="text-[18px] leading-[1.8] text-[#00143C]/70 mb-4">
              ผมเรียนจบปริญญาตรี คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์
              แล้วใช้เวลากว่า 7 ปีในโลกของ Insurtech และ Fintech ในบทบาท VP Commercial —
              เป็นหนึ่งในทีมที่ช่วยขยายสตาร์ทอัพประกันภัยจากบริษัทเล็กๆ จนระดมทุนจากนักลงทุนระดับภูมิภาค
              เติบโตข้ามหลายประเทศในเอเชียตะวันออกเฉียงใต้ และถูกควบรวมโดยกลุ่มบริษัทประกันเทคโนโลยีชั้นนำของภูมิภาคในที่สุด
            </p>
            <p className="text-[18px] leading-[1.8] text-[#00143C]/70 mb-4">
              หน้าที่หลักของผมตลอดมาคือการเป็น &ldquo;ล่าม&rdquo; ระหว่างโลกธุรกิจกับเทคโนโลยี —
              แปลสิ่งที่ทีมวิศวกรสร้าง ให้กลายเป็นภาษาที่คนทำธุรกิจฟังแล้วตัดสินใจได้จริง
              และนั่นคือสิ่งเดียวกับที่ผมตั้งใจทำที่นี่กับเรื่อง AI
            </p>
            <p className="text-[18px] leading-[1.8] text-[#00143C]/70 italic">
              &ldquo;ผมไม่ได้มาสอนคุณเขียนโค้ด แต่ผมจะสอนคุณสั่งงาน AI ให้เหมือนสั่งงานทีมงานเก่งๆ
              สักคน ด้วยมุมมองของนักธุรกิจ ไม่ใช่นักพัฒนาโปรแกรม&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-[720px] mx-auto px-6 mb-24">
        <div className="border-l-4 border-[#14B5AB] pl-8 py-2">
          <h2
            className={`text-[28px] leading-[1.3] font-semibold text-[#00143C] mb-6`}
          >
            ทำไมต้องเป็นตำรา ไม่ใช่คอนเทนต์
          </h2>
          <div className="space-y-6 text-[18px] leading-[1.8] text-[#00143C]/70">
            <p>
              ในยุคที่ข้อมูลล้นทะลัก (Information Overload) การเสพคอนเทนต์รายวันอาจทำให้เรารู้สึก
              &ldquo;ทันโลก&rdquo; แต่กลับไม่มีโครงสร้างความรู้ที่ยั่งยืน
            </p>
            <p>
              <strong>AI ภาษาคน</strong> จึงถูกออกแบบมาให้เป็น &ldquo;ตำราดิจิทัล&rdquo; ที่มีโครงสร้างชัดเจน
              ข้อมูลทุกส่วนจะสะสมพอกพูน (Compounding Knowledge) เพื่อให้คุณต่อยอดได้จริงในระยะยาว
              ไม่ใช่แค่ข่าวที่ผ่านมาแล้วผ่านไป
            </p>
          </div>
        </div>
      </section>

      {/* Framework Section: See → Say → Steer (V-T-J) */}
      <section className="max-w-[720px] mx-auto px-6 mb-24">
        <h2
          className={`text-[28px] leading-[1.3] font-semibold text-[#00143C] mb-8 text-center`}
        >
          วิธีคิดของเรา: See → Say → Steer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Vision */}
          <div
            className="bg-white p-6 rounded-xl border border-[#E8E2D4]/20 hover:-translate-y-1 transition-transform"
            style={{ boxShadow: '0 4px 20px rgba(0, 20, 60, 0.05)' }}
          >
            <div className="w-10 h-10 bg-[#14B5AB]/10 text-[#14B5AB] rounded-lg flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <h3 className={`text-xl font-semibold text-[#00143C] mb-2`}>Vision</h3>
            <p className="text-[#00143C]/70 text-sm">
              มองออกว่างานไหนควรใช้ AI และอะไรคือผลลัพธ์ที่ดี
            </p>
          </div>

          {/* Translation */}
          <div
            className="bg-white p-6 rounded-xl border border-[#E8E2D4]/20 hover:-translate-y-1 transition-transform"
            style={{ boxShadow: '0 4px 20px rgba(0, 20, 60, 0.05)' }}
          >
            <div className="w-10 h-10 bg-[#14B5AB]/10 text-[#14B5AB] rounded-lg flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <h3 className={`text-xl font-semibold text-[#00143C] mb-2`}>Translation</h3>
            <p className="text-[#00143C]/70 text-sm">
              สื่อสารและสั่งงาน AI ให้ได้ตามภาพที่อยู่ในหัว
            </p>
          </div>

          {/* Judgment */}
          <div
            className="bg-white p-6 rounded-xl border border-[#E8E2D4]/20 hover:-translate-y-1 transition-transform"
            style={{ boxShadow: '0 4px 20px rgba(0, 20, 60, 0.05)' }}
          >
            <div className="w-10 h-10 bg-[#14B5AB]/10 text-[#14B5AB] rounded-lg flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">settings_suggest</span>
            </div>
            <h3 className={`text-xl font-semibold text-[#00143C] mb-2`}>Judgment</h3>
            <p className="text-[#00143C]/70 text-sm">
              ขัดเกลาและตัดสินใจเลือกผลลัพธ์ที่ดีที่สุด
            </p>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="max-w-[720px] mx-auto px-6 mb-24">
        <h2
          className={`text-[28px] leading-[1.3] font-semibold text-[#00143C] mb-8`}
        >
          เราเชื่อแบบนี้
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-5 bg-[#f5f3ee] rounded-lg border border-[#E8E2D4]/10">
            <span className="material-symbols-outlined text-[#14B5AB]">check_circle</span>
            <div>
              <h4 className="font-bold text-[#00143C]">ภาษาคน ไม่ใช่ศัพท์เทคนิค</h4>
              <p className="text-[#00143C]/70 text-sm mt-1">
                ทุกบทเรียนถูกแปลจาก Tech Speak เป็น Business Speak ที่เข้าใจง่ายที่สุด
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#f5f3ee] rounded-lg border border-[#E8E2D4]/10">
            <span className="material-symbols-outlined text-[#14B5AB]">check_circle</span>
            <div>
              <h4 className="font-bold text-[#00143C]">ลงมือทำได้จริง</h4>
              <p className="text-[#00143C]/70 text-sm mt-1">
                เน้นกรณีศึกษาที่เจอในชีวิตการทำงานจริง ไม่ใช่แค่ทฤษฎีในห้องแล็บ
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#f5f3ee] rounded-lg border border-[#E8E2D4]/10">
            <span className="material-symbols-outlined text-[#14B5AB]">check_circle</span>
            <div>
              <h4 className="font-bold text-[#00143C]">ซื่อสัตย์เรื่องข้อจำกัดของ AI</h4>
              <p className="text-[#00143C]/70 text-sm mt-1">
                เราบอกชัดเจนว่าอะไรที่ AI ทำไม่ได้ และอะไรที่มนุษย์ยังต้องควบคุม
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#f5f3ee] rounded-lg border border-[#E8E2D4]/10">
            <span className="material-symbols-outlined text-[#14B5AB]">check_circle</span>
            <div>
              <h4 className="font-bold text-[#00143C]">ฟรีและอัปเดตเรื่อยๆ</h4>
              <p className="text-[#00143C]/70 text-sm mt-1">
                ความรู้พื้นฐานควรเข้าถึงได้ทุกคน และเราจะปรับปรุงเนื้อหาให้ทันสมัยอยู่เสมอ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="max-w-[720px] mx-auto px-6 pb-24">
        <div className="bg-[#14B5AB]/20 rounded-2xl p-10 text-center border border-[#14B5AB]/10">
          <h2
            className={`text-[28px] leading-[1.3] font-semibold text-[#00403c] mb-4`}
          >
            พร้อมเริ่มหรือยัง?
          </h2>
          <p className="text-[18px] leading-[1.8] text-[#00403c]/80 mb-8 max-w-md mx-auto">
            เริ่มต้นสร้างรากฐานที่แข็งแรง เพื่อให้คุณก้าวไปข้างหน้าพร้อมกับ AI อย่างมั่นใจ
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/what-is-ai"
              className="bg-[#14B5AB] text-white px-8 py-3 rounded-xl text-[14px] font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              เริ่มที่พื้นฐาน{' '}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link
              href="/curriculum"
              className="border border-[#14B5AB] text-[#14B5AB] px-8 py-3 rounded-xl text-[14px] font-medium hover:bg-[#14B5AB]/5 transition-all flex items-center justify-center"
            >
              ดูหลักสูตรทั้งหมด
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
