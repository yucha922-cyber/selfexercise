// NAORU ロゴ。コーラルのハートに手描き風の動きの線を添えたブランドマーク。
// ※ 公式ロゴ画像(PNG)に差し替えたい場合は public/naoru-logo.png を置き、
//   このコンポーネントの代わりに <img src={withBasePath('/naoru-logo.png')} /> を使ってください。

type Props = {
  /** ハートマークの高さ(px) */
  size?: number;
  /** "NAORU" のワードマークを表示するか */
  withWordmark?: boolean;
  className?: string;
};

export default function Logo({
  size = 32,
  withWordmark = true,
  className = "",
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        height={size}
        viewBox="0 0 64 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="NAORU"
        style={{ overflow: "visible" }}
      >
        {/* 動きの線（手描き風スウッシュ） */}
        <path
          d="M5 30c4-2 9-2.5 14-1.5"
          stroke="#15151a"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M3 39c5-2.5 11-3 17-1.8"
          stroke="#15151a"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* ハート本体 */}
        <path
          d="M40 13.5c-3.2 0-6 1.8-7.5 4.4-1.3-2.4-3.7-4.1-6.6-4.3-4.7-.3-8.6 3.4-8.6 8 0 1.7.5 3.2 1.4 4.6 2.6 4.2 9 9.2 13 13.5.5.5 1.3.6 1.9.2 4.8-3.2 12.2-9.1 14.6-14.2.7-1.4 1.1-3 1-4.7-.3-4.4-4-7.8-8.6-7.5z"
          fill="#EA5532"
          stroke="#15151a"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* ハート下の流れる尾 */}
        <path
          d="M30 39c-1.5 4-1 8 3 11"
          stroke="#15151a"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {withWordmark && (
        <span
          className="font-semibold tracking-[0.22em] text-ink-800"
          style={{ fontSize: size * 0.52 }}
        >
          NAORU
        </span>
      )}
    </span>
  );
}
