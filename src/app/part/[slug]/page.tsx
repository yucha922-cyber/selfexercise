import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PARTS, partName } from "@/data/categories";
import { getSelfCareByPart } from "@/lib/selfcare";
import { SITE } from "@/lib/site";
import SelfCareCard from "@/components/SelfCareCard";

export function generateStaticParams() {
  return PARTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const name = partName(params.slug);
  return {
    title: `${name}のセルフケア`,
    description: `${name}まわりにおすすめの自宅でできるセルフケア・ストレッチをまとめています。`,
    alternates: { canonical: `${SITE.siteUrl}/part/${params.slug}/` },
  };
}

export default function PartPage({ params }: { params: { slug: string } }) {
  const exists = PARTS.some((p) => p.slug === params.slug);
  if (!exists) notFound();
  const name = partName(params.slug);
  const items = getSelfCareByPart(params.slug);

  return (
    <div>
      <p className="text-sm text-gray-500">部位別</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-800">{name}のセルフケア</h1>
      <p className="mt-2 text-sm text-gray-600">{items.length}件のセルフケアがあります。</p>

      {items.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <SelfCareCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-gray-500">
          まだセルフケアが登録されていません。
        </p>
      )}
    </div>
  );
}
