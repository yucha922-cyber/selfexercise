import type { Metadata } from "next";
import MemberRedirect from "@/components/MemberRedirect";

// 会員ログインはトップページ（/）に統合しました。
// このページは、以前のURLをブックマークされている方のための転送用です。
export const metadata: Metadata = {
  title: "会員ログイン",
  description: "会員コードでログインすると、セルフケアライブラリを閲覧できます。",
  robots: { index: false, follow: false },
};

export default function MemberPage() {
  return <MemberRedirect />;
}
