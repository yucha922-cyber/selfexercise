import Link from "next/link";
import { getAllSelfCare, getPopular } from "@/lib/selfcare";
import { SYMPTOMS, PARTS } from "@/data/categories";
import { SITE } from "@/lib/site";
import SearchFilter from "@/components/SearchFilter";
import CategoryGrid from "@/components/CategoryGrid";
import SelfCareCard from "@/components/SelfCareCard";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function HomePage() {
  const items = getAllSelfCare();
  const popular = getPopular(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    description: SITE.description,
    url: SITE.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.siteUrl}/search/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ヒーロー */}
      <section className="rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 px-6 py-10 text-white sm:px-10 sm:py-14">
        <h1 className="text-2xl font-bold leading-snug sm:text-3xl">
          症状改善のための
          <br className="sm:hidden" />
          セルフケアライブラリ
        </h1>
        <p className="mt-3 text-sm text-navy-100 sm:text-base">
          ご自宅で簡単にできるストレッチ・エクササイズをまとめています
        </p>
        <div className="mt-6">
          <Link
            href="/search/"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-accent-600"
          >
            🔍 セルフケアを探す
          </Link>
        </div>
      </section>

      {/* 検索バー（その場で絞り込み） */}
      <section className="mt-8">
        <SearchFilter items={items} />
      </section>

      {/* カテゴリー */}
      <CategoryGrid title="症状別でさがす" basePath="/symptom" items={SYMPTOMS} accent="navy" />
      <CategoryGrid title="部位別でさがす" basePath="/part" items={PARTS} accent="accent" />

      {/* 人気ランキング */}
      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-800">人気のセルフケア</h2>
          <Link href="/ranking/" className="text-sm text-navy-600 hover:text-accent-600">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((item) => (
            <SelfCareCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* 最近見た */}
      <RecentlyViewed items={items} />
    </>
  );
}
