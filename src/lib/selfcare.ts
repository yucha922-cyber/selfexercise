import fs from "node:fs";
import path from "node:path";
import type { SelfCare, SelfCareImage } from "./types";

// セルフケアは「1エクササイズ＝1ファイル」で管理します。
// src/data/selfcare/ フォルダ内の *.json をビルド時にすべて読み込みます。
// 追加: 新しい .json を1つ置くだけ（コード変更不要）
// 削除: そのファイルを消すだけ
// ※ "_" や "." で始まるファイル（例: _template.json）は読み込みません。
const DIR = path.join(process.cwd(), "src", "data", "selfcare");

// 画像は public/images/<slug>/ フォルダに置くだけで自動表示されます。
// ・ファイル名の昇順で並びます（例: 01_xxx.jpg → 02_xxx.jpg …）
// ・ファイル名の先頭の数字を除いた部分がキャプションになります
//   例: 「01_開始姿勢.jpg」→ キャプション「開始姿勢」
// ・JSON の images に手書きの指定がある場合はそちらが優先されます
const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function loadImagesFromFolder(slug: string): SelfCareImage[] {
  const dir = path.join(IMAGES_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(
      (f) =>
        !f.startsWith(".") && IMAGE_EXTS.has(path.extname(f).toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b, "ja", { numeric: true }))
    .map((f) => {
      const base = path.basename(f, path.extname(f));
      const caption = base.replace(/^\d+[-_ ]*/, "").trim();
      return {
        src: `/images/${slug}/${f}`,
        ...(caption ? { caption } : {}),
      };
    });
}

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
      const item = JSON.parse(raw) as SelfCare;
      // JSON に images の指定がなければ、public/images/<slug>/ から自動読み込み
      if (!item.images || item.images.length === 0) {
        item.images = loadImagesFromFolder(item.slug);
      }
      return item;
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
