import Link from "next/link";
import type { SelfCare } from "@/lib/types";
import { symptomName, partName } from "@/data/categories";
import Difficulty from "./Difficulty";
import FavoriteButton from "./FavoriteButton";

export default function SelfCareCard({ item }: { item: SelfCare }) {
  return (
    <Link
      href={`/selfcare/${item.slug}/`}
      className="card-hover group relative flex flex-col rounded-2xl border border-ink-100 bg-white p-5 shadow-soft hover:border-brand-200 hover:shadow-lift"
    >
      <div className="absolute right-3.5 top-3.5">
        <FavoriteButton
          slug={item.slug}
          className="h-9 w-9 border border-ink-100 bg-cream-50 text-lg hover:border-brand-200"
        />
      </div>

      <h3 className="pr-10 font-serif text-[1.05rem] font-bold leading-snug text-ink-800 transition group-hover:text-brand-600">
        {item.title}
      </h3>

      <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
        {item.purpose}
      </p>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {item.symptoms.slice(0, 2).map((s) => (
          <span
            key={s}
            className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700"
          >
            {symptomName(s)}
          </span>
        ))}
        {item.parts.slice(0, 2).map((p) => (
          <span
            key={p}
            className="rounded-full bg-ink-50 px-2.5 py-0.5 text-xs font-medium text-ink-600"
          >
            {partName(p)}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100/80 pt-3 text-xs text-ink-400">
        <span className="inline-flex items-center gap-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item.duration}
        </span>
        <Difficulty level={item.difficulty} />
      </div>
    </Link>
  );
}
