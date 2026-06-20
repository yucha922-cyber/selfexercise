import type { Metadata } from "next";
import { getAllSelfCare } from "@/lib/selfcare";
import FavoritesList from "@/components/FavoritesList";

export const metadata: Metadata = {
  title: "お気に入り",
  description: "お気に入りに保存したセルフケアの一覧です。",
};

export default function FavoritesPage() {
  const items = getAllSelfCare();
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-900 sm:text-3xl">お気に入り</h1>
      <p className="mt-2 text-sm text-ink-500">
        <span className="text-brand-500">♥</span> ボタンで保存したセルフケアがここに表示されます。
      </p>
      <div className="mt-6">
        <FavoritesList items={items} />
      </div>
    </div>
  );
}
