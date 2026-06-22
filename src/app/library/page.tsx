import type { Metadata } from "next";
import Link from "next/link";
import { getAllSelfCare } from "@/lib/selfcare";
import { SYMPTOMS, PARTS } from "@/data/categories";
import AuthGate from "@/components/AuthGate";
import SearchFilter from "@/components/SearchFilter";
import CategoryGrid from "@/components/CategoryGrid";
import RecentlyViewed from "@/components/RecentlyViewed";
import Recommended from "@/components/Recommended";

export const metadata: Metadata = {
  title: "セルフケアライブラリ（会員専用）",
  description: "会員様向けのセルフケア動画・画像ライブラリ。",
  robots: { index: false, follow: false },
};

export default function LibraryPage() {
  const items = getAllSelfCare();

  return (
    <AuthGate>
      <div className="mb-6">
        <p className="text-xs font-medium tracking-wider2 text-brand-600">会員専用エリア</p>
        <h1 className="mt-1.5 font-serif text-2xl font-bold text-ink-900 sm:text-3xl">
          セルフケアライブラリ
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          施術の効果を維持するためのセルフケアをまとめています。
        </p>
      </div>

      {/* 院からのおすすめ */}
      <Recommended />

      {/* 検索 */}
      <section className="mt-10">
        <h2 className="heading-accent mb-4 inline-block font-serif text-xl font-bold text-ink-800">
          キーワードでさがす
        </h2>
        <SearchFilter items={items} />
      </section>

      {/* カテゴリー */}
      <CategoryGrid title="症状からさがす" basePath="/symptom" items={SYMPTOMS} accent="brand" />
      <CategoryGrid title="部位からさがす" basePath="/part" items={PARTS} accent="ink" />

      {/* リンク */}
      <section className="mt-10 flex flex-wrap gap-3">
        <Link href="/ranking/" className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-bold text-ink-700 hover:border-ink-300">
          人気ランキング
        </Link>
        <Link href="/favorites/" className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-bold text-ink-700 hover:border-ink-300">
          お気に入り
        </Link>
      </section>

      {/* 最近見た */}
      <RecentlyViewed items={items} />
    </AuthGate>
  );
}
