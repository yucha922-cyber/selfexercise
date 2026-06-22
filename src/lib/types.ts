export type SelfCareImage = {
  /** 画像パス 例: /images/shoulder/stretch1.jpg */
  src: string;
  /** 画像の下に表示する説明文（任意） 例: 開始姿勢 */
  caption?: string;
};

export type SelfCare = {
  /** URL に使う一意なスラッグ（半角英数字とハイフン） */
  slug: string;
  /** タイトル 例: 肩こり改善ストレッチ */
  title: string;
  /** 目的: なぜ行うのか */
  purpose: string;
  /** 実施方法の手順 */
  steps: string[];
  /** 注意事項 */
  cautions: string[];
  /** YouTube 動画ID（埋め込み用・任意） */
  youtubeId?: string;
  /** 画像（任意・最大5枚。それぞれ説明文 caption を付けられます） */
  images?: SelfCareImage[];
  /** 所要時間 例: 約3分 */
  duration: string;
  /** 難易度 ★1〜5 */
  difficulty: number;
  /** 関連する症状の slug 一覧（src/data/categories.ts 参照） */
  symptoms: string[];
  /** 関連する部位の slug 一覧（src/data/categories.ts 参照） */
  parts: string[];
  /** タグ（自由入力） */
  tags: string[];
  /** 人気度スコア（ランキング初期値・任意） */
  popularity?: number;
};
