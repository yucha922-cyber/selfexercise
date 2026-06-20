import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-sm font-bold text-white">
            S
          </span>
          <span className="text-base font-bold text-navy-800">{SITE.name}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-navy-700">
          <Link href="/ranking/" className="hover:text-accent-600">
            人気
          </Link>
          <Link href="/favorites/" className="hover:text-accent-600">
            お気に入り
          </Link>
          <Link href="/search/" className="hover:text-accent-600">
            検索
          </Link>
        </nav>
      </div>
    </header>
  );
}
