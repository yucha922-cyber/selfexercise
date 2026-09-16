"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isMember } from "@/lib/auth";

// 無料公開しているセルフケアの最後に出す会員案内。
// すでにログイン済みの方には表示しません。
export default function MemberInvite() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!isMember());
  }, []);

  if (!show) return null;

  return (
    <section className="mt-12 rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center">
      <h2 className="font-serif text-lg font-bold text-brand-800">
        ほかのセルフケアは会員様限定です
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-brand-700/90">
        首・肩・腰・股関節・脚など、さまざまなセルフケアを動画と写真でご用意しています。
        ご来院いただいた会員様は、会員コードでログインするとすべてご覧いただけます。
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-ink-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-ink-900"
      >
        会員コードでログイン
      </Link>
      <p className="mt-3 text-xs leading-relaxed text-brand-700/80">
        会員コードが分からない方は、担当セラピストにお尋ねください。
      </p>
    </section>
  );
}
