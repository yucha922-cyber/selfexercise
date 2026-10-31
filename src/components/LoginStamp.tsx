"use client";

import { useEffect, useState } from "react";
import { dateKey } from "@/lib/streak";
import {
  getLoginStreak,
  getVisitDays,
  MILESTONES,
  nextMilestone,
  recordVisit,
} from "@/lib/visits";

// ログインスタンプカード。ライブラリ上部に表示します。
// その日はじめて開いたときは「スタンプGET！」のお祝いを出し、
// 今月のカレンダーにスタンプを並べて「◯日連続ログイン！」を表示します。

/** その日のお祝いを出したかどうか（同じ日に何度も出さないため） */
const CELEBRATED_KEY = "naoru:visits:celebrated";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** 連続日数に応じたひとこと */
const cheer = (streak: number): string => {
  if (streak >= 30) return "すばらしい習慣になっています！";
  if (streak >= 14) return "セルフケアが毎日の習慣になってきました。";
  if (streak >= 7) return "1週間続きました！この調子です。";
  if (streak >= 3) return "いいペースです。明日も続けましょう。";
  if (streak >= 2) return "2日続けて来てくださいました。";
  return "今日も1つだけでも、セルフケアをしてみましょう。";
};

type MonthCell = { key: string; day: number; isToday: boolean } | null;

const buildMonth = (now: Date): MonthCell[] => {
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = dateKey(now);
  const cells: MonthCell[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = dateKey(new Date(year, month, day));
    cells.push({ key, day, isToday: key === today });
  }
  return cells;
};

export default function LoginStamp() {
  const [ready, setReady] = useState(false);
  const [streak, setStreak] = useState(0);
  const [visits, setVisits] = useState<Set<string>>(new Set());
  const [celebrate, setCelebrate] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    recordVisit();
    const today = dateKey();
    let celebrated = "";
    try {
      celebrated = window.localStorage.getItem(CELEBRATED_KEY) ?? "";
      window.localStorage.setItem(CELEBRATED_KEY, today);
    } catch {
      /* 無視 */
    }
    setNow(new Date());
    setStreak(getLoginStreak());
    setVisits(getVisitDays());
    setCelebrate(celebrated !== today);
    setReady(true);
  }, []);

  // 読み込み前は高さだけ確保して、表示のちらつきを防ぐ
  if (!ready) return <div className="mt-2 h-64" aria-hidden />;

  const goal = nextMilestone(streak);
  const cells = buildMonth(now);
  const monthCount = cells.filter((c) => c && visits.has(c.key)).length;

  return (
    <>
      <section className="mt-2 rounded-2xl border border-brand-100 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wider2 text-brand-600">ログインスタンプ</p>
            <h2 className="mt-1 font-serif text-xl font-bold text-ink-900">
              <span className="text-3xl text-brand-600">{streak}</span>日連続ログイン！
            </h2>
            <p className="mt-1 text-sm text-ink-500">{cheer(streak)}</p>
          </div>
          <p className="text-xs text-ink-400">
            {now.getMonth() + 1}月のスタンプ {monthCount}個
          </p>
        </div>

        {/* 次の目標までのゲージ */}
        {goal && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-ink-500">
              <span>
                あと<strong className="text-brand-600">{goal - streak}日</strong>で
                {goal}日連続達成
              </span>
              <span>
                {streak} / {goal}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-200">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${Math.min(100, (streak / goal) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* 今月のカレンダー */}
        <div className="mt-5 grid grid-cols-7 gap-1.5 text-center">
          {WEEKDAYS.map((w, i) => (
            <span
              key={w}
              className={`text-[0.65rem] font-bold ${
                i === 0 ? "text-brand-400" : i === 6 ? "text-ink-400" : "text-ink-300"
              }`}
            >
              {w}
            </span>
          ))}
          {cells.map((c, i) =>
            c ? (
              <DayCell
                key={c.key}
                day={c.day}
                stamped={visits.has(c.key)}
                isToday={c.isToday}
                animate={celebrate && c.isToday}
              />
            ) : (
              <span key={`blank-${i}`} aria-hidden />
            )
          )}
        </div>
        <p className="mt-3 text-[0.7rem] leading-relaxed text-ink-400">
          会員ページを開いた日に、1日1つスタンプが押されます（記録はこの端末にだけ保存されます）。
        </p>
      </section>

      {celebrate && (
        <StampModal streak={streak} goal={goal} onClose={() => setCelebrate(false)} />
      )}
    </>
  );
}

function DayCell({
  day,
  stamped,
  isToday,
  animate,
}: {
  day: number;
  stamped: boolean;
  isToday: boolean;
  animate: boolean;
}) {
  return (
    <span
      className={`relative flex aspect-square items-center justify-center rounded-full text-xs ${
        isToday && !stamped ? "border-2 border-dashed border-brand-200" : ""
      } ${stamped ? "text-white" : isToday ? "font-bold text-ink-700" : "text-ink-300"}`}
    >
      {stamped && (
        <span
          aria-hidden
          className={`absolute inset-0.5 flex items-center justify-center rounded-full border-2 border-brand-600 bg-brand-500 shadow-sm ${
            animate ? "animate-stamp" : "-rotate-12"
          }`}
        />
      )}
      <span className="relative font-bold">{stamped ? "済" : day}</span>
      <span className="sr-only">{stamped ? `${day}日 ログイン済み` : `${day}日`}</span>
    </span>
  );
}

function StampModal({
  streak,
  goal,
  onClose,
}: {
  streak: number;
  goal: number | null;
  onClose: () => void;
}) {
  // 目標日数ちょうどに届いた日は、特別なメッセージを出す
  const achieved = MILESTONES.includes(streak);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stamp-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs animate-pop rounded-3xl bg-white p-7 text-center shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-bold tracking-wider2 text-brand-600">今日のスタンプGET！</p>
        <div className="mx-auto mt-5 flex h-28 w-28 animate-stamp items-center justify-center rounded-full border-4 border-double border-brand-600 bg-brand-50">
          <span className="font-serif text-lg font-bold leading-tight text-brand-600">
            {streak}
            <span className="text-sm">日</span>
            <br />
            <span className="text-sm">連続</span>
          </span>
        </div>
        <h2 id="stamp-title" className="mt-5 font-serif text-xl font-bold text-ink-900">
          {streak}日連続ログイン！
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {achieved
            ? `${streak}日連続を達成しました。おめでとうございます！`
            : cheer(streak)}
          {goal && (
            <>
              <br />
              次の目標は <strong className="text-brand-600">{goal}日連続</strong> です。
            </>
          )}
        </p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="mt-6 w-full rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600"
        >
          今日のセルフケアをはじめる
        </button>
      </div>
    </div>
  );
}
