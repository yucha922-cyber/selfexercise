import type { Metadata } from "next";
import { getAllSelfCare } from "@/lib/selfcare";
import SearchFilter from "@/components/SearchFilter";

export const metadata: Metadata = {
  title: "セルフケアを検索",
  description:
    "症状名・部位・タグからセルフケアを検索・絞り込みできます。複数条件での絞り込みにも対応。",
};

export default function SearchPage() {
  const items = getAllSelfCare();
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-900 sm:text-3xl">
        セルフケアを検索
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        キーワード・症状・部位・タグを組み合わせて絞り込めます。
      </p>
      <div className="mt-6">
        <SearchFilter items={items} />
      </div>
    </div>
  );
}
