import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-cream-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="NAORU セルフケアライブラリ ホーム">
          <Logo size={30} />
          <span className="hidden text-xs font-medium tracking-wider2 text-ink-400 sm:inline">
            セルフケアライブラリ
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-ink-600 sm:gap-2">
          <NavLink href="/ranking/" label="人気" />
          <NavLink href="/favorites/" label="お気に入り" />
          <Link
            href="/search/"
            className="ml-1 rounded-full bg-ink-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-ink-900"
          >
            さがす
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 transition hover:bg-ink-50 hover:text-ink-900"
    >
      {label}
    </Link>
  );
}
