"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { SelfCareImage } from "@/lib/types";
import { withBasePath } from "@/lib/path";

// 最大表示枚数
const MAX_IMAGES = 5;

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

  return (
    <>
      {/* サムネイル一覧（スマホ2列・PC3列のレスポンシブ） */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {list.map((img, i) => (
          <li key={i}>
            <figure className="m-0">
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`${img.caption || `画像${i + 1}`}を拡大表示`}
                className="card-hover group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-ink-100 bg-cream-100"
              >
                <Image
                  src={withBasePath(img.src)}
                  alt={img.caption || `${title} 参考画像 ${i + 1}`}
                  fill
                  className="object-cover transition group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, 33vw"
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
            {current.caption && (
              <p className="mt-3 text-center text-sm text-white/90">
                {current.caption}
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
