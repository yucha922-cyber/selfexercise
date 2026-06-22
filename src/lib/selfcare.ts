import fs from "node:fs";
import path from "node:path";
import type { SelfCare } from "./types";

// セルフケアは「1エクササイズ＝1ファイル」で管理します。
// src/data/selfcare/ フォルダ内の *.json をビルド時にすべて読み込みます。
// 追加: 新しい .json を1つ置くだけ（コード変更不要）
// 削除: そのファイルを消すだけ
// ※ "_" や "." で始まるファイル（例: _template.json）は読み込みません。
const DIR = path.join(process.cwd(), "src", "data", "selfcare");

function loadAll(): SelfCare[] {
  const files = fs
    .readdirSync(DIR)
    .filter(
      (f) =>
        f.endsWith(".json") && !f.startsWith("_") && !f.startsWith(".")
    )
    .sort();

  const items: SelfCare[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(DIR, file), "utf-8");
    try {
      return JSON.parse(raw) as SelfCare;
    } catch (e) {
      throw new Error(
        `セルフケアのデータ読み込みに失敗しました: src/data/selfcare/${file}\n` +
          `JSONの書式（カンマ・括弧など）を確認してください。\n${(e as Error).message}`
      );
    }
  });

  // 表示順: order 昇順 → 同じなら popularity 降順 → title
  return items.sort((a, b) => {
    const oa = a.order ?? Number.MAX_SAFE_INTEGER;
    const ob = b.order ?? Number.MAX_SAFE_INTEGER;
    if (oa !== ob) return oa - ob;
    const pa = a.popularity ?? 0;
    const pb = b.popularity ?? 0;
    if (pa !== pb) return pb - pa;
    return a.title.localeCompare(b.title, "ja");
  });
}

const items = loadAll();

export const getAllSelfCare = (): SelfCare[] => items;

export const getSelfCareBySlug = (slug: string): SelfCare | undefined =>
  items.find((item) => item.slug === slug);

export const getSelfCareBySymptom = (symptom: string): SelfCare[] =>
  items.filter((item) => item.symptoms.includes(symptom));

export const getSelfCareByPart = (part: string): SelfCare[] =>
  items.filter((item) => item.parts.includes(part));

export const getPopular = (limit = 5): SelfCare[] =>
  [...items]
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, limit);

export const getAllSlugs = (): string[] => items.map((item) => item.slug);
