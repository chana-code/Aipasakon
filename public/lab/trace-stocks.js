/*
 * harness-anatomy / sim / trace-stocks.js
 * ---------------------------------------------------------------------------
 * Bilingual (TH primary / EN secondary) replay of a real task:
 * "Claude, research interesting AI stocks and put them in a .md file."
 *
 * Each event carries:
 *   - label / content / detail  (bilingual _th/_en) : friendly explanation
 *   - raw                       (verbatim, one language) : THE ACTUAL TEXT that
 *     goes into or comes out of the model. This is the point of the whole thing:
 *     to show the real machinery, not just describe it. Mostly English (the real
 *     payloads), Thai where the human actually typed Thai.
 *
 * SCHEMA: id, turn, actor, type, tool?, tags[], surface, group?, subs?[],
 *   label_th/label_en, content_th/content_en, detail_th/detail_en, raw,
 *   state{ ctx, toolsUsed, approx }
 *   ( toolsUsed = array of friendly tool names used SO FAR, for the right panel )
 */

window.HARNESS_TRACE = {
  meta: {
    captured: "2026-06-08",
    engine: "claude-opus-4-8",
    session_th: "ตัวอย่างจริง: ค้นหุ้น AI แล้วเขียนลงไฟล์",
    session_en: "Real task: research AI stocks, write a .md file"
  },

  events: [
    // ───────────────── SESSION BOOT ─────────────────
    {
      id:1, turn:0, actor:"harness", type:"boot", surface:"core", tags:["primary-source"],
      label_th:"ระบบเตรียมตัวก่อนเริ่ม", label_en:"The system gets ready",
      content_th:"ก่อนคุณพิมพ์อะไร ระบบป้อนกฎและข้อมูลพื้นฐานให้โมเดลอ่านก่อน",
      content_en:"Before you type, the system feeds the model its rules and basics.",
      detail_th:"ข้อความด้านล่างนี้แหละ คือสิ่งที่ถูกป้อนเข้าโมเดลจริงๆ โมเดลไม่ได้รู้เองลอยๆ มันรู้เพราะอ่านข้อความนี้",
      detail_en:"The text below is literally what gets fed into the model. It doesn't know on its own, it knows because it reads this.",
      raw:
"You are Claude Code, Anthropic's official CLI for Claude.\n" +
"<env>\n" +
"  working_dir: /Users/admin/AI Page\n" +
"  today: 2026-06-08\n" +
"  model: claude-opus-4-8\n" +
"</env>\n" +
"Be concise and direct. Verify before claiming done.\n" +
"# ... (a few thousand more words of rules)",
      state:{ ctx:6, toolsUsed:[], approx:true }
    },
    {
      id:2, turn:0, actor:"harness", type:"mcp", surface:"core",
      label_th:"เปิดกล่องเครื่องมือ", label_en:"The toolbox opens",
      content_th:"โมเดลได้รายชื่อเครื่องมือที่เรียกใช้ได้ ตอนนี้แค่รู้ว่ามีอะไร ยังไม่ได้ใช้",
      content_en:"The model gets the list of tools it can call. For now it just knows they exist.",
      detail_th:"โมเดลเปล่าๆ ทำได้แค่พิมพ์ตอบ แตะเน็ตหรือไฟล์เองไม่ได้ เครื่องมือคือมือของมัน ข้อความข้างล่างคือรายชื่อเครื่องมือที่ป้อนให้",
      detail_en:"A bare model can only type. Tools are its hands. Below is the literal tool list it's given.",
      raw:
"# Tools available\n" +
"WebSearch(query: string)        search the web\n" +
"Write(file_path, content)       create a file\n" +
"Read(file_path)                 read a file\n" +
"Edit(file_path, old, new)       edit a file\n" +
"# deferred (name only, load on demand): WebFetch, Bash, ...",
      state:{ ctx:8, toolsUsed:[], approx:true }
    },

    // ───────────────── THE TASK ─────────────────
    {
      id:3, turn:1, actor:"user", type:"user-msg", surface:"core",
      label_th:"คุณถามคำถาม", label_en:"You ask",
      content_th:"นี่คือข้อความจริงที่คุณพิมพ์ส่งให้โมเดล",
      content_en:"This is the literal text you typed to the model.",
      detail_th:"สิ่งที่คุณพิมพ์ ในวงการ AI เรียกว่า prompt (คำสั่ง) นี่คือข้อความเข้าที่สำคัญที่สุด เพราะเป็นจุดเริ่มของทุกอย่าง",
      detail_en:"What you type is called a prompt. It's the most important text-in, the start of everything.",
      raw: "Claude ช่วย research หุ้น AI ที่น่าสนใจแล้วเอามาใส่ไว้ใน .md ให้หน่อย",
      state:{ ctx:10, toolsUsed:[], approx:true }
    },
    {
      id:4, turn:1, actor:"model", type:"reasoning", surface:"core",
      label_th:"โมเดลคิดก่อนทำ", label_en:"The model thinks first",
      content_th:"โมเดลรู้ว่าความรู้ตัวเองเก่า เลยตัดสินใจไปค้นข้อมูลใหม่",
      content_en:"The model knows its knowledge is stale, so it decides to search.",
      detail_th:"นี่คือข้อความออกอย่างแรก คือความคิดของโมเดล สังเกตว่ามันรู้ว่าตัวเองรู้ไม่ครบ เลยเลือกไปหาข้อมูลจริงแทนการเดา",
      detail_en:"This is the first text-out, the model's thinking. Notice it knows what it doesn't know and chooses to look it up.",
      raw:
"My knowledge cutoff is January 2026, and stock prices and news change\n" +
"daily. Answering from memory would be stale. I should search the web for\n" +
"current data first. WebSearch is deferred, so I'll load it before calling it.",
      state:{ ctx:12, toolsUsed:[], approx:true }
    },
    {
      id:5, turn:1, actor:"model", type:"tool-call", tool:"ToolSearch", surface:"core", tags:["deferred-fetch"],
      label_th:"หยิบเครื่องมือค้นเว็บออกมา", label_en:"Grab the web-search tool",
      content_th:"โมเดลสั่งโหลดวิธีใช้เครื่องมือค้นเว็บ ข้อความข้างล่างคือคำสั่งจริง",
      content_en:"The model asks to load the web-search tool. Below is the literal call.",
      detail_th:"เครื่องมือมีเยอะ ระบบเลยไม่ยัดทุกอันใส่หัวโมเดลพร้อมกัน มันหยิบเฉพาะอันที่จะใช้ เหมือนช่างเดินไปหยิบเครื่องมือจากกล่องตอนจะใช้",
      detail_en:"Many tools exist, so they aren't all loaded at once. The model grabs only what it needs, like a worker fetching one tool when needed.",
      raw: "ToolSearch({ query: \"select:WebSearch\" })",
      state:{ ctx:13, toolsUsed:[], approx:true }
    },
    {
      id:6, turn:1, actor:"harness", type:"tool-result", tool:"ToolSearch", surface:"core",
      label_th:"เครื่องมือพร้อมใช้แล้ว", label_en:"The tool is ready",
      content_th:"ระบบส่งวิธีใช้เครื่องมือกลับมา ตอนนี้เรียกค้นเว็บได้จริงแล้ว",
      content_en:"The harness returns the tool's schema. Web search is now callable.",
      detail_th:"ข้อความนี้คือผลที่ระบบส่งกลับเข้าโมเดล เป็นข้อความเข้าอย่างหนึ่ง",
      detail_en:"This text is what the harness sends back into the model, a kind of text-in.",
      raw:
"Tool loaded.\n" +
"WebSearch(query: string) — Search the web. Returns titles, URLs, snippets.",
      state:{ ctx:14, toolsUsed:[], approx:true }
    },
    {
      id:7, turn:1, actor:"model", type:"reasoning", surface:"core",
      label_th:"วางแผนค้น 4 มุมพร้อมกัน", label_en:"Plan: 4 searches at once",
      content_th:"โมเดลวางแผนยิงคำค้น 4 อันพร้อมกันให้ครอบคลุม",
      content_en:"The model plans to fire 4 searches at once for coverage.",
      detail_th:"แทนที่จะค้นทีละอันให้เสียเวลา โมเดลเลือกยิงพร้อมกันในจังหวะเดียว",
      detail_en:"Instead of one at a time, it fires them together in a single step.",
      raw:
"I'll cover the space in one parallel batch of 4 searches:\n" +
"1) interesting AI stocks  2) chip stocks\n" +
"3) software stocks        4) power / data-center stocks",
      state:{ ctx:15, toolsUsed:[], approx:true }
    },

    // ───────────────── 4 PARALLEL SEARCHES ─────────────────
    {
      id:8, turn:1, actor:"model", type:"tool-call", tool:"WebSearch", surface:"core", tags:["parallel"], group:1,
      label_th:"ค้น: หุ้น AI ที่น่าสนใจ", label_en:"Search: interesting AI stocks",
      content_th:"คำค้นที่ 1 ของชุดที่ยิงพร้อมกัน",
      content_en:"Query 1 of the batch fired together.",
      detail_th:"ทั้ง 4 คำค้นถูกส่งออกในจังหวะเดียว นี่คือข้อความออก เพราะโมเดลเป็นคนสั่ง การทำหลายอย่างพร้อมกันเรียกว่า parallel (ขนาน)",
      detail_en:"All 4 go out together. This is text-out, the model issued it. Doing many at once is called parallel.",
      raw: "WebSearch({ query: \"most interesting AI stocks 2026 to watch\" })",
      state:{ ctx:16, toolsUsed:["ค้นเว็บ"], approx:true }
    },
    {
      id:9, turn:1, actor:"model", type:"tool-call", tool:"WebSearch", surface:"core", tags:["parallel"], group:1,
      label_th:"ค้น: หุ้นชิป AI", label_en:"Search: AI chip stocks",
      content_th:"คำค้นที่ 2 ยิงไปพร้อมกัน",
      content_en:"Query 2, fired together.",
      detail_th:"อีกหนึ่งคำค้นในชุดเดียวกัน",
      detail_en:"Another query in the same batch.",
      raw: "WebSearch({ query: \"AI chip stocks 2026 Nvidia Broadcom AMD TSMC outlook\" })",
      state:{ ctx:16, toolsUsed:["ค้นเว็บ"], approx:true }
    },
    {
      id:10, turn:1, actor:"model", type:"tool-call", tool:"WebSearch", surface:"core", tags:["parallel"], group:1,
      label_th:"ค้น: หุ้นซอฟต์แวร์ AI", label_en:"Search: AI software stocks",
      content_th:"คำค้นที่ 3 ยิงไปพร้อมกัน",
      content_en:"Query 3, fired together.",
      detail_th:"อีกหนึ่งคำค้นในชุดเดียวกัน",
      detail_en:"Another query in the same batch.",
      raw: "WebSearch({ query: \"AI software stocks 2026 Palantir ServiceNow enterprise AI\" })",
      state:{ ctx:16, toolsUsed:["ค้นเว็บ"], approx:true }
    },
    {
      id:11, turn:1, actor:"model", type:"tool-call", tool:"WebSearch", surface:"core", tags:["parallel"], group:1,
      label_th:"ค้น: หุ้นพลังงาน / ดาต้าเซ็นเตอร์", label_en:"Search: power / data-center stocks",
      content_th:"คำค้นที่ 4 ครบทั้งชุด",
      content_en:"Query 4, the batch is complete.",
      detail_th:"คำค้นสุดท้ายในชุด ครบทั้ง 4 มุม",
      detail_en:"The last query in the batch. All 4 angles covered.",
      raw: "WebSearch({ query: \"AI datacenter power energy stocks 2026 Vertiv\" })",
      state:{ ctx:16, toolsUsed:["ค้นเว็บ"], approx:true }
    },

    // ───────────────── RESULTS COME BACK ─────────────────
    {
      id:12, turn:1, actor:"harness", type:"tool-result", tool:"WebSearch", surface:"core", tags:["primary-source"],
      label_th:"ผลค้นกลับมาทั้งหมด", label_en:"All the results come back",
      content_th:"ข้อมูลจริงจากเว็บถูกส่งกลับเข้าโมเดล นี่คือตัวอย่างข้อความที่กลับมา",
      content_en:"Real web data flows back into the model. Below is a sample of what returned.",
      detail_th:"นี่คือจังหวะที่ข้อความเข้าก้อนใหญ่ที่สุด ข้อมูลหลายหน้าถูกป้อนกลับให้โมเดลอ่าน สังเกตแถบพื้นที่ความจำทางขวาเต็มขึ้นเยอะ",
      detail_en:"This is the biggest text-in. Pages of data flow back. Watch the memory bar on the right jump up.",
      raw:
"NVIDIA: FY2026 revenue +65% YoY, data-center revenue $194B, ~32x fwd P/E.\n" +
"TSMC: Q4 profit +35% (record); 2026 capex $52-56B; ~24x fwd P/E.\n" +
"Broadcom: AI revenue >$30B but guidance only reiterated -> shares -15%.\n" +
"Palantir: 2026 guide ~71% growth but ~105x fwd P/E (expensive).\n" +
"Vertiv: power/cooling, revenue +34%, EPS ~$5.14. 'Power is the bottleneck.'\n" +
"... (4 result sets, dozens of links and snippets returned)",
      state:{ ctx:58, toolsUsed:["ค้นเว็บ"], approx:true }
    },
    {
      id:13, turn:1, actor:"model", type:"reasoning", surface:"core",
      label_th:"อ่าน เรียบเรียง แล้วจัดกลุ่ม", label_en:"Read, organize, group",
      content_th:"โมเดลย่อยข้อมูลดิบ แล้ววางโครงเป็น 4 ชั้น",
      content_en:"The model digests the raw data into a 4-layer structure.",
      detail_th:"โมเดลไม่ได้ก็อปมาแปะ มันย่อยข้อมูลให้เป็นโครงที่อ่านง่าย สิ่งที่มันคิดและเรียบเรียงทั้งหมดนี้คือข้อความออก",
      detail_en:"It doesn't paste. It shapes the data into a readable structure. All that shaping is text-out.",
      raw:
"Plan the file: 4 layers (chips -> infra/power -> platforms -> software).\n" +
"One block per stock: what it does, why interesting (use the numbers above),\n" +
"one risk each. Add a 'not financial advice' disclaimer at the top.",
      state:{ ctx:64, toolsUsed:["ค้นเว็บ"], approx:true }
    },

    // ───────────────── WRITE THE FILE ─────────────────
    {
      id:14, turn:1, actor:"model", type:"tool-call", tool:"Write", surface:"core",
      label_th:"เขียนลงไฟล์ .md", label_en:"Write the .md file",
      content_th:"โมเดลสั่งใช้เครื่องมือเขียนไฟล์ ข้างล่างคือคำสั่งจริง",
      content_en:"The model calls the write tool. Below is the literal call.",
      detail_th:"คำสั่งเขียนไฟล์นี้ก็เป็นข้อความออก เพราะเป็นสิ่งที่โมเดลสร้างขึ้นแล้วส่งให้ระบบไปลงมือทำ",
      detail_en:"The write command is text-out too, produced by the model and handed to the harness to execute.",
      raw:
"Write({\n" +
"  file_path: \"AI-Stocks-Research-2026.md\",\n" +
"  content: \"# หุ้น AI ที่น่าสนใจ — มิถุนายน 2026\\n\\n> หมายเหตุ: ไม่ใช่คำแนะนำการลงทุน ...\\n\\n## ชั้นที่ 1 — ชิป\\n### NVIDIA (NVDA) ...\"\n" +
"})",
      state:{ ctx:70, toolsUsed:["ค้นเว็บ"], approx:true }
    },
    {
      id:15, turn:1, actor:"harness", type:"tool-result", tool:"Write", surface:"core",
      label_th:"ไฟล์ถูกสร้างเรียบร้อย", label_en:"The file is created",
      content_th:"ระบบลงมือเขียนไฟล์จริง แล้วส่งผลกลับว่าสำเร็จ",
      content_en:"The harness actually writes the file, then reports success.",
      detail_th:"ระบบเป็นคนเขียนไฟล์จริง ไม่ใช่โมเดล โมเดลแค่บอกว่าจะเขียนอะไร ผลที่กลับมาเป็นข้อความเข้าว่าทำสำเร็จแล้ว",
      detail_en:"The harness writes the file, not the model. The model only said what to write. The result comes back as text-in.",
      raw: "File created successfully at /Users/admin/AI Page/AI-Stocks-Research-2026.md",
      state:{ ctx:72, toolsUsed:["ค้นเว็บ","เขียนไฟล์"], approx:true }
    },
    {
      id:16, turn:1, actor:"model", type:"reply", surface:"core",
      label_th:"ตอบกลับคุณ", label_en:"Reply to you",
      content_th:"โมเดลพิมพ์คำตอบสุดท้ายที่คุณเห็นบนจอ",
      content_en:"The model writes the final answer you see on screen.",
      detail_th:"ลูปจบเมื่อไม่ต้องใช้เครื่องมือแล้ว นี่คือข้อความออกก้อนสุดท้ายที่คุณเห็น ส่วนที่เหลือทั้งหมดเกิดหลังจอที่คุณไม่เห็น",
      detail_en:"The loop ends when no more tools are needed. This is the last text-out you see. Everything else happened behind the screen.",
      raw:
"เสร็จแล้วครับ -> AI-Stocks-Research-2026.md\n" +
"ในไฟล์มี: ตารางสรุป 12 ตัว, จัดกลุ่ม 4 ชั้น (ชิป / โครงสร้างพื้นฐาน / แพลตฟอร์ม / ซอฟต์แวร์),\n" +
"ความเสี่ยงรายตัว, และ disclaimer ว่าไม่ใช่คำแนะนำการลงทุน ...",
      state:{ ctx:75, toolsUsed:["ค้นเว็บ","เขียนไฟล์"], approx:true }
    }
  ]
};
