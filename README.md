# NAORU整体院 集客＋会員セルフケアプラットフォーム

「施術が主役・セルフケアは補助」のコンセプトで、**新規集客**と**継続支援**を両立する
整体院向けの静的サイトです。AI姿勢分析で来院を促し、来院した会員のみがセルフケアを閲覧できます。

- **技術**: Next.js 14 (App Router) / TypeScript / TailwindCSS
- **公開**: GitHub Pages（静的サイト生成 / SSG）
- **カラー**: 白 × インク（濃紺）× NAORUコーラル

## サイトの導線（ファネル）

```
トップ（施術が主役のLP）
  └→ AI姿勢分析（無料・登録不要・誰でも可）
       └→ 結果画面（スコア＋改善ポイント／セルフケア詳細は出さない）
            └→ 予約CTA（LINE / WEB）＝最優先
                 └→ 来院・施術
                      └→ 会員コードでログイン
                           └→ セルフケアライブラリ（会員限定）
```

## 公開エリア（誰でも閲覧可）

- **トップページ**: 施術を主役にしたLP。AI分析と予約へ誘導
- **AI姿勢分析** (`/analysis/`): 正面・側面の写真からブラウザ内で姿勢を解析
  - 解析項目: 頭部前方変位 / 巻き肩 / 猫背 / 骨盤の傾き / 左右バランス（スコア表示）
  - **写真はサーバーに送信されず、端末内だけで処理**（TensorFlow.js / MoveNet）
  - 結果はスコアと改善ポイントのみ。**セルフケア詳細は出さず、予約CTAを最優先表示**

## 会員限定エリア（ログイン後のみ）

- **セルフケアライブラリ** (`/library/`): 症状別・部位別、検索、院からのおすすめ
- 各セルフケア詳細（YouTube動画 / 画像 / 実施方法 / 注意事項 / 所要時間 / 難易度★）
- お気に入り保存・最近見たセルフケア・人気ランキング

## 院・予約・会員の設定（`src/config/clinic.ts`）

サイトの主要な設定はこの1ファイルに集約しています。

| 項目 | 内容 |
|------|------|
| `name` / `catchphrase` / `description` | 院名・キャッチコピー・説明 |
| `booking.lineUrl` | **LINE予約のURL（要差し替え）** |
| `booking.webUrl` | **WEB予約のURL（要差し替え）** |
| `booking.tel` | 電話番号（任意） |
| `memberCodes` | 会員コード（合言葉）の配列。来院時に患者へ渡す |
| `recommendedSlugs` | 「院からのおすすめ」に出すセルフケアの slug |

> ⚠️ `booking.lineUrl` と `booking.webUrl` は仮の値です。**必ず実際の予約URLに変更してください。**

## 会員認証について（採用方式と提案）

**採用: 会員コード（合言葉）方式**を推奨・実装しています。

- 来院時に院が会員コード（例 `NAORU2026`）を渡す → 患者が `/member/` で入力 → ライブラリ解放
- 静的サイトだけで完結し、「**来院した継続患者のみ**」という条件を自然に満たせます
- コードは `clinic.ts` の `memberCodes` で管理。定期的に変えると会員の入れ替えにも対応できます

他候補との比較:

| 方式 | 静的サイトで完結 | 手間 | 備考 |
|------|------------------|------|------|
| 会員コード（採用） | ◯ | 低 | 来院ベースの限定に最適 |
| LINEログイン | ✕（要サーバー/LIFF） | 中 | 本格運用なら将来拡張候補 |
| メール認証 | ✕（要サーバー） | 中 | 同上 |

> 注意（ソフトな保護）: 静的サイトのため認証はブラウザ側で行います。表示は会員限定にできますが、
> HTMLソースを直接見れば内容を取得できる「ソフトな保護」です。完全な秘匿が必要な情報は載せないでください。
> 厳密な保護が必要になった場合は、LINEログイン＋サーバー（または限定配信）への移行をご検討ください。

## 主な機能（セルフケア部分）

- カテゴリー（症状別 / 部位別）・フリーワード検索 ＋ 複数条件フィルター
- 各セルフケア詳細（実施方法 / 注意事項 / YouTube動画 / 画像最大5枚 / 所要時間 / 難易度★）
- お気に入り保存・最近見た・人気ランキング（ブラウザ保存）
- 公開ページは `title`/`description` 自動生成＋schema.org対応、会員ページは noindex

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
