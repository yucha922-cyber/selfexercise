"use client";

import { useEffect, useState } from "react";
import type { SelfCare } from "@/lib/types";
import { getRecent } from "@/lib/storage";
import SelfCareCard from "./SelfCareCard";

export default function RecentlyViewed({ items }: { items: SelfCare[] }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getRecent());
  }, []);

  const recent = slugs
    .map((slug) => items.find((i) => i.slug === slug))
    .filter((i): i is SelfCare => Boolean(i));

  if (recent.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="heading-accent mb-4 inline-block font-serif text-xl font-bold text-ink-800">
        最近見たセルフケア
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((item) => (
          <SelfCareCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
