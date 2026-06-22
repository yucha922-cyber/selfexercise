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

セルフケアは **「1エクササイズ＝1ファイル」** で管理しています。
`src/data/selfcare/` フォルダの中に、エクササイズごとの JSON ファイルが入っています。

```
src/data/selfcare/
├─ _template.json            ← コピー用のひな形（このファイル自体は公開されません）
├─ katakori-stretch.json     ← 肩こり改善ストレッチ
├─ youtsu-cat-stretch.json   ← 腰痛ケア
└─ ...（1ファイル＝1エクササイズ）
```

**このフォルダに新しいJSONファイルを1つ置くだけ**で、一覧・検索・カテゴリー・詳細
ページがすべて自動生成されます（コードの編集は不要）。
逆に、ファイルを1つ消すだけでそのエクササイズは消えます。
1ファイルが独立しているので、**ミスしても他のエクササイズに影響しません**。

### 新しいエクササイズを追加する手順

1. GitHubで `src/data/selfcare/` フォルダを開きます。
2. `_template.json` の中身をコピーします（「Add file」→「Create new file」で新規作成）。
3. 新しいファイル名を **`スラッグ.json`**（例: `kata-towel.json`）にします。
   - スラッグ＝URLになる半角英数字。`slug` の値とファイル名を同じにすると分かりやすいです。
4. 中身を書き換えます（各項目の意味は下記）。
5. 保存（Commit）してマージすれば、自動で公開されます。

### 記入項目

| 項目 | 説明 | 例 |
|------|------|----|
| `order` | 表示順（小さいほど先。任意） | `10` |
| `slug` | URLになる英数字（重複・空白NG／ファイル名と揃える） | `"katakori-stretch"` |
| `title` | タイトル | `"肩こり改善ストレッチ"` |
| `purpose` | 目的（なぜ行うのか） | `"硬くなった肩の筋肉を…"` |
| `steps` | 実施方法（手順を1行ずつ） | `["背筋を伸ばす", "頭を倒す"]` |
| `cautions` | 注意事項（1行ずつ） | `["痛みが出たら中止"]` |
| `youtubeId` | YouTube動画ID（任意） | `"dQw4w9WgXcQ"` |
| `images` | 画像（任意・最大5枚／説明文つき） | `[{ "src": "/images/sample.jpg", "caption": "開始姿勢" }]` |
| `duration` | 所要時間 | `"約3分"` |
| `difficulty` | 難易度（1〜5の数字） | `2` |
| `symptoms` | 関連する症状の slug | `["katakori", "kubikori"]` |
| `parts` | 関連する部位の slug | `["kubi", "kata"]` |
| `tags` | タグ（自由入力） | `["ストレッチ", "首"]` |
| `popularity` | 人気度の初期値（任意の数字） | `90` |

### 動画（YouTube）の指定・差し替え方法

YouTubeのURLが `https://www.youtube.com/watch?v=XXXXXXXXXXX` の場合、
`XXXXXXXXXXX` の部分が動画IDです。これを `youtubeId` に入れてください。

```json
"youtubeId": "XXXXXXXXXXX"
```

- **差し替え**：`youtubeId` の値を別の動画IDに書き換えるだけです。
- **動画を消す**：`"youtubeId": ""`（空）にします。
- 動画があると、詳細ページの上部に再生プレイヤーが自動で表示されます。

### 画像の追加方法（初心者向け）

各セルフケアには **最大5枚** の画像を、それぞれ **説明文（caption）つき** で登録できます。
登録した画像は詳細ページに並び、スマホでもきれいに表示され、**タップすると拡大**されます。

#### 画像を1枚追加する手順

1. **画像を用意する**
   スマホやカメラで撮った写真でOKです。ファイル名は半角英数字にします
   （例: `stretch1.jpg`）。容量が大きい場合は事前に小さくしておくと表示が速くなります。

2. **画像をフォルダに入れる**
   GitHubの画面から `public/images/` の中にアップロードします。
   セルフケアごとにフォルダを分けると整理しやすいです（例: `public/images/katakori/`）。
   - GitHubサイトで `public/images` フォルダを開く →「Add file」→「Upload files」→
     画像をドラッグ＆ドロップ →「Commit changes」

3. **JSONに画像を登録する**
   `src/data/selfcare.json` を開き、対象のセルフケアの `images` に1行追加します。

   ```json
   "images": [
     { "src": "/images/katakori/stretch1.jpg", "caption": "開始姿勢" }
   ]
   ```

   - `src` … 画像の場所。**必ず `/images/` から書きます**（先頭のスラッシュを忘れずに）。
     `public` は書きません（`public/images/...` ではなく `/images/...`）。
   - `caption` … 画像の下に出る説明文。不要なら省略できます。

4. **2枚目以降を足すとき** は、`,`（カンマ）で区切って続けます（最大5枚）。

   ```json
   "images": [
     { "src": "/images/katakori/stretch1.jpg", "caption": "開始姿勢" },
     { "src": "/images/katakori/stretch2.jpg", "caption": "ストレッチ中" },
     { "src": "/images/katakori/stretch3.jpg", "caption": "NG例" }
   ]
   ```

5. **保存（Commit）してマージ** すれば、自動で公開サイトに反映されます。

#### 画像の差し替え方法

`public/images/...` にある画像を、**同じファイル名のまま新しい画像で上書きアップロード**
すれば、JSONを触らずに写真だけ差し替えられます。

> よくある注意:
> - `src` の先頭は `/images/`（`public` は付けない）
> - 各行は `{ ... }`、行と行の間は `,` で区切る、最後の行にはカンマを付けない
> - ファイル名の大文字・小文字は区別されます（`Stretch1.JPG` と `stretch1.jpg` は別物）

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
