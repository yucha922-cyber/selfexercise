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
            className="card-hover flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft hover:border-brand-200 hover:shadow-lift"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold ${
                i < 3 ? "bg-brand-500 text-white" : "bg-cream-200 text-ink-400"
              }`}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-serif font-bold text-ink-800">
                {item.title}
              </span>
              <span className="mt-1 flex items-center gap-3 text-xs text-ink-400">
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
