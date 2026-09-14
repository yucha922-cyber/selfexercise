"use client";

import { useEffect, useState } from "react";
import type { SelfCare } from "@/lib/types";
import { getPlan } from "@/lib/auth";
import SelfCareCard from "./SelfCareCard";

// ライブラリの一番上に出すおすすめ。
//   ログイン中の会員コードに「処方」が設定されていれば → 担当セラピストからのおすすめ
//   設定されていなければ                               → 院からのおすすめ
// 同じ内容が2回並ばないよう、どちらか一方だけを表示します。
export default function TopPicks({
  items,
  recommended,
}: {
  items: SelfCare[];
  recommended: SelfCare[];
}) {
  const [ready, setReady] = useState(false);
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [picked, setPicked] = useState<SelfCare[]>([]);

  useEffect(() => {
    const plan = getPlan();
    if (plan) {
      setLabel(plan.label);
      setMessage(plan.message);
      setPicked(
        plan.prescription
          .map((slug) => items.find((i) => i.slug === slug))
          .filter((x): x is SelfCare => Boolean(x))
      );
    }
    setReady(true);
  }, [items]);

  // 判定前は、ちらつきを防ぐため院からのおすすめを先に出しておく
  const isPrescription = ready && picked.length > 0;
  const list = isPrescription ? picked : recommended;

  if (list.length === 0) return null;

  return (
    <section
      className={
        isPrescription
          ? "mt-2 rounded-3xl border border-brand-100 bg-brand-50/60 p-5 sm:p-6"
          : "mt-2"
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm text-white"
          aria-hidden
        >
          {isPrescription ? "♡" : "★"}
        </span>
        <h2 className="font-serif text-xl font-bold text-ink-800">
          {isPrescription
            ? label
              ? `${label}へ、今回のおすすめ`
              : "今回おすすめのセルフケア"
            : "院からのおすすめ"}
        </h2>
      </div>

      {isPrescription && (
        <p className="mb-4 text-sm leading-relaxed text-ink-600">
          {message ||
            "担当セラピストが、今回の施術内容に合わせてお選びしたセルフケアです。"}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <SelfCareCard key={item.slug} item={item} />
        ))}
      </div>

      {isPrescription && (
        <p className="mt-4 text-xs text-ink-400">
          担当セラピストより。内容を変更したいときは、次回来院時にお知らせください。
        </p>
      )}
    </section>
  );
}
