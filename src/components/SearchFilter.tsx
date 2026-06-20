"use client";

import { useMemo, useState } from "react";
import type { SelfCare } from "@/lib/types";
import { SYMPTOMS, PARTS } from "@/data/categories";
import SelfCareCard from "./SelfCareCard";

type Props = {
  items: SelfCare[];
  initialQuery?: string;
};

export default function SearchFilter({ items, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [symptom, setSymptom] = useState<string>("");
  const [part, setPart] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      // フリーワード検索: タイトル・目的・タグ・症状/部位名
      const haystack = [
        item.title,
        item.purpose,
        ...item.tags,
        ...item.symptoms.map(
          (s) => SYMPTOMS.find((x) => x.slug === s)?.name ?? ""
        ),
        ...item.parts.map((p) => PARTS.find((x) => x.slug === p)?.name ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      if (q && !haystack.includes(q)) return false;
      if (symptom && !item.symptoms.includes(symptom)) return false;
      if (part && !item.parts.includes(part)) return false;
      if (tag && !item.tags.includes(tag)) return false;
      return true;
    });
  }, [items, query, symptom, part, tag]);

  const reset = () => {
    setQuery("");
    setSymptom("");
    setPart("");
    setTag("");
  };

  const hasFilter = query || symptom || part || tag;

  return (
    <div>
      {/* 検索バー */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="症状名・部位・キーワードで検索"
          aria-label="セルフケアを検索"
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-base text-navy-900 shadow-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* フィルター */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select label="症状" value={symptom} onChange={setSymptom} options={SYMPTOMS} />
        <Select label="部位" value={part} onChange={setPart} options={PARTS} />
        <Select
          label="タグ"
          value={tag}
          onChange={setTag}
          options={allTags.map((t) => ({ slug: t, name: t }))}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length}件のセルフケア</p>
        {hasFilter && (
          <button
            type="button"
            onClick={reset}
            className="text-sm text-navy-600 underline underline-offset-2 hover:text-navy-800"
          >
            条件をクリア
          </button>
        )}
      </div>

      {/* 結果 */}
      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <SelfCareCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-gray-500">
          条件に一致するセルフケアが見つかりませんでした。
        </p>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { slug: string; name: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-navy-900 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
      >
        <option value="">すべて</option>
        {options.map((o) => (
          <option key={o.slug} value={o.slug}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
