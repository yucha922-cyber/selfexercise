import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="ホーム">
          <Logo size={46} />
        </Link>
        <nav className="flex items-center gap-1 text-sm text-ink-600 sm:gap-2">
          <Link href="/analysis/" className="rounded-full px-3 py-2 transition hover:bg-ink-50 hover:text-ink-900">
            姿勢分析
          </Link>
          <Link
            href="/"
            className="ml-1 rounded-full bg-brand-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-600"
          >
            会員ログイン
          </Link>
        </nav>
      </div>
    </header>
  );
}
