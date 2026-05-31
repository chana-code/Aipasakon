import Link from 'next/link';

const proseAbout: React.CSSProperties = {
  fontFamily: "var(--font-thai)",
  fontSize: 17.5,
  lineHeight: 1.9,
  color: "var(--fg-1)",
  margin: "0 0 22px",
};

export default function AboutPage() {
  return (
    <main style={{ background: "var(--bg-page)" }}>
      <div className="max-w-[720px] mx-auto px-4 md:px-7 pt-10 md:pt-[72px] pb-16 md:pb-24">
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--fg-3)",
          marginBottom: 12,
        }}>About · เกี่ยวกับ</div>

        <h1 className="text-[28px] md:text-[44px]" style={{
          margin: "0 0 24px",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          color: "var(--fg-1)",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}>AI ภาษาคน</h1>
        <p className="text-xl md:text-[26px]" style={{
          margin: "0 0 24px",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          color: "var(--teal-500)",
          letterSpacing: "-0.005em",
          lineHeight: 1.2,
        }}>ตำราเรียน AI ภาษาไทย<br />โดยคนที่ไม่ใช่ developer</p>

        {/* Author card */}
        <div className="flex flex-col sm:flex-row items-center gap-4" style={{
          margin: "32px 0 40px",
          padding: "18px 20px",
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 10,
        }}>
          <div style={{
            width: 72,
            height: 72,
            flexShrink: 0,
            borderRadius: "50%",
            background: "var(--paper-2)",
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 600,
            color: "var(--navy-700)",
          }}>O</div>
          <div className="text-center sm:text-left">
            <div style={{
              fontFamily: "var(--font-thai)",
              fontSize: 17,
              fontWeight: 600,
              color: "var(--fg-1)",
            }}>Ong</div>
            <div style={{
              fontFamily: "var(--font-thai)",
              fontSize: 14,
              color: "var(--fg-3)",
              marginTop: 2,
              lineHeight: 1.5,
            }}>VP of Commercial · Fairdee (Qoala Group) · 7+ years in insurtech/fintech</div>
          </div>
        </div>

        <p style={proseAbout}>
          ผมเริ่มเขียนตำราเล่มนี้เพราะเนื้อหา AI ภาษาไทยที่{' '}
          <strong style={{ fontWeight: 600 }}>&ldquo;เขียนจากคนที่เอาไปใช้จริงในธุรกิจ&rdquo;</strong>
          {' '}— ไม่ใช่จาก developer สอน code, ไม่ใช่จาก hype account ที่เน้นคลิก — ยังน้อยมาก.
          คนทำงานที่อยากใช้ AI ให้คุ้ม ต้องไปอ่านบล็อกอังกฤษ หรือดู TikTok ที่บอก &ldquo;AI จะมาแย่งงานคุณ&rdquo; —
          ทั้งสองทางไม่ช่วยให้ใช้งานจริงได้.
        </p>
        <p style={proseAbout}>
          ตำรานี้คือสิ่งที่ผมอยากให้คนทำงานคนหนึ่ง — manager, นักวิเคราะห์, เจ้าของธุรกิจ, นักศึกษาเริ่มทำงาน —
          อ่านในปี 2026 แล้วเข้าใจ AI พอจะ{' '}
          <strong style={{ fontWeight: 600 }}>คุย</strong> ·{' '}
          <strong style={{ fontWeight: 600 }}>ใช้</strong> ·{' '}
          <strong style={{ fontWeight: 600 }}>สร้าง</strong>
          {' '}โดยไม่ต้องไปทน hype หรือ jargon ที่ไม่มีคนอธิบาย.
        </p>

        <h2 style={{
          margin: "48px 0 14px",
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 600,
          color: "var(--fg-1)",
        }}>วิธีที่ตำรานี้ต่างจากเนื้อหา AI อื่น</h2>
        <ul style={{
          paddingLeft: 22,
          color: "var(--fg-1)",
          fontFamily: "var(--font-thai)",
          fontSize: 16.5,
          lineHeight: 1.85,
        }}>
          <li><strong style={{ fontWeight: 600 }}>Business-first lens</strong> — ไม่ใช่ developer สอน code. คนทำงานสอนวิธีคิด</li>
          <li><strong style={{ fontWeight: 600 }}>Thai-first</strong> — เขียนเป็นไทยตั้งแต่ต้น ไม่ใช่แปลจากอังกฤษ</li>
          <li><strong style={{ fontWeight: 600 }}>Practical over hype</strong> — ทุกบทจบด้วย &ldquo;ลองทำดู&rdquo; หรือ &ldquo;ใช้ในงานยังไง&rdquo;</li>
          <li><strong style={{ fontWeight: 600 }}>Honest about limits</strong> — บทไหนยัง stub บอกว่า stub — ไม่แกล้งสมบูรณ์</li>
        </ul>

        <h2 style={{
          margin: "48px 0 14px",
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 600,
          color: "var(--fg-1)",
        }}>ตำรานี้ไม่ใช่อะไร</h2>
        <ul style={{
          paddingLeft: 22,
          color: "var(--fg-2)",
          fontFamily: "var(--font-thai)",
          fontSize: 16,
          lineHeight: 1.85,
        }}>
          <li>ไม่ใช่ blog ที่จัดเรียงตามวันที่</li>
          <li>ไม่ใช่ funnel ของคอร์ส — ยังไม่มีคอร์สขาย</li>
          <li>ไม่มี popup ขอ email, ไม่มี &ldquo;Master AI ใน 7 วัน&rdquo;</li>
          <li>ไม่มี comment, like, social proof — ตำราไม่ต้องวัด engagement</li>
          <li>ไม่ต้อง login เพื่ออ่าน. การอ่านคือทั้งหมดที่ตำราเสนอ.</li>
        </ul>

        {/* V-T-J framework */}
        <h2 style={{
          margin: "48px 0 6px",
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 600,
          color: "var(--fg-1)",
        }}>วิธีคิดของเรา: See → Say → Steer</h2>
        <p style={{
          fontFamily: "var(--font-thai)",
          fontSize: 15,
          color: "var(--fg-3)",
          margin: "0 0 20px",
        }}>ทุกทักษะ AI ใช้สามอย่างนี้เสมอ — ไม่ว่าจะทำภาพ ทำสไลด์ หรือเขียนงาน</p>
        <div className="grid gap-4 sm:grid-cols-3" style={{ marginBottom: 8 }}>
          {[
            { step: 'See', name: 'Vision', desc: 'มองออกว่าผลลัพธ์ที่ดีหน้าตาเป็นยังไง ก่อนจะสั่ง AI' },
            { step: 'Say', name: 'Translation', desc: 'สั่ง AI ให้ตรงใจ ด้วยภาษาที่มันเข้าใจ' },
            { step: 'Steer', name: 'Judgment', desc: 'ดูออกว่าผลลัพธ์ผิดตรงไหน แล้วค่อยๆ ปรับให้ดีขึ้น' },
          ].map(v => (
            <div key={v.step} style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "18px 18px 20px",
            }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--fg-1)" }}>{v.step}</div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--teal-600)", marginBottom: 8 }}>{v.name}</div>
              <p style={{ fontFamily: "var(--font-thai)", fontSize: 14.5, lineHeight: 1.7, color: "var(--fg-2)", margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div style={{
          marginTop: 48,
          padding: "28px 28px 30px",
          background: "var(--navy-900)",
          borderRadius: 12,
          textAlign: "center",
        }}>
          <h2 style={{
            margin: "0 0 16px",
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 600,
            color: "#fff",
          }}>พร้อมเริ่มหรือยัง</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/foundations" style={{
              fontFamily: "var(--font-thai)",
              fontSize: 15,
              fontWeight: 500,
              color: "var(--navy-900)",
              background: "var(--teal-500)",
              padding: "11px 22px",
              borderRadius: 8,
              textDecoration: "none",
            }}>เริ่มที่พื้นฐาน →</Link>
            <Link href="/curriculum" style={{
              fontFamily: "var(--font-thai)",
              fontSize: 15,
              fontWeight: 500,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "11px 22px",
              borderRadius: 8,
              textDecoration: "none",
            }}>ดูหลักสูตร</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
