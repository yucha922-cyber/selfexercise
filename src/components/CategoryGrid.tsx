import Link from "next/link";
import type { Category } from "@/data/categories";

export default function CategoryGrid({
  title,
  subtitle,
  basePath,
  items,
  accent = "ink",
}: {
  title: string;
  subtitle?: string;
  basePath: string;
  items: Category[];
  accent?: "ink" | "brand";
}) {
  const chip =
    accent === "brand"
      ? "border-brand-100 bg-brand-50/60 text-brand-700 hover:border-brand-300 hover:bg-brand-50"
      : "border-ink-100 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50";
  return (
    <section className="mt-12">
      <div className="mb-4">
        <h2 className="heading-accent inline-block font-serif text-xl font-bold text-ink-800">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-ink-400">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`${basePath}/${c.slug}/`}
            className={`rounded-full border px-4 py-2.5 text-sm font-medium shadow-sm transition ${chip}`}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
