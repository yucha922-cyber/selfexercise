"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeImages, type AnalysisResult } from "@/lib/poseAnalysis";
import BookingCTA from "./BookingCTA";

type Slot = "front" | "side";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export default function PostureAnalyzer() {
  const [previews, setPreviews] = useState<Record<Slot, string | null>>({
    front: null,
    side: null,
  });
  const [imgs, setImgs] = useState<Record<Slot, HTMLImageElement | null>>({
    front: null,
    side: null,
  });
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onPick = async (slot: Slot, file?: File) => {
    if (!file) return;
    const img = await loadImage(file);
    setImgs((p) => ({ ...p, [slot]: img }));
    setPreviews((p) => ({ ...p, [slot]: img.src }));
  };

  const canAnalyze = imgs.front || imgs.side;

  const run = async () => {
    setStatus("analyzing");
    const r = await analyzeImages(imgs.front, imgs.side);
    setResult(r);
    setStatus("done");
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setPreviews({ front: null, side: null });
    setImgs({ front: null, side: null });
    setResult(null);
    setStatus("idle");
  };

  if (status === "done" && result) {
    return <ResultView result={result} onReset={reset} />;
  }

  return (
    <div>
      <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
        <p className="flex items-center gap-2 text-sm font-medium text-accent-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-xs">🔒</span>
          写真は端末内だけで解析され、サーバーには送信されません。
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UploadSlot
            label="正面の写真"
            hint="まっすぐ立った正面（左右バランス用）"
            preview={previews.front}
            onPick={(f) => onPick("front", f)}
          />
          <UploadSlot
            label="側面の写真"
            hint="横向きに立った全身（猫背・巻き肩用）"
            preview={previews.side}
            onPick={(f) => onPick("side", f)}
          />
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-400">
          全身がはっきり写った写真をご用意ください。正面・側面の両方があるとより詳しく分析できます（片方だけでも可）。
        </p>

        <button
          type="button"
          disabled={!canAnalyze || status === "analyzing"}
          onClick={run}
          className="mt-5 w-full rounded-full bg-ink-800 px-6 py-4 text-base font-bold text-white shadow-soft transition hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "analyzing" ? "解析中…（初回は少し時間がかかります）" : "AIで姿勢を分析する"}
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-ink-400">
        ※ 本分析は簡易的な目安です。正確な評価と改善は来院時に専門家が行います。
      </p>
    </div>
  );
}

function UploadSlot({
  label,
  hint,
  preview,
  onPick,
}: {
  label: string;
  hint: string;
  preview: string | null;
  onPick: (file?: File) => void;
}) {
  return (
    <label className="block cursor-pointer">
      <span className="mb-1.5 block text-sm font-bold text-ink-800">{label}</span>
      <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-ink-200 bg-cream-100 transition hover:border-brand-300">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="px-3 text-center text-xs text-ink-400">
            タップして写真を選択
            <br />
            <span className="mt-1 inline-block">{hint}</span>
          </span>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
    </label>
  );
}

function ResultView({
  result,
  onReset,
}: {
  result: AnalysisResult;
  onReset: () => void;
}) {
  if (!result.detected) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-soft">
        <p className="text-sm text-ink-600">{result.error}</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-5 rounded-full bg-ink-800 px-6 py-3 text-sm font-bold text-white"
        >
          もう一度試す
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 予約CTA（最優先・最上部） */}
      <section className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5 shadow-soft">
        <h2 className="font-serif text-lg font-bold text-ink-900">
          詳しい改善方法は、施術時にお伝えします
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          姿勢の傾向は人それぞれ。あなたに合った根本改善プランは、来院時に専門家が直接ご提案します。
          まずはご予約ください。
        </p>
        <BookingCTA variant="full" className="mt-4" />
      </section>

      {/* 総合スコア */}
      <section className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-soft">
        <p className="text-sm text-ink-500">あなたの姿勢スコア</p>
        <p className="mt-1 font-serif text-5xl font-bold text-ink-900">
          {result.overall}
          <span className="ml-1 text-xl text-ink-400">/ 100</span>
        </p>
        <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
            style={{ width: `${result.overall}%` }}
          />
        </div>
      </section>

      {/* 項目別スコア */}
      <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
        <h3 className="mb-3 font-serif text-base font-bold text-ink-800">項目別の傾向</h3>
        <ul className="space-y-3">
          {result.items.map((it) => (
            <li key={it.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-ink-700">{it.label}</span>
                <span
                  className={
                    it.level === "good"
                      ? "font-bold text-accent-700"
                      : it.level === "warning"
                      ? "font-bold text-gold-500"
                      : "font-bold text-brand-600"
                  }
                >
                  {it.score}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                <div
                  className={`h-full rounded-full ${
                    it.level === "good"
                      ? "bg-accent-500"
                      : it.level === "warning"
                      ? "bg-gold-400"
                      : "bg-brand-500"
                  }`}
                  style={{ width: `${it.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 改善ポイント（セルフケア詳細は出さない） */}
      {result.points.length > 0 && (
        <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
          <h3 className="mb-3 font-serif text-base font-bold text-ink-800">改善ポイント</h3>
          <ul className="space-y-2">
            {result.points.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-600">
                <span className="text-brand-500">●</span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-cream-100 p-3 text-xs leading-relaxed text-ink-500">
            具体的なセルフケアや施術メニューは、お一人おひとりの状態に合わせて来院時にご案内します。
          </p>
        </section>
      )}

      {/* 再CTA */}
      <BookingCTA variant="full" />

      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-ink-400 underline underline-offset-2 hover:text-ink-600"
        >
          別の写真で分析し直す
        </button>
        <p className="mt-3 text-xs text-ink-400">
          すでに会員の方は{" "}
          <Link href="/library/" className="text-brand-600 underline">
            セルフケアライブラリ
          </Link>{" "}
          へ
        </p>
      </div>
    </div>
  );
}
