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
      <h1 className="text-2xl font-bold text-navy-800">お気に入り</h1>
      <p className="mt-2 text-sm text-gray-600">
        ♥ ボタンで保存したセルフケアがここに表示されます。
      </p>
      <div className="mt-6">
        <FavoritesList items={items} />
      </div>
    </div>
  );
}
