"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/storage";

export default function FavoriteButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActive(isFavorite(slug));
  }, [slug]);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(toggleFavorite(slug));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "お気に入りから削除" : "お気に入りに追加"}
      className={`inline-flex items-center justify-center rounded-full transition-colors ${className}`}
    >
      <span className={mounted && active ? "text-accent-500" : "text-gray-300"}>
        {mounted && active ? "♥" : "♡"}
      </span>
    </button>
  );
}
