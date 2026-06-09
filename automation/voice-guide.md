---
title: Voice & Style Guide — How to Write for AI ภาษาคน
type: style-guide
last-updated: 2026-06-09
status: stable
---

# Voice & Style Guide — AI ภาษาคน

> **One rule above all:** your job is to make hard, real things **clear** to a non-technical Thai reader — never to make them **shallow**. Accessibility is about HOW you explain (plain words, build-up from experience, concrete examples), NEVER about what you leave out. If a paragraph would lose the reader, the fix is to rewrite it until it lands — never to delete the idea, blur it into vagueness, or replace a real explanation with reassurance like "don't worry, you don't need to know this." Depth, concreteness, and practical detail are **mandatory**, not optional. The reader must finish each paragraph *smarter and more capable*, not merely comforted. When this rule and "don't overwhelm the reader" seem to conflict, depth wins and you work harder on the clarity — you never resolve it by dumbing down or skipping.

> **v3 NOTE (2026-06-04) — read this first.** This guide predates the curriculum v3 restart and still talks about a "Surface / Deeper / Formal" section split and a "4-level curriculum." Those are retired. v3 writes **ONE progressive narrative per article** (per the v3 brief). When this guide says *"Surface section,"* read it as **"the accessible main narrative."** When it says *"Deeper section,"* read it as **"the deep-mechanism passages inside the same article."** Everything else — reader profile, voice, Concept Onion, word tiers, the five reader tests, analogy rules — applies to v3 unchanged.

This document defines HOW to write inside this knowledge base. The structural template (`_templates/topic-note.md`) defines WHERE things go. This document defines WHAT THEY SHOULD SOUND LIKE.

---

## 1. The Reader Profile (lock this in)

Write every paragraph for **this specific person**:

- Thai speaker, 25–45 years old
- White-collar / SME owner / manager / student
- Has used ChatGPT or Claude **on the website** — never the API
- Has not read an AI paper, has not watched a "neural network from scratch" tutorial, has not heard "transformer" before
- Knows what a file is, knows what a browser is, can install an app — but is not a programmer
- Reads Thai natively; reads English but technical English slows them down
- Is a **motivated learner**, not a passive reader to be reassured: genuinely wants to **understand how things really work and be able to do them** — explained plainly, but never thinned out. In operational/how-to sections (e.g. building, vibe coding) they want practical, professional-grade detail they can actually act on.

This person is **curious and intelligent** but **not technically trained**. Never talk down to them — and never use "they're not technical" as an excuse to skip the real substance. The non-technical part tells you HOW to explain (plain language, no assumed jargon), not WHETHER to explain. Never assume they know a word you haven't taught them; equally, never leave a word or mechanism untaught because it "seems too technical" — teach it plainly instead.

---

## 2. The Voice in One Paragraph

> **A smart colleague who has worked deeply with AI for years, sitting across from you with a coffee, explaining what's actually going on — patient, concrete, direct, never lecturing. Uses examples first and names second. Tells you when something is uncertain. Doesn't hide complexity but doesn't show off complexity either. Treats you like an adult who can handle the truth, including when AI is bad at something.**

What this voice is NOT:
- Not a lecturer ("ในทางวิชาการ...")
- Not a marketer ("ค้นพบพลังของ AI...")
- Not a casual Facebook friend (no พี่/น้อง/ครับ/ค่ะ/เผื่อใครยังไม่รู้)
- Not a coding tutorial ("ลองเขียนโค้ดตามนี้")
- Not a TikTok hook ("คุณรู้ไหมว่า...")
- Not academic Thai (avoid ราชาศัพท์, avoid "อนึ่ง", "อย่างไรก็ตาม", "กล่าวคือ" as openers)

---

## 3. Word-Choice Framework: Three Tiers

Every word in this knowledge base falls into one of three tiers. Use them differently.

### Tier 1 — Everyday Thai (use freely, especially in Surface sections)
ภาษาที่คนทั่วไปใช้คุยกันในชีวิตประจำวัน. ใช้ได้ทุกที่ทุกเวลา.
- "ตอบ" not "ให้ผลลัพธ์"
- "เดา" not "ทำการคาดการณ์"
- "ใช้" not "ทำการใช้งาน"
- "ผิด" not "เกิดความคลาดเคลื่อน"

### Tier 2 — Industry English (the reader WILL meet these elsewhere — teach them)
ศัพท์ที่อยู่ในทุกบทความ AI ทุก demo ทุก product page. Reader ต้องรู้คำพวกนี้เพื่ออ่านข่าว/ใช้เครื่องมือต่อได้:
- LLM, prompt, token, context window, hallucination, model, API, chat, agent, RAG, fine-tune

**Rule:** introduce each one with a Thai-first sentence, then name it. Never start a paragraph with the English term in a Surface section.

✗ "Hallucination คือเมื่อ AI ตอบผิดอย่างมั่นใจ..."
✓ "บางครั้ง AI ตอบในสิ่งที่ฟังดูถูกแต่ผิดสนิท — และมันก็ตอบด้วยน้ำเสียงมั่นใจเหมือนรู้จริง. ปรากฏการณ์นี้ในวงการ AI เรียกว่า **hallucination**."

### Tier 3 — Academic / research jargon (Deeper section only, when precision matters)
ศัพท์ที่อยู่ใน paper, lecture, ในทีม engineer:
- gradient descent, attention mechanism, softmax, embedding, autoregressive, transformer, MoE, RLHF

**Rule:** these belong in the **Deeper** section, not Surface. When you must use one in Surface (rare), define it in a parenthetical immediately.

---

## 4. The Concept Onion — How to Build Up Any Topic

Every new concept gets peeled in this order. Never skip steps. Never jump tiers.

```
Layer 1 — EXPERIENCE   "เวลาคุณ... / คุณเคย..."
                       เริ่มจากสิ่งที่ reader เห็น/ทำตอนใช้ ChatGPT จริง ๆ
Layer 2 — CONCEPT      "สิ่งที่กำลังเกิดขึ้นคือ..."
                       อธิบายว่ามันคืออะไร ในภาษา Tier 1 (Everyday Thai)
Layer 3 — NAME         "ในวงการ AI เรียกว่า ___"
                       ตั้งชื่อ Tier 2 term — เพื่อ reader เอาไปอ่านต่อ Google ต่อได้
Layer 4 — WHY-IT-MATTERS  "นี่คือสาเหตุที่..."
                       เชื่อมกลับไปสิ่งที่ reader สนใจ — เช่นทำไม AI ตอบผิดบ่อย / ทำไมต้องเขียน prompt ดี
Layer 5 — MECHANISM    (Deeper section only) "ในระดับเทคนิคที่ลึกขึ้น..."
                       Tier 3 vocabulary, ลงรายละเอียดที่ Surface ไม่ลง
```

**The Surface section should peel layers 1-4. The Deeper section peels into layer 5.**

---

## 5. The Five Reader Tests

Before publishing a Surface section, it must pass ALL of these:

1. **The Office Worker Test** — Could a 35-year-old Thai office worker who only uses ChatGPT website read this paragraph and understand it without re-reading?
2. **The No-Prior-Knowledge Test** — Did I use any term I haven't already defined earlier in the curriculum (or in Tier 2 — known terms)?
3. **The Experience-First Test** — Did I open with what the reader experiences, before naming the concept?
4. **The "So What" Test** — Can the reader say "OK this matters to me because ___" after reading?
5. **The Coffee Test** — Would I actually say this paragraph out loud to a friend, or only write it in a paper?

If any test fails, rewrite.

---

## 6. Analogy Rules

Analogies are the most powerful teaching tool — and the most abused. Use them right.

**Rule 1: Thai life first.** Reach for food, family, school, market, work, daily-life analogies before reaching for Western ones.
- ✓ "เหมือนแม่ค้าตลาดที่จำหน้าลูกค้าประจำได้"
- ✗ "เหมือน Sherlock Holmes ที่กำลังหาเบาะแส"

**Rule 2: One good analogy beats three OK ones.** Don't pile up. If you have three, pick the strongest, kill the rest.

**Rule 3: Every analogy breaks somewhere — say where.** Honesty about the break is the difference between teaching and misleading.
- "เปรียบเทียบนี้ใช้ได้แค่จุดเดียว — ส่วนที่ต่างคือ..."

**Rule 4: Analogies are scaffolding, not the building.** After the reader understands, they should be able to explain the concept without your analogy. If they can't, you haven't taught — you've decorated.

**Rule 5: Don't dumb down dishonestly.** A wrong analogy that "feels right" is worse than no analogy. If a concept can only be honestly explained in technical terms, do that in the Deeper section, not a fake-friendly Surface.

---

## 7. Sentence-Level Rules

- **Short sentences in Surface.** Long sentences in Deeper if needed.
- **Direct address.** ใช้ "คุณ" (you) when speaking to the reader. Not "ผู้อ่าน" (the reader) or third-person.
- **Active voice over passive.** "AI เดาคำต่อไป" not "คำต่อไปจะถูกเดาโดย AI".
- **Numbers in numerals** for clarity: "ใช้ 200,000 token" not "ใช้สองแสน token".
- **Avoid em-dashes (—) and long dashes.** They are not natural in Thai. Use เพราะ / คือ / หรือ, a comma, or split into two sentences instead.
- **Go easy on the full stop (.).** Thai separates sentences and clauses with a SPACE, not a period. Break thoughts with spaces; don't end every sentence with a dot the way English does. Use a period only rarely.
- **No emoji.** No exclamation marks. No rhetorical questions in series.
- **Explain plainly — don't hide behind metaphor-vocabulary or loanwords.** An analogy is a teaching aid, not a substitute for a clear literal explanation. Always give the direct version. e.g. not only "ปึกกลับมาบาง" but "จำนวนข้อความที่ส่งเข้าไปให้ Model น้อยลง". Keep คำทับศัพท์ to the few core terms the reader truly needs (Model, token, prompt, context window); describe the rest in everyday Thai.
- **Don't pepper the prose with sources or cross-links.** Verify facts against the docs (recorded in the `sources` frontmatter) but the reader does not need "เอกสารทางการเขียนไว้ว่า…" every few paragraphs. State the fact plainly in your own words; cite in-text at most once, only when it genuinely adds authority. Link a concept to its owner chapter once, not repeatedly.

---

## 8. Section-Specific Voice Calibration

The same note shifts register across sections. Each section has a target voice:

| Section | Target voice | Tier vocabulary | Sentence length |
|---------|--------------|-----------------|-----------------|
| **TL;DR** | Crisp summary, friendly. Can use Tier 2 terms but explain each. | T1 + T2 (explained) | Short |
| **Prerequisites / Objectives** | Functional list. Plain. | T1 + T2 | Short |
| **Surface** | **AI ภาษาคน voice fully on** — coffee-shop colleague | T1 dominant, T2 introduced via the Onion | Short-medium |
| **Deeper** | Knowledgeable but still readable. Less hand-holding. | T1 + T2 dominant, T3 where precision matters | Medium |
| **Formal** *(L3-L4 only)* | Technical / paper-style. Reader is now a peer. | T2 + T3 dominant | Any |
| **Worked Examples** | Concrete narration. Show, don't only tell. | Match the section it serves | Mixed |
| **Common Misconceptions** | Direct correction. "หลายคนคิดว่า X — จริง ๆ คือ Y" | T1 + T2 | Short |
| **Self-Check** | Clean questions. No tricks. | T1 + T2 | Short |
| **References** | Citation format. | English titles preserved | N/A |

---

## 9. Before / After — Concrete Rewrites

### Example 1: Opening a Surface section

❌ **Before (current academic voice):**
> LLM ย่อมาจาก Large Language Model — โมเดลภาษาขนาดใหญ่ ในบริบทปี 2026 หมายถึง neural network ที่มี parameter ตั้งแต่ระดับพันล้านถึงล้านล้าน ถูก train บน text จากอินเทอร์เน็ตและแหล่งอื่น ๆ จำนวนมหาศาล

✅ **After (AI ภาษาคน voice):**
> เวลาคุณเปิด ChatGPT แล้วพิมพ์คำถามไป มันตอบกลับมาเหมือนคนพิมพ์เองตรง ๆ — สิ่งที่อยู่หลังจอนั้นคือ **LLM**. ทุกคนที่ใช้ ChatGPT, Claude, หรือ Gemini อยู่ จริง ๆ แล้วกำลังคุยกับ LLM ทั้งหมด.
>
> LLM ย่อมาจาก **Large Language Model** — โมเดลภาษาขนาดใหญ่ — และในบทนี้เราจะมาดูว่ามันคืออะไร ทำงานยังไง และทำไมถึงทำสิ่งที่เห็นได้.

### Example 2: Introducing hallucination

❌ **Before:**
> Hallucination เป็นปรากฏการณ์ที่ LLM ผลิต output ซึ่งฟังดูสมเหตุสมผลแต่ไม่ถูกต้องตามข้อเท็จจริง ปัญหานี้มีรากฐานมาจากกลไก next-token prediction

✅ **After:**
> บางครั้งคุณถาม ChatGPT ว่า "หนังสือเรื่อง X ใครเขียน" — มันตอบชื่อคนมาแบบมั่นใจ คุณไปเช็ค Google แล้วพบว่าไม่มีคนชื่อนั้นเขียนหนังสือเล่มนั้นเลย. AI ตอบมั่ว — แต่มันไม่ได้ตั้งใจโกหก มันแค่เดาคำที่น่าจะตามมา และเดาผิด.
>
> ปรากฏการณ์นี้ในวงการ AI เรียกว่า **hallucination** (แปลตรงตัวว่า "ภาพหลอน") — เป็นสิ่งที่เกิดขึ้นได้กับทุก LLM ทุกตัว และเป็นเรื่องที่ทุกคนที่ใช้ AI ต้องเข้าใจ.

### Example 3: A worked example narration

❌ **Before:**
> Input: "7 × 23 = ". LLM ไม่ได้ทำการคำนวณค่าจริง แต่ทำ pattern matching จาก training data หากเคย observe sequence "7 × 23 = 161" จะ output ค่าที่ถูกต้อง

✅ **After:**
> ลองพิมพ์ใน ChatGPT ว่า "7 คูณ 23 เท่ากับเท่าไหร่" — มันตอบมา 161 ถูกต้อง. แต่ ChatGPT ไม่ได้ "คำนวณ" จริง ๆ. มันเดาว่าหลังคำว่า "7 คูณ 23 เท่ากับ" ในข้อความที่มันเคยอ่านมาก่อน คำต่อไปคืออะไร. เคยอ่านเจอบ่อย ๆ ว่า "161" — มันก็ตอบ 161.
>
> ถามคำถามที่ยากขึ้น เช่น "1234 × 5678" ที่ไม่ค่อยมีคนเขียนคำตอบไว้บนเน็ต — ChatGPT อาจตอบเลขที่ "ดูเหมือนคำตอบ" แต่ผิด.

---

## 10. The Self-Check Before You Hit Save

Re-read your draft. Ask:

- [ ] บรรทัดแรกของ Surface section เริ่มจากสิ่งที่ reader เห็น/ทำ ไม่ใช่จากชื่อศัพท์
- [ ] ทุก Tier 2 / Tier 3 term ถูกแนะนำผ่าน Concept Onion (experience → concept → name) ก่อนใช้
- [ ] ไม่มีย่อหน้าที่ต้องอ่านสองรอบถึงเข้าใจ ใน Surface section
- [ ] Analogy ที่ใช้เป็น Thai life (อาหาร, ตลาด, ครอบครัว, งาน) — ไม่ใช่ Western
- [ ] ทุก analogy บอกตรงไหนที่มันใช้ไม่ได้
- [ ] ใช้ "คุณ" ไม่ใช่ "ผู้อ่าน" / "ผู้เรียน"
- [ ] ประโยคใน Surface สั้น (≤ 25 คำ) เป็นส่วนใหญ่
- [ ] ไม่มี emoji, ไม่มี exclamation mark, ไม่มี "ครับ/ค่ะ"
- [ ] Reader สามารถพูดประโยค "นี่สำคัญกับฉันเพราะ ___" ได้หลังอ่าน Surface จบ
- [ ] ถ้าคุณยืนพูดประโยคนี้กับเพื่อนที่ร้านกาแฟ มันจะฟังธรรมชาติไหม

---

## 11. What This Guide Does NOT Change

- The structural template — same sections in same order.
- The pedagogical depth — Surface/Deeper still distinct tiers.
- The rigor — citations still required for `reviewed` status.
- The 4-level curriculum.
- The bibliography conventions.

This guide changes **the prose voice**, not the bones.

---

## 12. When in Doubt

Ask yourself: *"If my mom sat down to read this — my mom who has used ChatGPT three times to ask about a recipe — would she finish this paragraph and feel smarter, or would she put the laptop down?"*

That's the test.
