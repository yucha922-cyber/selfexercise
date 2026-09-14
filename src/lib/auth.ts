"use client";

// 会員コード（合言葉）方式の簡易認証。
// 静的サイトのためサーバーは使わず、認証状態は localStorage に保存します。
// ※ これは「UIを会員限定にする」ソフトな仕組みです（来院患者向けの軽い保護）。
//    完全な秘匿が必要な情報は載せないでください。

import { CLINIC } from "@/config/clinic";

const KEY = "naoru:member";

/** 1つの会員コードに紐づく設定（clinic.ts の memberCodes の1件ぶん） */
export type MemberPlan = {
  code: string;
  /** ログイン後に表示する呼び名（任意） */
  label: string;
  /** 有効期限 "YYYY-MM-DD"（空なら無期限） */
  expires: string;
  /** 担当セラピストが指定したセルフケアの slug */
  prescription: string[];
  /** セラピストからのひとこと */
  message: string;
  /** セルフケアごとのひとこと */
  notes: Record<string, string>;
};

type RawPlan = {
  code: string;
  label?: string;
  expires?: string;
  prescription?: string[];
  message?: string;
  notes?: Record<string, string>;
};

const normalize = (raw: RawPlan): MemberPlan => ({
  code: raw.code,
  label: raw.label ?? "",
  expires: raw.expires ?? "",
  prescription: raw.prescription ?? [],
  message: raw.message ?? "",
  notes: raw.notes ?? {},
});

const PLANS: MemberPlan[] = (CLINIC.memberCodes as RawPlan[]).map(normalize);

const today = (): string => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/** 有効期限が切れていないか。expires が空なら常に有効。 */
export const isPlanValid = (plan: MemberPlan): boolean =>
  !plan.expires || plan.expires >= today();

const findPlan = (code: string): MemberPlan | undefined =>
  PLANS.find((p) => p.code.trim().toLowerCase() === code.trim().toLowerCase());

const readStored = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

/**
 * ログイン中の会員プランを返します。未ログイン・期限切れなら null。
 * 旧バージョンでログインした方（"1" が保存されている）は、
 * 先頭の有効なコードでログインしているものとして扱います。
 */
export const getPlan = (): MemberPlan | null => {
  const stored = readStored();
  if (!stored) return null;
  if (stored === "1") return PLANS.find(isPlanValid) ?? null;
  const plan = findPlan(stored);
  if (!plan || !isPlanValid(plan)) return null;
  return plan;
};

/** 保存されているコードが「期限切れ」なのかどうか（案内文の出し分け用） */
export const isExpired = (): boolean => {
  const stored = readStored();
  if (!stored || stored === "1") return false;
  const plan = findPlan(stored);
  return Boolean(plan && !isPlanValid(plan));
};

export const isMember = (): boolean => getPlan() !== null;

/** コードを照合してログイン。成功で true。期限切れのコードでは false。 */
export const login = (code: string): boolean => {
  const plan = findPlan(code);
  if (!plan || !isPlanValid(plan)) return false;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, plan.code);
    } catch {
      /* 無視 */
    }
  }
  return true;
};

/** 入力されたコードが「存在はするが期限切れ」かどうか（エラー文の出し分け用） */
export const isExpiredCode = (code: string): boolean => {
  const plan = findPlan(code);
  return Boolean(plan && !isPlanValid(plan));
};

export const logout = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* 無視 */
  }
};
