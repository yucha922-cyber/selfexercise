import fs from "node:fs";
import path from "node:path";
import type { SelfCare, SelfCareImage } from "./types";
import { parseSelfCare } from "./content";

// セルフケアは「1エクササイズ＝1ファイル」で管理します。
// src/data/selfcare/ フォルダ内の *.md をビルド時にすべて読み込みます。
// 追加: 新しい .md を1つ置くだけ（コード変更不要）
// 削除: そのファイルを消すだけ
// ページのURLはファイル名になります（例: kata-chest-stretch.md → /selfcare/kata-chest-stretch/）
// ※ "_" や "." で始まるファイル（例: _template.md）は読み込みません。
const DIR = path.join(process.cwd(), "src", "data", "selfcare");

// 画像は public/images/<ファイル名と同じ名前>/ フォルダに置くだけで自動表示されます。
//
// 基本は次の3枚構成です（ファイル名で役割が決まります）。
//   start.jpg → 「開始姿勢」
//   end.jpg   → 「終了姿勢」
//   ng.jpg    → 「ダメな例」
// ファイル名のうしろに説明を足すと、画像の下に表示されます。
//   例: ng_肩がすくんでいる.jpg → ダメな例／説明「肩がすくんでいる」
//
// 上記以外の名前のファイルは、役割ラベルなしでファイル名順に並びます
// （解説を焼き込んだ1枚もの画像を置きたい場合など）。
const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

type Role = { aliases: string[]; label: string; kind: "ok" | "ng" };

// 表示はこの順番になります（ファイル名の順ではありません）
const ROLES: Role[] = [
  { aliases: ["start", "開始姿勢", "開始"], label: "開始姿勢", kind: "ok" },
  { aliases: ["end", "終了姿勢", "終了"], label: "終了姿勢", kind: "ok" },
  { aliases: ["ng", "ng例", "ダメな例", "だめな例"], label: "ダメな例", kind: "ng" },
];

/** ファイル名から役割と説明文を判定する。役割名でなければ null。 */
function matchRole(base: string): { role: Role; caption: string } | null {
  for (const role of ROLES) {
    for (const alias of role.aliases) {
      if (!base.toLowerCase().startsWith(alias.toLowerCase())) continue;
      const rest = base.slice(alias.length);
      // 役割名ちょうど、または「役割名 + 区切り + 説明」のときだけ採用する
      if (rest === "" || /^[-_ 　]/.test(rest)) {
        return { role, caption: rest.replace(/^[-_ 　]+/, "").trim() };
      }
    }
  }
  return null;
}

function loadImagesFromFolder(slug: string): SelfCareImage[] {
  const dir = path.join(IMAGES_DIR, slug);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter(
      (f) => !f.startsWith(".") && IMAGE_EXTS.has(path.extname(f).toLowerCase())
    );

  const roleImages: SelfCareImage[] = [];
  const otherImages: SelfCareImage[] = [];

  files.forEach((f) => {
    const base = path.basename(f, path.extname(f));
    const src = `/images/${slug}/${f}`;
    const matched = matchRole(base);
    if (matched) {
      roleImages.push({
        src,
        label: matched.role.label,
        kind: matched.role.kind,
        ...(matched.caption ? { caption: matched.caption } : {}),
      });
    } else {
      // 役割なし: 先頭の数字を除いた部分を説明文として使う（例: 01_開始姿勢.jpg）
      const caption = base.replace(/^\d+[-_ ]*/, "").trim();
      otherImages.push({ src, ...(caption ? { caption } : {}) });
    }
  });

  // 開始姿勢 → 終了姿勢 → ダメな例 の順に並べる
  roleImages.sort(
    (a, b) =>
      ROLES.findIndex((r) => r.label === a.label) -
      ROLES.findIndex((r) => r.label === b.label)
  );
  otherImages.sort((a, b) => a.src.localeCompare(b.src, "ja", { numeric: true }));

  return [...roleImages, ...otherImages];
}

function loadAll(): SelfCare[] {
  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_") && !f.startsWith("."))
    .sort();

  const items: SelfCare[] = files.map((file) => {
    const slug = path.basename(file, ".md");
    const raw = fs.readFileSync(path.join(DIR, file), "utf-8");
    const item = parseSelfCare(raw, slug, `src/data/selfcare/${file}`);
    item.images = loadImagesFromFolder(slug);
    return item;
  });

  const seen = new Set<string>();
  items.forEach((i) => {
    if (seen.has(i.slug)) {
      throw new Error(`セルフケアのファイル名が重複しています: ${i.slug}`);
    }
    seen.add(i.slug);
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
