"use client";

// ログインスタンプ（来訪の記録）。
// 会員エリアを開いた日に1日1つスタンプが押され、連続ログイン日数を数えます。
// 「今日やった」ボタンの実施記録（streak.ts）とは別の記録です。
// サーバーは使わず、その端末の localStorage にだけ保存します。

import { dateKey } from "./streak";

const KEY = "naoru:visits";

/** 記録を残す日数の上限（古いものから消していく） */
const MAX_DAYS = 400;

/** 連続ログインの目標（この日数に届くとバッジを表示） */
export const MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];

const readVisits = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((d): d is string => typeof d === "string") : [];
  } catch {
    return [];
  }
};

const writeVisits = (days: string[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(days.slice(-MAX_DAYS)));
  } catch {
    /* 容量超過などは無視 */
  }
};

const shiftDays = (base: Date, days: number): Date => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * 今日のスタンプを押します。
 * その日はじめての来訪なら true（スタンプ獲得の演出に使います）。
 */
export const recordVisit = (): boolean => {
  const days = readVisits();
  const today = dateKey();
  if (days.includes(today)) return false;
  writeVisits([...days, today].sort());
  return true;
};

/** 来訪した日の一覧（"YYYY-MM-DD"） */
export const getVisitDays = (): Set<string> => new Set(readVisits());

/**
 * 連続ログイン日数。今日まだ来ていない場合は昨日までの日数を返します
 * （その日のうちに開けば記録が途切れないようにするため）。
 */
export const getLoginStreak = (): number => {
  const days = getVisitDays();
  const now = new Date();
  let count = 0;
  for (let i = days.has(dateKey(now)) ? 0 : 1; ; i += 1) {
    if (!days.has(dateKey(shiftDays(now, -i)))) break;
    count += 1;
  }
  return count;
};

/** 次に目指す目標日数（すべて達成済みなら null） */
export const nextMilestone = (streak: number): number | null =>
  MILESTONES.find((m) => m > streak) ?? null;
