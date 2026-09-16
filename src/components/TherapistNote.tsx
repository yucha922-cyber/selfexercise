"use client";

import { useEffect, useState } from "react";
import { getPlan } from "@/lib/auth";

// ログイン中の会員コードに、このセルフケア向けのひとことが設定されていれば表示します。
// 設定が無いときは何も表示しません。
export default function TherapistNote({ slug }: { slug: string }) {
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote(getPlan()?.notes?.[slug] ?? "");
  }, [slug]);

  if (!note) return null;

  return (
    <aside className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-5">
      <p className="flex items-center gap-2 text-xs font-bold tracking-wider2 text-brand-700">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[0.6rem] text-white" aria-hidden>
          ♡
        </span>
        担当セラピストより
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{note}</p>
    </aside>
  );
}
