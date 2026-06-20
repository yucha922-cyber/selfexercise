"use client";

// localStorage を使ったお気に入り・最近見た項目の管理。
// SSG なのでデータはすべてブラウザ側に保存します。

const FAV_KEY = "selfcare:favorites";
const RECENT_KEY = "selfcare:recent";
const VIEW_KEY = "selfcare:views";
const MAX_RECENT = 10;

const read = (key: string): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const write = (key: string, value: string[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 容量超過などは無視 */
  }
};

/* ---------- お気に入り ---------- */
export const getFavorites = (): string[] => read(FAV_KEY);

export const isFavorite = (slug: string): boolean =>
  getFavorites().includes(slug);

export const toggleFavorite = (slug: string): boolean => {
  const favs = getFavorites();
  let next: string[];
  let active: boolean;
  if (favs.includes(slug)) {
    next = favs.filter((s) => s !== slug);
    active = false;
  } else {
    next = [slug, ...favs];
    active = true;
  }
  write(FAV_KEY, next);
  return active;
};

/* ---------- 最近見た ---------- */
export const getRecent = (): string[] => read(RECENT_KEY);

export const pushRecent = (slug: string) => {
  const recent = read(RECENT_KEY).filter((s) => s !== slug);
  write(RECENT_KEY, [slug, ...recent].slice(0, MAX_RECENT));
};

/* ---------- 閲覧数（ローカル人気度） ---------- */
type Views = Record<string, number>;

export const getViews = (): Views => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(VIEW_KEY);
    return raw ? (JSON.parse(raw) as Views) : {};
  } catch {
    return {};
  }
};

export const incrementView = (slug: string) => {
  if (typeof window === "undefined") return;
  const views = getViews();
  views[slug] = (views[slug] ?? 0) + 1;
  try {
    window.localStorage.setItem(VIEW_KEY, JSON.stringify(views));
  } catch {
    /* 無視 */
  }
};
