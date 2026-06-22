import { CLINIC } from "@/config/clinic";
import { getSelfCareBySlug } from "@/lib/selfcare";
import SelfCareCard from "./SelfCareCard";

// 院からのおすすめセルフケア（clinic.ts の recommendedSlugs で指定）
export default function Recommended() {
  const items = CLINIC.recommendedSlugs
    .map((slug) => getSelfCareBySlug(slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  if (items.length === 0) return null;

  return (
    <section className="mt-2">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm text-white">
          ★
        </span>
        <h2 className="font-serif text-xl font-bold text-ink-800">院からのおすすめ</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <SelfCareCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
