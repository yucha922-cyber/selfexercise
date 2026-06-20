"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SelfCare } from "@/lib/types";
import { getViews } from "@/lib/storage";
import Difficulty from "./Difficulty";

export default function RankingList({ items }: { items: SelfCare[] }) {
  const [views, setViews] = useState<Record<string, number>>({});

  useEffect(() => {
    setViews(getViews());
  }, []);

  // 全体人気度（popularity）にローカル閲覧数を加味してスコア化。
  const ranked = [...items].sort((a, b) => {
    const sa = (a.popularity ?? 0) + (views[a.slug] ?? 0) * 5;
    const sb = (b.popularity ?? 0) + (views[b.slug] ?? 0) * 5;
    return sb - sa;
  });

  return (
    <ol className="space-y-3">
      {ranked.map((item, i) => (
        <li key={item.slug}>
          <Link
            href={`/selfcare/${item.slug}/`}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-navy-200 hover:shadow-md"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                i < 3 ? "bg-accent-500 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold text-navy-800">
                {item.title}
              </span>
              <span className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                <span>⏱ {item.duration}</span>
                <Difficulty level={item.difficulty} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
