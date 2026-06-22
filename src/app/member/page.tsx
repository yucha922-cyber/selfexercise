import type { Metadata } from "next";
import MemberLogin from "@/components/MemberLogin";

export const metadata: Metadata = {
  title: "会員ログイン",
  description: "会員コードでログインすると、セルフケアライブラリを閲覧できます。",
  robots: { index: false, follow: false },
};

export default function MemberPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-ink-900">会員ログイン</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          来院された会員様向けのセルフケアライブラリです。
        </p>
      </div>
      <MemberLogin />
    </div>
  );
}
