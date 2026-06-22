import Link from "next/link";
import { CLINIC } from "@/config/clinic";
import { SITE } from "@/lib/site";
import Logo from "@/components/Logo";
import BookingCTA from "@/components/BookingCTA";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: CLINIC.name,
    description: CLINIC.description,
    url: SITE.siteUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ヒーロー（施術が主役） */}
      <section className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white px-6 py-12 shadow-soft sm:px-12 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-ink-50 blur-3xl" />
        <div className="relative">
          <div className="mb-6">
            <Logo size={84} />
          </div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {CLINIC.name}
          </p>
          <h1 className="font-serif text-[1.8rem] font-bold leading-[1.5] text-ink-900 sm:text-4xl sm:leading-[1.45]">
            {CLINIC.catchphrase}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
            まずは無料のAI姿勢分析で、今の状態をチェック。
            根本改善は、お一人おひとりに合わせた施術でサポートします。
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/analysis/"
              className="inline-flex items-center gap-2 rounded-full bg-ink-800 px-6 py-4 text-sm font-bold text-white shadow-soft transition hover:bg-ink-900"
            >
              無料でAI姿勢分析をする
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="mt-4">
            <BookingCTA variant="compact" />
          </div>
        </div>
      </section>

      {/* 信頼バッジ */}
      <section className="mt-5 grid grid-cols-3 gap-3">
        <TrustItem icon="ai" title="無料AI分析" desc="登録不要・その場で" />
        <TrustItem icon="lock" title="写真は送信なし" desc="端末内だけで解析" />
        <TrustItem icon="care" title="来院後ケア" desc="会員専用ライブラリ" />
      </section>

      {/* ご利用の流れ */}
      <section className="mt-12">
        <h2 className="heading-accent inline-block font-serif text-xl font-bold text-ink-800">
          ご利用の流れ
        </h2>
        <ol className="mt-5 space-y-3">
          <Flow n={1} title="AI姿勢分析" desc="写真をアップロードして、姿勢の傾向をその場でチェック。" />
          <Flow n={2} title="結果を確認" desc="気になるポイントが分かります。詳しい改善方法は施術時に。" />
          <Flow n={3} title="ご予約・来院" desc="LINEまたはWEBから簡単予約。専門家が根本改善をサポート。" />
          <Flow n={4} title="会員登録・継続ケア" desc="来院された方は会員コードでセルフケアライブラリを閲覧可能に。" />
        </ol>
      </section>

      {/* セルフケアは会員限定の案内 */}
      <section className="mt-12 rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
        <h2 className="font-serif text-lg font-bold text-ink-900">
          ご自宅でのケアもサポート
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          来院された会員様には、症状・部位別のセルフケア動画ライブラリをご用意。
          施術の効果を、ご自宅でも維持していただけます。
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/member/"
            className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-bold text-ink-700 transition hover:border-ink-300"
          >
            会員ログイン
          </Link>
          <Link
            href="/analysis/"
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            まずはAI姿勢分析
          </Link>
        </div>
      </section>

      {/* 予約CTA */}
      <section className="mt-12 rounded-3xl bg-ink-800 px-6 py-10 text-center text-white sm:px-12">
        <h2 className="font-serif text-xl font-bold sm:text-2xl">
          姿勢の不調、根本から変えませんか？
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-100">
          ご予約はLINEまたはWEBから。お気軽にご相談ください。
        </p>
        <div className="mx-auto mt-6 max-w-md">
          <BookingCTA variant="full" />
        </div>
      </section>
    </>
  );
}

function Flow({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="flex gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-800 font-serif text-sm font-bold text-white">
        {n}
      </span>
      <span>
        <span className="block font-bold text-ink-800">{title}</span>
        <span className="mt-0.5 block text-sm leading-relaxed text-ink-500">{desc}</span>
      </span>
    </li>
  );
}

function TrustItem({
  icon,
  title,
  desc,
}: {
  icon: "ai" | "lock" | "care";
  title: string;
  desc: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    ai: <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />,
    lock: (
      <>
        <rect x="4" y="11" width="16" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
      </>
    ),
    care: <path d="M12 21s-7-4.35-9-8a5 5 0 019-3 5 5 0 019 3c-2 3.65-9 8-9 8z" />,
  };
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-100 bg-white px-2 py-4 text-center shadow-sm">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {paths[icon]}
        </svg>
      </span>
      <span>
        <span className="block text-xs font-bold text-ink-800">{title}</span>
        <span className="mt-0.5 block text-[0.65rem] leading-tight text-ink-400">{desc}</span>
      </span>
    </div>
  );
}
