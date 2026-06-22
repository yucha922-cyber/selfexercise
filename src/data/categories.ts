// カテゴリー定義。
// 症状(symptoms)・部位(parts)の一覧をここで一元管理します。
// セルフケアを追加するときは src/data/selfcare/ 内の各JSONの symptoms / parts に
// 下記の slug を指定してください。

export type Category = {
  slug: string;
  name: string;
};

// ① 症状別
export const SYMPTOMS: Category[] = [
  { slug: "katakori", name: "肩こり" },
  { slug: "kubikori", name: "首こり" },
  { slug: "youtsu", name: "腰痛" },
  { slug: "zutsu", name: "頭痛" },
  { slug: "nekoze", name: "猫背" },
  { slug: "straightneck", name: "ストレートネック" },
  { slug: "sorigoshi", name: "反り腰" },
  { slug: "zakotsushinkeitsu", name: "坐骨神経痛" },
  { slug: "kokansetsutsu", name: "股関節痛" },
  { slug: "hizatsu", name: "膝痛" },
  { slug: "shijukata", name: "四十肩" },
  { slug: "gojukata", name: "五十肩" },
];

// ② 部位別
export const PARTS: Category[] = [
  { slug: "kubi", name: "首" },
  { slug: "kata", name: "肩" },
  { slug: "hiji", name: "肘" },
  { slug: "senaka", name: "背中" },
  { slug: "koshi", name: "腰" },
  { slug: "kotsuban", name: "骨盤" },
  { slug: "kokansetsu", name: "股関節" },
  { slug: "hiza", name: "膝" },
  { slug: "ashikubi", name: "足首" },
];

export const symptomName = (slug: string): string =>
  SYMPTOMS.find((s) => s.slug === slug)?.name ?? slug;

export const partName = (slug: string): string =>
  PARTS.find((p) => p.slug === slug)?.name ?? slug;
