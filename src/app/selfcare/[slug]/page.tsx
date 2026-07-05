import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllSlugs,
  getSelfCareBySlug,
  getAllSelfCare,
} from "@/lib/selfcare";
import { symptomName, partName } from "@/data/categories";
import { SITE } from "@/lib/site";
import Difficulty from "@/components/Difficulty";
import FavoriteButton from "@/components/FavoriteButton";
import SelfCareCard from "@/components/SelfCareCard";
import ImageGallery from "@/components/ImageGallery";
import ViewTracker from "@/components/ViewTracker";
import AuthGate from "@/components/AuthGate";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const item = getSelfCareBySlug(params.slug);
  if (!item) return {};
  const description = `${item.purpose}（所要時間: ${item.duration} / 難易度: ★${item.difficulty}）`;
  return {
    title: item.title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${item.title} | ${SITE.name}`,
      description,
      url: `${SITE.siteUrl}/selfcare/${item.slug}/`,
    },
  };
}

export default function SelfCarePage({ params }: { params: { slug: string } }) {
  const item = getSelfCareBySlug(params.slug);
  if (!item) notFound();

  // 関連セルフケア（同じ症状か部位を持つもの）
  const related = getAllSelfCare()
    .filter(
      (x) =>
        x.slug !== item.slug &&
        (x.symptoms.some((s) => item.symptoms.includes(s)) ||
          x.parts.some((p) => item.parts.includes(p)))
    )
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: item.title,
    description: item.purpose,
    totalTime: item.duration,
    step: item.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: s,
    })),
  };

  return (
    <AuthGate>
    <article>
      <ViewTracker slug={item.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-ink-400">
        <Link href="/" className="hover:text-brand-600">
          ホーム
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-600">{item.title}</span>
      </nav>

      <header className="mt-4 flex items-start justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold leading-snug text-ink-900 sm:text-3xl">
          {item.title}
        </h1>
        <FavoriteButton
          slug={item.slug}
          className="h-11 w-11 shrink-0 border border-ink-200 bg-white text-2xl"
        />
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-500">
        <span className="rounded-full bg-cream-200 px-3 py-1">⏱ {item.duration}</span>
        <span className="flex items-center gap-1">
          難易度 <Difficulty level={item.difficulty} />
        </span>
      </div>

      {/* 動画 */}
      {item.youtubeId && (
        <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${item.youtubeId}`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* 目的 */}
      <Section title="目的">
        <p className="leading-relaxed text-gray-700">{item.purpose}</p>
      </Section>

      {/* 実施方法 */}
      <Section title="実施方法">
        <ol className="space-y-2">
          {item.steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-gray-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="leading-relaxed text-ink-700">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* 画像（1枚なら全幅の解説図・複数ならグリッド。タップで拡大） */}
      {item.images && item.images.length > 0 && (
        <Section title="参考画像">
          <ImageGallery images={item.images} title={item.title} />
          <p className="mt-3 text-xs text-ink-400">
            画像をタップすると拡大表示できます。
          </p>
        </Section>
      )}

      {/* 注意事項 */}
      {item.cautions.length > 0 && (
        <Section title="注意事項">
          <ul className="space-y-2 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            {item.cautions.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-900">
                <span aria-hidden>⚠️</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* タグ・関連カテゴリ */}
      <Section title="関連カテゴリー">
        <div className="flex flex-wrap gap-2">
          {item.symptoms.map((s) => (
            <Link
              key={s}
              href={`/symptom/${s}/`}
              className="rounded-full border border-navy-100 bg-navy-50 px-3 py-1 text-sm text-navy-700 hover:bg-navy-100"
            >
              {symptomName(s)}
            </Link>
          ))}
          {item.parts.map((p) => (
            <Link
              key={p}
              href={`/part/${p}/`}
              className="rounded-full border border-accent-100 bg-accent-50 px-3 py-1 text-sm text-accent-700 hover:bg-accent-100"
            >
              {partName(p)}
            </Link>
          ))}
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
            >
              #{t}
            </span>
          ))}
        </div>
      </Section>

      {/* 関連セルフケア */}
      {related.length > 0 && (
        <Section title="関連するセルフケア">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <SelfCareCard key={r.slug} item={r} />
            ))}
          </div>
        </Section>
      )}
    </article>
    </AuthGate>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-9">
      <h2 className="mb-4 border-l-[3px] border-brand-500 pl-3 font-serif text-lg font-bold text-ink-800">
        {title}
      </h2>
      {children}
    </section>
  );
}
