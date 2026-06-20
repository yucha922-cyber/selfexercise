// 難易度を★で表示するコンポーネント（★1〜5）。
export default function Difficulty({ level }: { level: number }) {
  const clamped = Math.max(1, Math.min(5, level));
  return (
    <span
      className="inline-flex items-center gap-0.5 text-accent-500"
      aria-label={`難易度 ${clamped} / 5`}
      title={`難易度 ${clamped} / 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < clamped ? "text-accent-500" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}
