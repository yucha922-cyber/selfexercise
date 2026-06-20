"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SelfCare } from "@/lib/types";
import { getFavorites } from "@/lib/storage";
import SelfCareCard from "./SelfCareCard";

export default function FavoritesList({ items }: { items: SelfCare[] }) {
  const [slugs, setSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    setSlugs(getFavorites());
  }, []);

  if (slugs === null) {
    return <p className="text-sm text-gray-400">読み込み中…</p>;
  }

  const favs = slugs
    .map((slug) => items.find((i) => i.slug === slug))
    .filter((i): i is SelfCare => Boolean(i));

  if (favs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <p className="text-gray-500">お気に入りはまだありません。</p>
        <Link
          href="/search/"
          className="mt-4 inline-block rounded-xl bg-navy-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800"
        >
          セルフケアを探す
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {favs.map((item) => (
        <SelfCareCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
