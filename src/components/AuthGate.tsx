"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isMember } from "@/lib/auth";

// 会員限定エリアのソフトな入口ガード。
// 未ログインのときは中身を表示せず、ログイン案内を出します。
//
// allow を true にすると、ログインしていなくても中身を表示します。
// 「院からのおすすめ」3つを無料公開するために使っています（src/lib/access.ts）。
export default function AuthGate({
  children,
  allow = false,
}: {
  children: React.ReactNode;
  allow?: boolean;
}) {
  const [state, setState] = useState<"checking" | "ok" | "no">(
    allow ? "ok" : "checking"
  );

  useEffect(() => {
    if (allow) return;
    setState(isMember() ? "ok" : "no");
  }, [allow]);

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
          会員様専用のセルフケアです
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          こちらのセルフケアは、ご来院いただいた会員様限定でご覧いただけます。
          <br />
          施術時にお渡しする会員コードでログインしてください。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-ink-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-ink-900"
        >
          会員コードでログイン
        </Link>
        <p className="mt-4 text-xs leading-relaxed text-ink-400">
          会員コードが分からない方は、担当セラピストにお尋ねください。
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
