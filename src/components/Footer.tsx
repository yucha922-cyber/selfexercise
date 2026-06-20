import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-500">
        <p className="font-bold text-navy-800">{SITE.name}</p>
        <p className="mt-2 leading-relaxed">
          本サイトのセルフケアは一般的な情報提供を目的としています。痛みや異常を感じた場合は中止し、
          通院中の整体院または医療機関にご相談ください。
        </p>
        <p className="mt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
