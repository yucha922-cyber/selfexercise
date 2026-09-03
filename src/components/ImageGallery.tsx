"use client";

import { useEffect, useState } from "react";
import type { SelfCareImage } from "@/lib/types";
import { withBasePath } from "@/lib/path";

// 最大表示枚数
const MAX_IMAGES = 8;

export default function ImageGallery({
  images,
  title,
}: {
  images: SelfCareImage[];
  title: string;
}) {
  const list = images.slice(0, MAX_IMAGES);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ライトボックス表示中は背面のスクロールを止める
  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [openIndex]);

  // キーボード操作（Esc/←/→）
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight")
        setOpenIndex((i) => (i === null ? i : (i + 1) % list.length));
      if (e.key === "ArrowLeft")
        setOpenIndex((i) =>
          i === null ? i : (i - 1 + list.length) % list.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, list.length]);

  if (list.length === 0) return null;

  const current = openIndex !== null ? list[openIndex] : null;

  // 役割ラベル付き（開始姿勢／終了姿勢／ダメな例／手順①②）が1枚でもあればラベル表示にする
  const hasLabels = list.some((img) => img.label);

  // 手順（step1.jpg…）で構成された種目は、①→② の順にくり返す案内を出す
  const stepMarks = list
    .filter((img) => img.kind === "step")
    .map((img) => img.label);

  // 写真は切り抜かないため高さがそろわない。枚数に応じて列数を決める
  const gridCols =
    list.length === 2 || list.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <>
      {hasLabels ? (
        /* ラベル付き: スマホは縦積み、PCは横並び。写真は切り抜かず全体を表示する */
        <>
          <ul className={`grid grid-cols-1 items-start gap-4 ${gridCols}`}>
            {list.map((img, i) => (
              <li key={i}>
                <figure className="m-0 overflow-hidden rounded-xl border border-ink-100 bg-white">
                  {img.label && (
                    <p
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold ${
                        img.kind === "ng"
                          ? "bg-red-50 text-red-700"
                          : img.kind === "step"
                            ? "bg-brand-50 text-brand-700"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {img.kind !== "step" && (
                        <span aria-hidden>{img.kind === "ng" ? "✕" : "○"}</span>
                      )}
                      {img.label}
                      {/* 手順は「① 背中を丸める」のように番号の横に説明を出す */}
                      {img.kind === "step" && img.caption && (
                        <span className="font-normal">{img.caption}</span>
                      )}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    aria-label={`${img.label || img.caption || `画像${i + 1}`}を拡大表示`}
                    className="group relative block w-full overflow-hidden bg-cream-100"
                  >
                    {/* 切り抜くと姿勢が分からなくなるため、写真は全体をそのまま表示する */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={withBasePath(img.src)}
                      alt={`${title} ${img.label || ""} ${img.caption || ""}`.trim()}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full transition group-hover:scale-[1.02]"
                    />
                    <span className="absolute bottom-1.5 right-1.5 rounded-md bg-ink-900/55 p-1 text-white opacity-90">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </span>
                  </button>
                  {/* 手順の説明は上のラベルに出しているので、ここでは繰り返さない */}
                  {img.caption && img.kind !== "step" && (
                    <figcaption className="px-3 py-2 text-center text-xs leading-snug text-ink-500">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
          {stepMarks.length > 1 && (
            <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-center text-sm font-bold text-brand-700">
              {stepMarks.join(" → ")} の順に、くり返し行いましょう。
            </p>
          )}
        </>
      ) : list.length === 1 ? (
        /* 1枚のみのとき: 解説入りの「1枚完結画像」を想定し、切り抜かずに全幅表示 */
        <figure className="m-0">
          <button
            type="button"
            onClick={() => setOpenIndex(0)}
            aria-label={`${list[0].caption || "解説図"}を拡大表示`}
            className="card-hover group relative block w-full overflow-hidden rounded-xl border border-ink-100 bg-cream-100"
          >
            {/* 縦横比が画像ごとに異なるため、自然なサイズで表示する */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(list[0].src)}
              alt={list[0].caption || `${title} 解説図`}
              className="h-auto w-full transition group-hover:scale-[1.01]"
            />
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-ink-900/55 p-1 text-white opacity-90">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </button>
          {list[0].caption && (
            <figcaption className="mt-1.5 text-center text-xs leading-snug text-ink-500">
              {list[0].caption}
            </figcaption>
          )}
        </figure>
      ) : (
      <ul className={`grid grid-cols-1 items-start gap-3 ${gridCols}`}>
        {list.map((img, i) => (
          <li key={i}>
            <figure className="m-0">
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`${img.caption || `画像${i + 1}`}を拡大表示`}
                className="card-hover group relative block w-full overflow-hidden rounded-xl border border-ink-100 bg-cream-100"
              >
                {/* 切り抜くと解説が読めなくなるため、画像は全体をそのまま表示する */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBasePath(img.src)}
                  alt={img.caption || `${title} 参考画像 ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full transition group-hover:scale-[1.02]"
                />
                {/* 拡大アイコン */}
                <span className="absolute bottom-1.5 right-1.5 rounded-md bg-ink-900/55 p-1 text-white opacity-90">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
              </button>
              {img.caption && (
                <figcaption className="mt-1.5 text-center text-xs leading-snug text-ink-500">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
      )}

      {/* ライトボックス（タップで拡大） */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || "拡大画像"}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-950/85 p-4 backdrop-blur-sm"
        >
          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="閉じる"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
          >
            ×
          </button>

          {/* 画像本体（クリックは伝播させない） */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[80vh] w-full max-w-3xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(current.src)}
              alt={current.caption || `${title} 拡大画像`}
              className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {(current.label || current.caption) && (
              <p className="mt-3 text-center text-sm text-white/90">
                {[current.label, current.caption].filter(Boolean).join(" ")}
              </p>
            )}
          </div>

          {/* 前後ナビ（複数枚のとき） */}
          {list.length > 1 && (
            <div className="mt-4 flex items-center gap-6 text-white">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((i) =>
                    i === null ? i : (i - 1 + list.length) % list.length
                  );
                }}
                aria-label="前の画像"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl hover:bg-white/25"
              >
                ‹
              </button>
              <span className="text-sm tabular-nums">
                {openIndex! + 1} / {list.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((i) =>
                    i === null ? i : (i + 1) % list.length
                  );
                }}
                aria-label="次の画像"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl hover:bg-white/25"
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
