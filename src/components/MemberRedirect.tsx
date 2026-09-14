"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 旧 /member/ を開いた方を、ログイン画面（トップページ）へ送ります。
export default function MemberRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="py-24 text-center">
      <p className="text-sm text-ink-400">ログイン画面へ移動しています…</p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-ink-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-ink-900"
      >
        会員ログインへ
      </Link>
    </div>
  );
}
