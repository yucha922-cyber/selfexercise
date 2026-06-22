"use client";

// 会員コード（合言葉）方式の簡易認証。
// 静的サイトのためサーバーは使わず、認証状態は localStorage に保存します。
// ※ これは「UIを会員限定にする」ソフトな仕組みです（来院患者向けの軽い保護）。
//    完全な秘匿が必要な情報は載せないでください。

import { CLINIC } from "@/config/clinic";

const KEY = "naoru:member";

export const isMember = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/** コードを照合してログイン。成功で true。 */
export const login = (code: string): boolean => {
  const ok = CLINIC.memberCodes
    .map((c) => c.trim().toLowerCase())
    .includes(code.trim().toLowerCase());
  if (ok && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* 無視 */
    }
  }
  return ok;
};

export const logout = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* 無視 */
  }
};
