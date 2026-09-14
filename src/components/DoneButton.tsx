"use client";

import { useEffect, useState } from "react";
import { getStreak, isDoneToday, toggleDoneToday } from "@/lib/streak";

// 「今日やった」ボタン。押すとその日の実施として記録し、連続日数を表示します。
// 記録はこの端末のブラウザにだけ保存されます。
export default function DoneButton({ slug }: { slug: string }) {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setDone(isDoneToday(slug));
    setStreak(getStreak());
    setReady(true);
  }, [slug]);

  const onClick = () => {
    setDone(toggleDoneToday(slug));
    setStreak(getStreak());
  };

  // 読み込み前は高さだけ確保して、表示のちらつきを防ぐ
  if (!ready) return <div className="mt-8 h-[4.5rem]" aria-hidden />;

  return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft sm:flex-row sm:justify-between">
      <div className="text-center sm:text-left">
        <p className="text-sm font-bold text-ink-800">
          {done ? "今日の記録をつけました" : "行ったら記録しておきましょう"}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-400">
          {streak > 0 ? (
            <>
              現在 <strong className="text-brand-600">{streak}日連続</strong>{" "}
              で続いています。この調子です。
            </>
          ) : (
            "記録はこの端末にだけ保存されます。次回の施術時にご覧いただけます。"
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={done}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${
          done
            ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300"
            : "bg-brand-500 text-white shadow-soft hover:bg-brand-600"
        }`}
      >
        <span aria-hidden>{done ? "✓" : "＋"}</span>
        {done ? "今日やった（取り消す）" : "今日やった"}
      </button>
    </div>
  );
}
