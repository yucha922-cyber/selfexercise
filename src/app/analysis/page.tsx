import type { Metadata } from "next";
import PostureAnalyzer from "@/components/PostureAnalyzer";
import { CLINIC } from "@/config/clinic";

export const metadata: Metadata = {
  title: "AI姿勢分析",
  description:
    "写真をアップロードするだけで、頭部前方変位・巻き肩・猫背・骨盤の傾き・左右バランスの傾向をAIがチェック。写真は端末内で解析され送信されません。",
};

export default function AnalysisPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "AI姿勢分析",
    about: "姿勢のセルフチェック",
    provider: { "@type": "MedicalBusiness", name: CLINIC.name },
  };
  return (
    <div className="mx-auto max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-6">
        <p className="text-xs font-medium tracking-wider2 text-brand-600">無料・登録不要</p>
        <h1 className="mt-1.5 font-serif text-2xl font-bold text-ink-900 sm:text-3xl">
          AI姿勢分析
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          正面・側面の写真から、あなたの姿勢の傾向をその場でチェック。
          気になる結果は、来院でしっかり改善しましょう。
        </p>
      </div>
      <PostureAnalyzer />
    </div>
  );
}
