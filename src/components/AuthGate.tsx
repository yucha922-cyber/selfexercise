"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isMember } from "@/lib/auth";

// 会員限定エリアのソフトな入口ガード。
// 未ログインのときは中身を表示せず、ログイン案内を出します。
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"checking" | "ok" | "no">("checking");

  useEffect(() => {
    setState(isMember() ? "ok" : "no");
  }, []);

  if (state === "checking") {
    return (
      <div className="py-24 text-center text-sm text-ink-400">読み込み中…</div>
    );
  }

  if (state === "no") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 018 0v4" />
          </svg>
        </div>
        <h1 className="font-serif text-xl font-bold text-ink-900">
          会員専用ページです
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          セルフケアライブラリは、来院された会員様限定でご覧いただけます。
          <br />
          施術時にお渡しする会員コードでログインしてください。
        </p>
        <Link
          href="/member/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-ink-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-ink-900"
        >
          会員コードでログイン
        </Link>
        <p className="mt-4 text-xs text-ink-400">
          まだ来院されていない方は、まず姿勢分析とご予約をどうぞ。
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
