import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-cream-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Logo size={30} />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-500">
          NAORU セルフケアライブラリは、整体院に通院されている患者様が、ご自宅でも
          安心してセルフケアを続けられるようにまとめた情報サイトです。
        </p>
        <div className="mt-6 rounded-2xl border border-ink-100 bg-cream-100 p-4">
          <p className="text-xs leading-relaxed text-ink-500">
            ※ 掲載しているセルフケアは一般的な情報提供を目的としています。痛みや異常を
            感じた場合は中止し、通院中の整体院または医療機関にご相談ください。
          </p>
        </div>
        <p className="mt-6 text-xs text-ink-300">
          © {new Date().getFullYear()} NAORU
        </p>
      </div>
    </footer>
  );
}
