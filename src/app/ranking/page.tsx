import type { Metadata } from "next";
import { getAllSelfCare } from "@/lib/selfcare";
import RankingList from "@/components/RankingList";

export const metadata: Metadata = {
  title: "人気ランキング",
  description: "よく見られているセルフケアの人気ランキングです。",
};

export default function RankingPage() {
  const items = getAllSelfCare();
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-800">人気ランキング</h1>
      <p className="mt-2 text-sm text-gray-600">
        全体の人気度と、あなたがよく見ているセルフケアをもとに並べています。
      </p>
      <div className="mt-6">
        <RankingList items={items} />
      </div>
    </div>
  );
}
