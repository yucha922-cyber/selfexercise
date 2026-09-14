import { CLINIC } from "@/config/clinic";

// どのセルフケアをログインなしで公開するかを判定します。
// 公開するのは clinic.ts の recommendedSlugs（院からのおすすめ）に入っているものだけで、
// それ以外は会員コードでログインした方のみ閲覧できます。
export const isFreeSlug = (slug: string): boolean =>
  CLINIC.recommendedSlugs.includes(slug);
