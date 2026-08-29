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
- 各セルフケア詳細（実施方法 / 注意事項 / YouTube動画 / 画像最大8枚 / 所要時間 / 難易度★）
- お気に入り保存・最近見た・人気ランキング（ブラウザ保存）
- 公開ページは `title`/`description` 自動生成＋schema.org対応、会員ページは noindex

## フォルダ構成

```
selfexercise/
├─ public/                  静的アセット（画像・PWA・アイコン等）
│  ├─ images/               エクササイズの写真（フォルダ名＝.md のファイル名）
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
│  │  └─ selfcare/          ★ セルフケアのコンテンツ（1エクササイズ＝1つの .md）
│  └─ lib/                  型定義・データ取得・localStorage・パス補正
├─ docs/                    編集マニュアル（本文の直し方・動画・画像ガイド）
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

## セルフケアの追加・編集方法（プログラミング不要）

セルフケアは **「1エクササイズ＝1ファイル」** で管理しています。
`src/data/selfcare/` フォルダの中に、エクササイズごとの Markdown（`.md`）ファイルが入っています。

```
src/data/selfcare/
├─ _template.md              ← コピー用のひな形（このファイル自体は公開されません）
├─ katakori-stretch.md       ← 肩こり改善ストレッチ
├─ youtsu-cat-stretch.md     ← 腰痛ケア
└─ ...（1ファイル＝1エクササイズ）
```

**このフォルダに新しい `.md` ファイルを1つ置くだけ**で、一覧・検索・カテゴリー・詳細
ページがすべて自動生成されます（コードの編集は不要）。
逆に、ファイルを1つ消すだけでそのエクササイズは消えます。
1ファイルが独立しているので、**ミスしても他のエクササイズに影響しません**。

> - ファイル名がそのままURLになります（`katakori-stretch.md` → `/selfcare/katakori-stretch/`）。
>   画像を入れるフォルダ名も同じです（`public/images/katakori-stretch/`）。
> - `_` や `.` で始まるファイル（`_template.md` など）は読み込まれません。

### ファイルの中身

上の `---` で囲まれた部分が **設定**、その下が **本文** です。

```markdown
---
title: 肩こり改善ストレッチ
order: 10
duration: 約3分
difficulty: 1
symptoms: katakori, kubikori
parts: kubi, kata
tags: ストレッチ, デスクワーク, 首
popularity: 95
youtube: https://youtu.be/dQw4w9WgXcQ
---

## 目的
硬くなった肩まわりの筋肉をやさしく伸ばし、肩こりの不快感をやわらげます。

## 実施方法
- 背筋を伸ばしてイスに座ります。
- 右手を頭の左側にそえます。
- 息を吐きながら、ゆっくり頭を右に倒します。

## 注意点
- 痛みが出たらすぐに中止してください。
```

手順の番号（①②③）は自動で付きます。**自分で番号を書く必要はありません**
（`- ` で始まる行を並べるだけです）。

### 設定項目

| 項目 | 説明 | 例 |
|------|------|----|
| `title` | タイトル（**必須**） | `肩こり改善ストレッチ` |
| `order` | 表示順（小さいほど先。任意） | `10` |
| `duration` | 所要時間（省略時は「約3分」） | `約3分` |
| `difficulty` | 難易度（1〜5の数字・★の数） | `2` |
| `symptoms` | 関連する症状の slug（カンマ区切り） | `katakori, kubikori` |
| `parts` | 関連する部位の slug（カンマ区切り） | `kubi, kata` |
| `tags` | タグ（自由入力・カンマ区切り） | `ストレッチ, 首` |
| `popularity` | 人気度の初期値（ランキング用・任意） | `90` |
| `youtube` | YouTube動画のURL（任意）。空なら動画なし | `https://youtu.be/dQw4w9WgXcQ` |

本文の見出しは `## 目的` `## 実施方法` `## 注意点` の3つです
（`## やり方` `## 手順` `## 注意事項` と書いても認識します）。
`## 実施方法` は必須で、これが無いとビルドがエラーになります。

画像は設定に書きません。`public/images/<ファイル名と同じ名前>/` に置くだけで
自動的に表示されます（後述）。

### 新しいエクササイズを追加する手順

1. GitHubで `src/data/selfcare/` フォルダを開きます。
2. `_template.md` の中身をコピーします。
3. 「Add file」→「Create new file」で **`スラッグ.md`**（例: `kata-towel.md`）を作り、貼り付けます。
   - スラッグ＝URLになる半角英数字とハイフン。ほかのファイルと重複しない名前にします。
4. 中身を書き換えます（各項目の意味は上記）。
5. `public/images/<スラッグ>/` フォルダを作って画像を置きます（任意）。
6. 保存（Commit）してマージすれば、自動で公開されます。

> 既存のエクササイズを直したいときは、そのファイルを開いて鉛筆アイコンで編集するだけです。
> 詳しい手順は `docs/how-to-edit.md` にあります。

### 動画（YouTube）の指定・差し替え方法

設定の `youtube:` のうしろにURLを貼るだけです。

```markdown
youtube: https://youtu.be/dQw4w9WgXcQ
```

次のどの形式で貼ってもOKです（`?t=30` などの余分な文字が付いていても動きます）。

| 形式 | 例 |
| --- | --- |
| 共有URL | `https://youtu.be/dQw4w9WgXcQ` |
| PCのアドレスバー | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` |
| ショート動画 | `https://www.youtube.com/shorts/dQw4w9WgXcQ` |
| ライブ配信 | `https://www.youtube.com/live/dQw4w9WgXcQ` |
| 動画IDのみ | `dQw4w9WgXcQ` |

- **差し替え**：`youtube:` の値を別のURLに書き換えるだけです。
- **動画を消す**：`youtube:` のうしろを空にします。
- 動画があると、詳細ページの上部（タイトルのすぐ下・「目的」の前）に
  再生プレイヤーが自動で表示されます。1ページに1本までです。
- 院内向けの動画は公開設定を **「限定公開」** にしてください
  （「非公開」だと埋め込んでも再生できません）。

詳しくは `docs/youtube-guide.md` を参照してください。

### 画像の追加方法（初心者向け）

画像は **ファイルに登録する必要はありません**。
`public/images/<ファイル名と同じ名前>/` フォルダに置くだけで、詳細ページに自動で表示されます
（**最大8枚**・タップで拡大）。

#### 基本は3枚構成（ファイル名で役割が決まります）

| ファイル名 | ページでの表示 |
| --- | --- |
| `start.jpg` | ○ 開始姿勢（緑ラベル） |
| `end.jpg` | ○ 終了姿勢（緑ラベル） |
| `ng.jpg` | ✕ ダメな例（赤ラベル） |

並ぶ順番は **開始姿勢 → 終了姿勢 → ダメな例** で固定です（ファイル名の順ではありません）。
3枚そろっていなくても大丈夫で、ある分だけ表示されます。

#### 画像を追加する手順

1. **画像を用意する**
   スマホやカメラで撮った写真でOKです。容量が大きい場合は事前に小さくしておくと表示が速くなります。
2. **フォルダを作る**
   GitHubで `public/images/` を開き、エクササイズのファイル名と同じ名前のフォルダを作ります
   （例: `kata-towel.md` なら `public/images/kata-towel/`）。
3. **アップロードする**
   「Add file」→「Upload files」→ 画像をドラッグ＆ドロップ →「Commit changes」。
4. 以上です。本文ファイルの編集は不要で、そのままページに表示されます。

#### 画像の下に一言を付けたいとき

ファイル名のうしろに `_` を付けて説明を書くと、画像の下に表示されます。

- `ng_肩がすくんでいる.jpg` → ✕ ダメな例／説明「肩がすくんでいる」
- `start_手のひらを壁につく.jpg` → ○ 開始姿勢／説明「手のひらを壁につく」

#### 画像の差し替え方法

`public/images/...` にある画像を、**同じファイル名のまま新しい画像で上書きアップロード**
すれば、本文ファイルを触らずに写真だけ差し替えられます。

> よくある注意:
> - 置き場所は `public/images/<エクササイズのファイル名>/`。フォルダ名が違うと表示されません
> - 対応形式は jpg / jpeg / png / webp / gif / avif
> - ファイル名の大文字・小文字は区別されます（`Start.JPG` と `start.jpg` は別物）
> - `start` / `end` / `ng` 以外の名前（例: `01.png`）で置くと、役割ラベルなしで表示されます
>   （解説を焼き込んだ1枚もの画像を置きたい場合。`docs/one-sheet-image-guide.md` 参照）

詳しくは `public/images/README.md` を参照してください。

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
