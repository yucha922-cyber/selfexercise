"use client";

import { useEffect, useState } from "react";

// 「ホーム画面に追加」の案内。
// Android/Chrome はインストールボタン、iPhone は手順を表示します。
// すでにホーム画面から開いている場合や、閉じたあとは表示しません。

const DISMISS_KEY = "naoru:install-dismissed";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [mode, setMode] = useState<"none" | "button" | "ios">("none");
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);

  useEffect(() => {
    // すでにホーム画面のアプリとして開いている
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari 独自のプロパティ
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* 読めないときは表示する */
    }

    // Android/Chrome: インストール可能になるとこのイベントが飛んでくる
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
      setMode("button");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iPhone/iPad の Safari はこのイベントが無いため、手順を案内する
    const ua = window.navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIos && isSafari) setMode("ios");

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    setMode("none");
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* 無視 */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  };

  if (mode === "none") return null;

  return (
    <section className="mt-10 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-base font-bold text-ink-900">
            ホーム画面に追加すると便利です
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
            スマホのホーム画面に置いておくと、アプリのように1タップで開けます。
            毎回ログインし直す必要もありません。
          </p>

          {mode === "ios" ? (
            <ol className="mt-3 space-y-1 text-sm text-ink-600">
              <li>1. 画面下の共有ボタン（□に↑のマーク）を押します</li>
              <li>2. 「ホーム画面に追加」を選びます</li>
              <li>3. 右上の「追加」を押して完了です</li>
            </ol>
          ) : (
            <button
              type="button"
              onClick={install}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-ink-900"
            >
              ホーム画面に追加する
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="この案内を閉じる"
          className="shrink-0 rounded-full px-2 py-1 text-lg leading-none text-ink-300 transition hover:bg-ink-50 hover:text-ink-500"
        >
          ×
        </button>
      </div>
    </section>
  );
}
