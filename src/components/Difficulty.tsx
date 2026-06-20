// 難易度を★で表示するコンポーネント（★1〜5）。上品なゴールドで表現。
export default function Difficulty({ level }: { level: number }) {
  const clamped = Math.max(1, Math.min(5, level));
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[0.8rem]"
      aria-label={`難易度 ${clamped} / 5`}
      title={`難易度 ${clamped} / 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < clamped ? "text-gold-500" : "text-ink-200"}>
          ★
        </span>
      ))}
    </span>
  );
}
