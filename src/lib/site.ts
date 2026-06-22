import { CLINIC } from "@/config/clinic";

// サイト全体のメタ情報。公開URLに合わせて siteUrl を変更してください。
export const SITE = {
  name: CLINIC.name,
  title: `${CLINIC.name}｜AI姿勢分析`,
  description: CLINIC.description,
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://example.github.io/selfexercise",
};
