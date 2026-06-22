import type { Metadata } from "next";
import { getAllSelfCare } from "@/lib/selfcare";
import RankingList from "@/components/RankingList";
import AuthGate from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "人気ランキング",
  description: "よく見られているセルフケアの人気ランキングです。",
  robots: { index: false, follow: false },
};

export default function RankingPage() {
  const items = getAllSelfCare();
  return (
    <AuthGate>
      <h1 className="font-serif text-2xl font-bold text-ink-900 sm:text-3xl">人気ランキング</h1>
      <p className="mt-2 text-sm text-ink-500">
        全体の人気度と、あなたがよく見ているセルフケアをもとに並べています。
      </p>
      <div className="mt-6">
        <RankingList items={items} />
      </div>
    </AuthGate>
  );
}
