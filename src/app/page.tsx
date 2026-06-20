import Link from "next/link";
import { getAllSelfCare, getPopular } from "@/lib/selfcare";
import { SYMPTOMS, PARTS } from "@/data/categories";
import { SITE } from "@/lib/site";
import SearchFilter from "@/components/SearchFilter";
import CategoryGrid from "@/components/CategoryGrid";
import SelfCareCard from "@/components/SelfCareCard";
import RecentlyViewed from "@/components/RecentlyViewed";
import Logo from "@/components/Logo";

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
      <section className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white px-6 py-12 shadow-soft sm:px-12 sm:py-16">
        {/* 背景の柔らかな装飾 */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-50 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-ink-50 blur-3xl"
        />
        <div className="relative">
          <div className="mb-5">
            <Logo size={96} />
          </div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            整体院監修のセルフケア
          </p>
          <h1 className="font-serif text-[1.7rem] font-bold leading-[1.5] text-ink-900 sm:text-4xl sm:leading-[1.45]">
            症状改善のための
            <br />
            セルフケアライブラリ
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
            ご自宅で簡単にできるストレッチ・エクササイズをまとめています。
            <br className="hidden sm:block" />
            あなたのお悩みに合わせて、続けやすいケアを見つけてください。
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/search/"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600"
            >
              セルフケアを探す
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/ranking/"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-6 py-3 text-sm font-bold text-ink-700 transition hover:border-ink-300"
            >
              人気のケアを見る
            </Link>
          </div>
        </div>
      </section>

      {/* 信頼バッジ */}
      <section className="mt-5 grid grid-cols-3 gap-3">
        <TrustItem icon="home" title="自宅でできる" desc="道具いらず・短時間" />
        <TrustItem icon="check" title="整体院監修" desc="専門家がやさしく解説" />
        <TrustItem icon="play" title="動画つき" desc="見ながら正しく実践" />
      </section>

      {/* 検索バー（その場で絞り込み） */}
      <section className="mt-10">
        <h2 className="heading-accent mb-4 inline-block font-serif text-xl font-bold text-ink-800">
          キーワードでさがす
        </h2>
        <SearchFilter items={items} />
      </section>

      {/* カテゴリー */}
      <CategoryGrid
        title="症状からさがす"
        subtitle="気になる症状を選んでください"
        basePath="/symptom"
        items={SYMPTOMS}
        accent="brand"
      />
      <CategoryGrid
        title="部位からさがす"
        subtitle="ケアしたい部位を選んでください"
        basePath="/part"
        items={PARTS}
        accent="ink"
      />

      {/* 人気ランキング */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="heading-accent inline-block font-serif text-xl font-bold text-ink-800">
            人気のセルフケア
          </h2>
          <Link
            href="/ranking/"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
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

function TrustItem({
  icon,
  title,
  desc,
}: {
  icon: "home" | "check" | "play";
  title: string;
  desc: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    home: <path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-5h-6v5H5a1 1 0 01-1-1z" />,
    check: <path d="M5 12l4 4 10-10" />,
    play: <path d="M8 6l10 6-10 6z" />,
  };
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-100 bg-white px-2 py-4 text-center shadow-sm sm:flex-row sm:gap-3 sm:px-4 sm:text-left">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {paths[icon]}
        </svg>
      </span>
      <span>
        <span className="block text-xs font-bold text-ink-800 sm:text-sm">
          {title}
        </span>
        <span className="mt-0.5 block text-[0.65rem] leading-tight text-ink-400 sm:text-xs">
          {desc}
        </span>
      </span>
    </div>
  );
}
