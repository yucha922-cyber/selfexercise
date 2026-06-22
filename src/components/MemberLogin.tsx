"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isMember, login, logout } from "@/lib/auth";

export default function MemberLogin() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [already, setAlready] = useState(false);

  useEffect(() => {
    setAlready(isMember());
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(code)) {
      router.push("/library/");
    } else {
      setError(true);
    }
  };

  if (already) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-soft">
        <p className="text-sm text-ink-600">すでにログイン済みです。</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.push("/library/")}
            className="rounded-full bg-ink-800 px-6 py-3 text-sm font-bold text-white hover:bg-ink-900"
          >
            セルフケアライブラリへ
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              setAlready(false);
            }}
            className="rounded-full border border-ink-200 px-6 py-3 text-sm font-bold text-ink-600 hover:border-ink-300"
          >
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft"
    >
      <label className="block">
        <span className="text-sm font-bold text-ink-800">会員コード</span>
        <input
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          placeholder="施術時にお渡ししたコード"
          className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        />
      </label>
      {error && (
        <p className="mt-2 text-sm text-brand-600">
          コードが正しくありません。お手元のコードをご確認ください。
        </p>
      )}
      <button
        type="submit"
        className="mt-5 w-full rounded-full bg-ink-800 px-6 py-4 text-base font-bold text-white shadow-soft transition hover:bg-ink-900"
      >
        ログイン
      </button>
      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        会員コードは、ご来院時に院よりお渡しします。コードが分からない場合は、
        次回来院時にスタッフへお尋ねください。
      </p>
    </form>
  );
}
