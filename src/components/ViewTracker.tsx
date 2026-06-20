"use client";

import { useEffect } from "react";
import { pushRecent, incrementView } from "@/lib/storage";

// 詳細ページ表示時に「最近見た」と閲覧数を記録する。
export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    pushRecent(slug);
    incrementView(slug);
  }, [slug]);
  return null;
}
