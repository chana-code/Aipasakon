import { Hero } from '@/components/landing/Hero';
import { SpecialtyBand } from '@/components/landing/SpecialtyBand';
import { ContentCards } from '@/components/landing/ContentCards';
import { VisualRow } from '@/components/landing/VisualRow';
import { AboutScene } from '@/components/landing/AboutScene';
import { SITE } from '@/lib/seo/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { courseLd, faqLd } from '@/lib/seo/jsonld';

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          courseLd({
            name: 'หลักสูตร AI ภาษาคน',
            description: SITE.description,
            path: '/curriculum',
          }),
          faqLd([
            {
              question: 'AI ภาษาคน คืออะไร?',
              answer:
                'AI ภาษาคน คือหลักสูตรเรียน AI ภาษาไทยแบบฟรี ที่อธิบายตั้งแต่ AI คืออะไร ทำงานยังไง ไปจนถึงการใช้งานจริง เขียนให้คนทั่วไปเข้าใจได้โดยไม่ต้องมีพื้นฐานเทคนิค',
            },
            {
              question: 'ต้องมีพื้นฐานเขียนโปรแกรมไหม?',
              answer:
                'ไม่ต้องเลย เนื้อหาออกแบบมาสำหรับคนที่ไม่ได้เป็นโปรแกรมเมอร์ เราเน้นสอนวิธีคิดและวิธีสั่งงาน AI ด้วยมุมมองของคนทำงานและคนทำธุรกิจ ไม่ใช่การเขียนโค้ด',
            },
            {
              question: 'เนื้อหาเหมาะกับใคร?',
              answer:
                'เหมาะกับคนทั่วไปที่อยากเข้าใจ AI ตั้งแต่ศูนย์ ไปจนถึงคนทำงานและเจ้าของธุรกิจที่อยากใช้ AI ให้เกิดผลจริง โดยไม่ต้องมีความรู้ทางเทคนิคมาก่อน',
            },
            {
              question: 'เรียนฟรีไหม?',
              answer:
                'ฟรีทั้งหมด ความรู้พื้นฐานเรื่อง AI ควรเข้าถึงได้สำหรับทุกคน และเราปรับปรุงเนื้อหาให้ทันสมัยอยู่เสมอ',
            },
            {
              question: 'ครอบคลุมเรื่องอะไรบ้าง?',
              answer:
                'ครอบคลุมตั้งแต่ AI คืออะไร กลไกการทำงานของโมเดลภาษา (LLM) การแยกแยะผลิตภัณฑ์ AI ต่าง ๆ ไปจนถึงเทคนิคการสั่งงาน AI อย่างมืออาชีพและการนำไปใช้จริงในงาน',
            },
          ]),
        ]}
      />
      <Hero />
      <SpecialtyBand />
      <ContentCards />
      <VisualRow />
      <AboutScene />
    </>
  );
}
