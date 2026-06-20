import Link from "next/link";
import type { Category } from "@/data/categories";

export default function CategoryGrid({
  title,
  basePath,
  items,
  accent = "navy",
}: {
  title: string;
  basePath: string;
  items: Category[];
  accent?: "navy" | "accent";
}) {
  const chip =
    accent === "navy"
      ? "border-navy-100 bg-navy-50 text-navy-700 hover:bg-navy-100"
      : "border-accent-100 bg-accent-50 text-accent-700 hover:bg-accent-100";
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold text-navy-800">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`${basePath}/${c.slug}/`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${chip}`}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
