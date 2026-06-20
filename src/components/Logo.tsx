import { withBasePath } from "@/lib/path";

// NAORU 公式ロゴ（ハートマーク＋ロゴタイプ）。
// 画像は public/naoru-logo.jpeg。差し替える場合は同名で置き換えてください。

type Props = {
  /** ロゴの高さ(px)。画像は正方形なので幅も同値になります。 */
  size?: number;
  className?: string;
  /** 余白を詰めて表示（ヘッダー等）したい場合に true */
  tight?: boolean;
};

export default function Logo({ size = 40, className = "", tight = false }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBasePath("/naoru-logo.jpeg")}
      alt="NAORU"
      width={size}
      height={size}
      className={`select-none ${tight ? "" : ""} ${className}`}
      style={{ height: size, width: size, objectFit: "contain" }}
    />
  );
}
