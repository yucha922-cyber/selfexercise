import Link from "next/link";
import type { SelfCare } from "@/lib/types";
import { symptomName, partName } from "@/data/categories";
import Difficulty from "./Difficulty";
import FavoriteButton from "./FavoriteButton";

export default function SelfCareCard({ item }: { item: SelfCare }) {
  return (
    <Link
      href={`/selfcare/${item.slug}/`}
      className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-navy-200"
    >
      <div className="absolute right-3 top-3">
        <FavoriteButton slug={item.slug} className="h-9 w-9 bg-gray-50 text-lg hover:bg-gray-100" />
      </div>

      <h3 className="pr-10 text-base font-bold text-navy-800 group-hover:text-navy-600">
        {item.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item.purpose}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.symptoms.slice(0, 2).map((s) => (
          <span
            key={s}
            className="rounded-full bg-navy-50 px-2 py-0.5 text-xs text-navy-700"
          >
            {symptomName(s)}
          </span>
        ))}
        {item.parts.slice(0, 2).map((p) => (
          <span
            key={p}
            className="rounded-full bg-accent-50 px-2 py-0.5 text-xs text-accent-700"
          >
            {partName(p)}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-500">
        <span>⏱ {item.duration}</span>
        <Difficulty level={item.difficulty} />
      </div>
    </Link>
  );
}
