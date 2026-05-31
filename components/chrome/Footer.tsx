import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="mt-16 md:mt-24 px-4 md:px-7 pt-8 pb-12 border-t border-line">
      <div className="max-w-[1180px] mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-[18px]">
        <Wordmark size={15} />
        <span className="font-thai text-[13px] text-fg-3">
          AI ไม่ยาก ถ้าพูดภาษาคน · by Ong
        </span>
        <span className="hidden md:block flex-1" />
        <span className="font-mono text-[11px] text-fg-3">
          เขียนด้วยใจ · อัปเดตล่าสุด พฤษภาคม 2026
        </span>
      </div>
    </footer>
  );
}
