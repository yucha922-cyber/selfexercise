import { CLINIC } from "@/config/clinic";

// 予約導線（LINE予約・WEB予約）。サイトの最優先CTA。
export default function BookingCTA({
  variant = "full",
  className = "",
}: {
  /** full: 2ボタン大きめ / compact: 横並び小さめ */
  variant?: "full" | "compact";
  className?: string;
}) {
  const big = variant === "full";
  return (
    <div
      className={`flex ${big ? "flex-col sm:flex-row" : "flex-row"} gap-3 ${className}`}
    >
      <a
        href={CLINIC.booking.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-[#06C755] font-bold text-white shadow-soft transition hover:brightness-95 ${
          big ? "px-6 py-4 text-base" : "px-4 py-2.5 text-sm"
        }`}
      >
        <svg width={big ? 22 : 18} height={big ? 22 : 18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3C6.48 3 2 6.69 2 11.23c0 2.62 1.5 4.95 3.86 6.48-.13.5-.7 2.5-.74 2.68 0 0-.03.2.1.27.13.08.28.02.28.02.36-.05 2.86-1.88 3.93-2.67.84.12 1.7.18 2.57.18 5.52 0 10-3.69 10-8.23S17.52 3 12 3z" />
        </svg>
        LINEで予約
      </a>
      <a
        href={CLINIC.booking.webUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 font-bold text-white shadow-soft transition hover:bg-brand-600 ${
          big ? "px-6 py-4 text-base" : "px-4 py-2.5 text-sm"
        }`}
      >
        <svg width={big ? 22 : 18} height={big ? 22 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        WEBで予約
      </a>
    </div>
  );
}
