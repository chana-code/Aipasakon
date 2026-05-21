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
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "72px 28px 96px" }}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--fg-3)",
          marginBottom: 12,
        }}>About · เกี่ยวกับ</div>

        <h1 style={{
          margin: "0 0 24px",
          fontFamily: "var(--font-display)",
          fontSize: 44,
          fontWeight: 600,
          color: "var(--fg-1)",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}>AI ภาษาคน</h1>
        <p style={{
          margin: "0 0 24px",
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 600,
          color: "var(--teal-500)",
          letterSpacing: "-0.005em",
          lineHeight: 1.2,
        }}>ตำราเรียน AI ภาษาไทย<br />โดยคนที่ไม่ใช่ developer</p>

        {/* Author card */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
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
          <div>
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
      </div>
    </main>
  );
}
