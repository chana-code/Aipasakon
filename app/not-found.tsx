import Link from 'next/link';


export default function NotFound() {
  return (
    <div className="pt-16 pb-24 px-6 max-w-[720px] mx-auto text-center">
      {/* Hero + Actions: vertically centered in viewport */}
      <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
      {/* Hero 404 Section */}
      <section className="mb-12">
        <h1
          className={`text-[120px] text-[#00143C] leading-none mb-4 opacity-10`}
        >
          404
        </h1>
        <h2
          className={`text-[40px] leading-[1.2] font-bold text-[#00143C] mb-6`}
        >
          ไม่เจอหน้านี้ ขอโทษด้วยนะ
        </h2>
        <p className="text-[18px] leading-[1.8] text-[#3c4948] max-w-[500px] mx-auto leading-relaxed">
          หน้านี้อาจถูกย้ายหรือยังไม่ได้เขียน — ลองกลับไปเริ่มที่พื้นฐาน หรือลองค้นหาสิ่งที่ต้องการด้านล่างนี้
        </p>
      </section>

      {/* Search & Actions */}
      <section className="w-full mb-16 space-y-6">
        <Link
          href="/search"
          className="relative w-full max-w-md mx-auto flex items-center bg-white border border-[#6c7a78]/20 rounded-xl shadow-[0_4px_20px_rgba(0,20,60,0.05)] hover:border-[#14B5AB] transition-all"
        >
          <span className="text-[18px] leading-[1.8] text-[#6c7a78] px-6 py-4 flex-1 text-left">
            ค้นหา...
          </span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#14B5AB] text-white p-2 rounded-lg">
            <span className="material-symbols-outlined">search</span>
          </span>
        </Link>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="text-[14px] font-medium bg-[#14B5AB] text-white px-8 py-3 rounded-full hover:brightness-105 transition-all w-full sm:w-auto shadow-sm"
          >
            กลับหน้าแรก
          </Link>
          <Link
            href="/curriculum"
            className="text-[14px] font-medium border border-[#00143C] text-[#00143C] px-8 py-3 rounded-full hover:bg-[#00143C] hover:text-white transition-all w-full sm:w-auto"
          >
            ไปที่หลักสูตร
          </Link>
        </div>
      </section>
      </div>{/* end centering wrapper */}

      {/* Suggested Reading */}
      <section className="w-full border-t border-[#EBE6DD] pt-12">
        <h3 className="text-[14px] font-medium text-[#6c7a78] uppercase tracking-widest mb-8">
          บทความที่น่าสนใจ
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Level 1 */}
          <Link
            href="/what-is-ai/history"
            className="group flex items-center justify-between p-5 bg-white rounded-xl border border-[#6c7a78]/20 hover:border-[#14B5AB] transition-all hover:translate-x-1"
          >
            <div className="flex items-center gap-4">
              <span className="bg-[#e0f2f1] text-[#00695c] text-[12px] font-bold px-3 py-1 rounded-full">
                Level 1
              </span>
              <span className={`text-[20px] text-[#00143C] group-hover:text-[#14B5AB] transition-colors`}>
                ประวัติของ AI
              </span>
            </div>
            <span className="material-symbols-outlined text-[#6c7a78] group-hover:text-[#14B5AB]">
              arrow_forward
            </span>
          </Link>

          {/* Level 2 */}
          <Link
            href="/products/the-model"
            className="group flex items-center justify-between p-5 bg-white rounded-xl border border-[#6c7a78]/20 hover:border-[#2D7CD6] transition-all hover:translate-x-1"
          >
            <div className="flex items-center gap-4">
              <span className="bg-[#e3f2fd] text-[#1565c0] text-[12px] font-bold px-3 py-1 rounded-full">
                Level 2
              </span>
              <span className={`text-[20px] text-[#00143C] group-hover:text-[#2D7CD6] transition-colors`}>
                ตัว model เอง คืออะไร
              </span>
            </div>
            <span className="material-symbols-outlined text-[#6c7a78] group-hover:text-[#2D7CD6]">
              arrow_forward
            </span>
          </Link>

          {/* Level 3 */}
          <Link
            href="/products/press-enter"
            className="group flex items-center justify-between p-5 bg-white rounded-xl border border-[#B45A1A]/20 hover:border-[#B45A1A] transition-all hover:translate-x-1"
          >
            <div className="flex items-center gap-4">
              <span className="bg-[#fff3e0] text-[#ef6c00] text-[12px] font-bold px-3 py-1 rounded-full">
                Level 2
              </span>
              <span className={`text-[20px] text-[#00143C] group-hover:text-[#B45A1A] transition-colors`}>
                เกิดอะไรขึ้นตอนกด Enter
              </span>
            </div>
            <span className="material-symbols-outlined text-[#6c7a78] group-hover:text-[#B45A1A]">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
