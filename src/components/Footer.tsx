import Link from "next/link";
import Logo from "./Logo";
import { CLINIC } from "@/config/clinic";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-cream-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <span className="inline-flex rounded-2xl bg-white p-2 shadow-sm">
          <Logo size={56} />
        </span>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-500">
          {CLINIC.name}は、AI姿勢分析と施術で根本改善をサポートし、
          ご来院後はセルフケアで継続を支えます。
        </p>

        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
          <Link href="/" className="hover:text-brand-600">ホーム</Link>
          <Link href="/analysis/" className="hover:text-brand-600">AI姿勢分析</Link>
          <Link href="/member/" className="hover:text-brand-600">会員ログイン</Link>
        </nav>

        <div className="mt-6 rounded-2xl border border-ink-100 bg-cream-100 p-4">
          <p className="text-xs leading-relaxed text-ink-500">
            ※ AI姿勢分析は簡易的な目安です。掲載のセルフケアは一般的な情報提供を目的としています。
            痛みや異常を感じた場合は中止し、{CLINIC.name}または医療機関にご相談ください。
          </p>
        </div>
        <p className="mt-6 text-xs text-ink-300">
          © {new Date().getFullYear()} {CLINIC.name}
        </p>
      </div>
    </footer>
  );
}
