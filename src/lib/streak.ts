"use client";

// セルフケアの実施記録（「今日やった」ボタン）。
// サーバーは使わず、その端末の localStorage にだけ保存します。
// 端末を変えたりデータを消したりすると記録も消えます。

const KEY = "naoru:done";

/** 実施日 → その日に行ったセルフケアの slug 一覧 */
type DoneLog = Record<string, string[]>;

/** 記録を残す日数の上限（古いものから消していく） */
const MAX_DAYS = 400;

export const dateKey = (d: Date = new Date()): string => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const shiftDays = (base: Date, days: number): Date => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

const readLog = (): DoneLog => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DoneLog) : {};
  } catch {
    return {};
  }
};

const writeLog = (log: DoneLog) => {
  if (typeof window === "undefined") return;
  const days = Object.keys(log).sort().slice(-MAX_DAYS);
  const trimmed: DoneLog = {};
  days.forEach((d) => {
    trimmed[d] = log[d];
  });
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    /* 容量超過などは無視 */
  }
};

/** 今日そのセルフケアを実施済みか */
export const isDoneToday = (slug: string): boolean =>
  (readLog()[dateKey()] ?? []).includes(slug);

/** 今日の実施を記録する／取り消す。記録後の状態を返す。 */
export const toggleDoneToday = (slug: string): boolean => {
  const log = readLog();
  const key = dateKey();
  const list = log[key] ?? [];
  let done: boolean;
  if (list.includes(slug)) {
    const next = list.filter((s) => s !== slug);
    if (next.length === 0) delete log[key];
    else log[key] = next;
    done = false;
  } else {
    log[key] = [slug, ...list];
    done = true;
  }
  writeLog(log);
  return done;
};

/**
 * 連続日数。今日まだ実施していない場合は、昨日までの連続日数を返します
 * （その日のうちに行えば記録が途切れないようにするため）。
 */
export const getStreak = (): number => {
  const log = readLog();
  const now = new Date();
  const hasToday = Boolean(log[dateKey(now)]?.length);
  let count = 0;
  // 今日未実施なら昨日から数え始める
  for (let i = hasToday ? 0 : 1; ; i += 1) {
    const key = dateKey(shiftDays(now, -i));
    if (!log[key]?.length) break;
    count += 1;
  }
  return count;
};

/** 直近7日間の実施状況（古い日 → 今日 の順） */
export type DayStatus = { date: string; weekday: string; done: boolean; isToday: boolean };

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export const getLast7Days = (): DayStatus[] => {
  const log = readLog();
  const now = new Date();
  const todayKey = dateKey(now);
  return Array.from({ length: 7 }, (_, i) => {
    const d = shiftDays(now, i - 6);
    const key = dateKey(d);
    return {
      date: key,
      weekday: WEEKDAYS[d.getDay()],
      done: Boolean(log[key]?.length),
      isToday: key === todayKey,
    };
  });
};

/** 今日実施したセルフケアの件数 */
export const getTodayCount = (): number => (readLog()[dateKey()] ?? []).length;

/** これまでに実施した日の合計 */
export const getTotalDays = (): number =>
  Object.values(readLog()).filter((v) => v.length > 0).length;
