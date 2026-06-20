import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SYMPTOMS, symptomName } from "@/data/categories";
import { getSelfCareBySymptom } from "@/lib/selfcare";
import { SITE } from "@/lib/site";
import SelfCareCard from "@/components/SelfCareCard";

export function generateStaticParams() {
  return SYMPTOMS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const name = symptomName(params.slug);
  return {
    title: `${name}のセルフケア`,
    description: `${name}におすすめの自宅でできるセルフケア・ストレッチをまとめています。`,
    alternates: { canonical: `${SITE.siteUrl}/symptom/${params.slug}/` },
  };
}

export default function SymptomPage({ params }: { params: { slug: string } }) {
  const exists = SYMPTOMS.some((s) => s.slug === params.slug);
  if (!exists) notFound();
  const name = symptomName(params.slug);
  const items = getSelfCareBySymptom(params.slug);

  return (
    <div>
      <p className="text-xs font-medium tracking-wider2 text-brand-600">症状からさがす</p>
      <h1 className="mt-1.5 font-serif text-2xl font-bold text-ink-900 sm:text-3xl">
        {name}のセルフケア
      </h1>
      <p className="mt-2 text-sm text-ink-500">{items.length}件のセルフケアがあります。</p>

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
