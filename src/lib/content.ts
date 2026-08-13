import type { SelfCare } from "./types";

// セルフケアの本文ファイル（.md）を読み取ります。
//
// ファイルの形は次の2つに分かれています。
//   1) 先頭の --- で囲んだ部分 …… タイトルや分類などの設定
//   2) その下の「## 見出し」の部分 …… 目的・実施方法・注意点の本文
//
// 例:
//   ---
//   title: 胸筋ストレッチ
//   symptoms: katakori, nekoze
//   ---
//
//   ## 目的
//   胸の筋肉を伸ばして肩こりをやわらげます。
//
//   ## 実施方法
//   - 壁の横に立ちます。
//   - 体をゆっくりひねります。
//
//   ## 注意点
//   - 痛みが出たら中止してください。

/** 「## 見出し」として使える名前（ゆらぎを吸収） */
const SECTION_ALIASES: Record<string, "purpose" | "steps" | "cautions"> = {
  目的: "purpose",
  実施方法: "steps",
  やり方: "steps",
  手順: "steps",
  注意点: "cautions",
  注意事項: "cautions",
};

type Sections = { purpose: string[]; steps: string[]; cautions: string[] };

/** 「- 」で始まる行を配列に。それ以外の行はそのまま1件として扱う。 */
function toList(lines: string[]): string[] {
  return lines
    .map((l) => l.replace(/^[-*・]\s*/, "").trim())
    .filter((l) => l.length > 0);
}

/** カンマ区切り（全角読点も可）を配列に。角かっこは付けても付けなくてもよい。 */
function toArray(value: string): string[] {
  return value
    .replace(/^\[|\]$/g, "")
    .split(/[,、]/)
    .map((v) => v.trim().replace(/^["']|["']$/g, ""))
    .filter((v) => v.length > 0);
}

function toNumber(value: string, field: string, file: string): number {
  const n = Number(value);
  if (Number.isNaN(n)) {
    throw new Error(
      `${file} の ${field} は数字で書いてください（今は「${value}」になっています）。`
    );
  }
  return n;
}

export function parseSelfCare(raw: string, slug: string, file: string): SelfCare {
  const text = raw.replace(/^﻿/, "").replace(/\r\n?/g, "\n");

  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(
      `${file} の先頭に、--- で囲んだ設定（title など）が見つかりません。\n` +
        `ファイルの1行目を --- にして、設定を書き、もう一度 --- で閉じてください。`
    );
  }
  const [, frontmatter, body] = match;

  // --- 設定部分（key: value）---
  const meta: Record<string, string> = {};
  frontmatter.split("\n").forEach((line) => {
    if (!line.trim() || line.trim().startsWith("#")) return;
    const i = line.indexOf(":");
    if (i === -1) {
      throw new Error(
        `${file} の設定「${line.trim()}」に「:」がありません。「title: 名前」の形で書いてください。`
      );
    }
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });

  // --- 本文部分（## 見出し）---
  const sections: Sections = { purpose: [], steps: [], cautions: [] };
  let current: keyof Sections | null = null;
  const unknown: string[] = [];
  body.split("\n").forEach((line) => {
    const heading = line.match(/^#{2,3}\s*(.+?)\s*$/);
    if (heading) {
      const key = SECTION_ALIASES[heading[1].replace(/\s/g, "")];
      if (key) {
        current = key;
      } else {
        current = null;
        unknown.push(heading[1]);
      }
      return;
    }
    if (current && line.trim()) sections[current].push(line);
  });

  if (!meta.title) {
    throw new Error(`${file} に title（ページのタイトル）がありません。`);
  }
  if (sections.steps.length === 0) {
    const hint = unknown.length
      ? `\n見つかった見出し: ${unknown.join(" / ")}（「## 実施方法」と書いてください）`
      : "";
    throw new Error(`${file} に「## 実施方法」の手順が1つもありません。${hint}`);
  }

  return {
    slug,
    title: meta.title,
    purpose: toList(sections.purpose).join("\n"),
    steps: toList(sections.steps),
    cautions: toList(sections.cautions),
    youtubeId: meta.youtube ?? meta.youtubeId ?? "",
    duration: meta.duration || "約3分",
    difficulty: meta.difficulty ? toNumber(meta.difficulty, "difficulty", file) : 1,
    symptoms: toArray(meta.symptoms ?? ""),
    parts: toArray(meta.parts ?? ""),
    tags: toArray(meta.tags ?? ""),
    order: meta.order ? toNumber(meta.order, "order", file) : undefined,
    popularity: meta.popularity
      ? toNumber(meta.popularity, "popularity", file)
      : undefined,
    images: [],
  };
}
