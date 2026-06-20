# セルフケアライブラリ

整体院に通院されている患者様が、ご自宅でセルフケア（ストレッチ・エクササイズ）を確認できる
モバイルファーストの情報サイトです。LINEリッチメニューやLPからのアクセスを想定しています。

- **技術**: Next.js 14 (App Router) / TypeScript / TailwindCSS
- **公開**: GitHub Pages（静的サイト生成 / SSG）
- **PWA対応**: ホーム画面に追加・簡易オフライン対応
- **カラー**: 白 × ネイビー × アクセントグリーン

## 主な機能

- ヒーローセクション＋検索バーのトップページ
- カテゴリー検索（① 症状別 / ② 部位別）
- フリーワード検索 ＋ 複数条件フィルター（症状 × 部位 × タグ）
- 各セルフケア詳細（目的 / 実施方法 / 注意事項 / YouTube動画 / 画像 / 所要時間 / 難易度★）
- お気に入り保存・最近見たセルフケア・人気ランキング（ブラウザ保存）
- ページごとの `title` / `description` 自動生成、構造化データ（schema.org）対応

## フォルダ構成

```
selfexercise/
├─ public/                  静的アセット（PWA・アイコン等）
│  ├─ icons/                PWAアイコン（生成物）
│  ├─ manifest.webmanifest  PWAマニフェスト
│  ├─ sw.js                 サービスワーカー
│  ├─ robots.txt
│  └─ .nojekyll             GitHub Pages用（_next/ を配信するため必須）
├─ scripts/
│  └─ generate-icons.mjs    アイコン生成スクリプト（依存なし）
├─ src/
│  ├─ app/                  ページ（App Router）
│  │  ├─ layout.tsx         共通レイアウト・メタ情報・SW登録
│  │  ├─ page.tsx           トップページ
│  │  ├─ search/            検索ページ
│  │  ├─ favorites/         お気に入りページ
│  │  ├─ ranking/           人気ランキングページ
│  │  ├─ symptom/[slug]/    症状別一覧ページ
│  │  ├─ part/[slug]/       部位別一覧ページ
│  │  └─ selfcare/[slug]/   セルフケア詳細ページ
│  ├─ components/           UIコンポーネント
│  ├─ data/
│  │  ├─ categories.ts      症状・部位のカテゴリー定義
│  │  └─ selfcare.json      ★ セルフケアのコンテンツ（ここを編集して追加）
│  └─ lib/                  型定義・データ取得・localStorage・パス補正
├─ .github/workflows/deploy.yml  GitHub Pages 自動デプロイ
├─ next.config.mjs
├─ tailwind.config.ts
└─ package.json
```

## ローカルでの起動

```bash
npm install
npm run dev        # http://localhost:3000
```

静的ファイルを書き出す場合:

```bash
npm run build      # out/ に静的ファイルが出力されます
```

## GitHub Pages へのデプロイ手順

1. このリポジトリを GitHub に push します。
2. GitHub の **Settings → Pages → Build and deployment → Source** を
   **「GitHub Actions」** に設定します。
3. `main` ブランチへ push すると `.github/workflows/deploy.yml` が動き、
   自動でビルド＆公開されます（手動実行も可: Actions タブの「Run workflow」）。
4. 公開URLは `https://<ユーザー名>.github.io/<リポジトリ名>/` です。

> リポジトリ名がURLのサブパスになるため、`basePath` はワークフロー内で
> `actions/configure-pages` が出力する値（例: `/selfexercise`）を
> `NEXT_PUBLIC_BASE_PATH` として自動設定します。手動ビルド時は
> `NEXT_PUBLIC_BASE_PATH=/<リポジトリ名> npm run build` を指定してください。

独自ドメインやユーザーサイト（`<user>.github.io`）でサブパスが不要な場合は
`NEXT_PUBLIC_BASE_PATH` を空にしてビルドします。

## セルフケアの追加方法（プログラミング不要）

セルフケアのコンテンツは **`src/data/selfcare.json`** にまとめて管理しています。
このファイルに項目を1つ追加するだけで、一覧・検索・カテゴリー・詳細ページが
すべて自動生成されます。

### 手順

1. `src/data/selfcare.json` を開きます。
2. 既存の項目（`{ ... }`）をコピーして、配列の中に貼り付けます。
3. 内容を書き換えます（各項目の意味は下記）。
4. 保存して push すれば、自動で公開されます。

### 記入項目

| 項目 | 説明 | 例 |
|------|------|----|
| `slug` | URLになる英数字（重複・空白NG） | `"katakori-stretch"` |
| `title` | タイトル | `"肩こり改善ストレッチ"` |
| `purpose` | 目的（なぜ行うのか） | `"硬くなった肩の筋肉を…"` |
| `steps` | 実施方法（手順を1行ずつ） | `["背筋を伸ばす", "頭を倒す"]` |
| `cautions` | 注意事項（1行ずつ） | `["痛みが出たら中止"]` |
| `youtubeId` | YouTube動画ID（任意） | `"dQw4w9WgXcQ"` |
| `images` | 画像パス（任意・複数可） | `["/images/sample.jpg"]` |
| `duration` | 所要時間 | `"約3分"` |
| `difficulty` | 難易度（1〜5の数字） | `2` |
| `symptoms` | 関連する症状の slug | `["katakori", "kubikori"]` |
| `parts` | 関連する部位の slug | `["kubi", "kata"]` |
| `tags` | タグ（自由入力） | `["ストレッチ", "首"]` |
| `popularity` | 人気度の初期値（任意の数字） | `90` |

### YouTube動画の指定方法

YouTubeのURLが `https://www.youtube.com/watch?v=XXXXXXXXXXX` の場合、
`XXXXXXXXXXX` の部分が動画IDです。これを `youtubeId` に入れてください。
動画が不要な場合は `""`（空）のままで構いません。

### 画像の追加方法

1. 画像ファイルを `public/images/` フォルダに入れます。
2. `images` に `"/images/ファイル名.jpg"` のように指定します（複数可）。

### 症状・部位の slug 一覧

`symptoms` / `parts` には次の slug を使ってください（`src/data/categories.ts` 参照）。

**症状**: `katakori`(肩こり) / `kubikori`(首こり) / `youtsu`(腰痛) / `zutsu`(頭痛) /
`nekoze`(猫背) / `straightneck`(ストレートネック) / `sorigoshi`(反り腰) /
`zakotsushinkeitsu`(坐骨神経痛) / `kokansetsutsu`(股関節痛) / `hizatsu`(膝痛) /
`shijukata`(四十肩) / `gojukata`(五十肩)

**部位**: `kubi`(首) / `kata`(肩) / `hiji`(肘) / `senaka`(背中) / `koshi`(腰) /
`kotsuban`(骨盤) / `kokansetsu`(股関節) / `hiza`(膝) / `ashikubi`(足首)

> 症状・部位そのものを増やしたい場合は `src/data/categories.ts` に追記します。

## アイコンの再生成

PWAアイコンは以下で再生成できます（依存パッケージ不要）。

```bash
node scripts/generate-icons.mjs
```

## 免責

本サイトのセルフケアは一般的な情報提供を目的としています。痛みや異常を感じた場合は
中止し、通院中の整体院または医療機関にご相談ください。
