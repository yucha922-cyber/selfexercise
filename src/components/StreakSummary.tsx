"use client";

import { useEffect, useState } from "react";
import {
  getLast7Days,
  getStreak,
  getTodayCount,
  getTotalDays,
  type DayStatus,
} from "@/lib/streak";

// ライブラリ上部に出す継続の記録。
// 1日でも記録があるときだけ表示します（初回は邪魔にならないように）。
export default function StreakSummary() {
  const [ready, setReady] = useState(false);
  const [streak, setStreak] = useState(0);
  const [days, setDays] = useState<DayStatus[]>([]);
  const [today, setToday] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
    setDays(getLast7Days());
    setToday(getTodayCount());
    setTotal(getTotalDays());
    setReady(true);
  }, []);

  if (!ready || total === 0) return null;

  return (
    <section className="mt-2 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-ink-800">継続の記録</h2>
          <p className="mt-1 text-sm text-ink-500">
            {streak > 0 ? (
              <>
                <strong className="text-brand-600">{streak}日連続</strong>
                で続いています
                {today > 0 && <>・今日は{today}種目</>}
              </>
            ) : (
              <>今日はまだ記録がありません。1つだけでも大丈夫です。</>
            )}
          </p>
        </div>
        <p className="text-xs text-ink-400">これまで{total}日</p>
      </div>

      <ul className="mt-4 flex justify-between gap-1.5">
        {days.map((d) => (
          <li key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
            <span className={`text-[0.65rem] ${d.isToday ? "font-bold text-ink-700" : "text-ink-400"}`}>
              {d.weekday}
            </span>
            <span
              title={`${d.date}${d.done ? "：実施" : "：記録なし"}`}
              className={`flex h-8 w-full items-center justify-center rounded-lg text-xs font-bold ${
                d.done
                  ? "bg-brand-500 text-white"
                  : d.isToday
                    ? "border-2 border-dashed border-brand-200 bg-cream-50 text-ink-300"
                    : "bg-cream-100 text-ink-200"
              }`}
            >
              {d.done ? "✓" : "–"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
