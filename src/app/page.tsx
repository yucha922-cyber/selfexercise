import Link from "next/link";
import { CLINIC } from "@/config/clinic";
import { SITE } from "@/lib/site";
import { getAllSelfCare, getSelfCareBySlug } from "@/lib/selfcare";
import Logo from "@/components/Logo";
import MemberLogin from "@/components/MemberLogin";
import SelfCareCard from "@/components/SelfCareCard";
import BookingCTA from "@/components/BookingCTA";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: CLINIC.name,
    description: CLINIC.description,
    url: SITE.siteUrl,
  };

  const total = getAllSelfCare().length;

  // ログインなしで公開する3つ（clinic.ts の recommendedSlugs）
  const freeItems = CLINIC.recommendedSlugs
    .map((slug) => getSelfCareBySlug(slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 会員ログイン */}
      <section className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white px-6 py-10 shadow-soft sm:px-12 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-50 blur-3xl" />
        <div className="relative mx-auto max-w-md text-center">
          <div className="mb-5 flex justify-center">
            <Logo size={72} />
          </div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {CLINIC.name} 会員専用
          </p>
          <h1 className="font-serif text-2xl font-bold leading-[1.45] text-ink-900 sm:text-3xl">
            セルフケアライブラリ
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            ご来院いただいた会員様に、症状・部位別のセルフケアを動画と写真でご案内しています。
            施術の効果を、ご自宅でも維持していただくためのライブラリです。
          </p>
        </div>

        <div className="relative mx-auto mt-7 max-w-md">
          <MemberLogin />
        </div>

        {/* セラピストへの案内 */}
        <div className="relative mx-auto mt-5 max-w-md rounded-2xl border border-brand-100 bg-brand-50 p-4 text-center">
          <p className="text-sm font-bold leading-relaxed text-brand-700">
            ご覧いただくには会員コードが必要です。
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-brand-700/85">
            コードは施術時にお渡ししています。お持ちでない方・お忘れの方は、
            担当セラピストにお尋ねください。
          </p>
        </div>
      </section>

      {/* ログインなしで見られる3つ */}
      {freeItems.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h2 className="heading-accent inline-block font-serif text-xl font-bold text-ink-800">
              まずはこの3つから
            </h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              ログイン不要でご覧いただけます
            </span>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-ink-500">
            院がとくにおすすめするセルフケアです。動画・写真・手順まですべてご覧いただけます。
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {freeItems.map((item) => (
              <SelfCareCard key={item.slug} item={item} />
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-ink-100 bg-white p-4 text-sm leading-relaxed text-ink-500">
            このほかにも、首・肩・腰・股関節・脚など
            <strong className="font-bold text-ink-800">全{total}種類</strong>
            のセルフケアをご用意しています。ご覧いただけるのは会員様限定です。
          </p>
        </section>
      )}

      {/* AI姿勢分析 */}
      <section className="mt-12 rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
        <h2 className="font-serif text-lg font-bold text-ink-900">
          まだご来院されていない方へ
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          無料のAI姿勢分析で、今の姿勢の傾向をその場でチェックできます。
          登録は不要で、お写真が院に送信されることもありません。
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/analysis/"
            className="inline-flex items-center gap-2 rounded-full bg-ink-800 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-ink-900"
          >
            無料でAI姿勢分析をする
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-4">
          <BookingCTA variant="compact" />
        </div>
      </section>
    </>
  );
}
