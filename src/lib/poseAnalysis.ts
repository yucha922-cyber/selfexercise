"use client";

// ブラウザ内で完結する姿勢の簡易解析。
// TensorFlow.js + MoveNet を CDN から読み込み、アップロードされた写真の
// 骨格キーポイントを推定して、姿勢の傾向をスコア化します。
// 画像はサーバーに送信されません（端末内処理）。

declare global {
  interface Window {
    tf?: any;
    poseDetection?: any;
  }
}

const TFJS_URL =
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js";
const POSE_URL =
  "https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js";

let detectorPromise: Promise<any> | null = null;

/** 失敗の種類。画面のメッセージを出し分けるために使う。 */
export type FailureKind =
  | "network" // 解析エンジンをダウンロードできない（通信・アプリ内ブラウザなど）
  | "unsupported" // 端末・ブラウザが対応していない（WebGLなし・メモリ不足）
  | "photo"; // エンジンは動いたが、写真から姿勢を読み取れなかった

class EngineError extends Error {
  kind: FailureKind;
  constructor(kind: FailureKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

/** WebGL（GPU描画）が使えるか。使えない端末では解析が動かない。 */
export function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** LINEやInstagramなどのアプリ内ブラウザか（外部ファイルの読み込みが制限されることがある） */
const IN_APP_BROWSERS: { re: RegExp; name: string }[] = [
  { re: /Line\//i, name: "LINE" },
  { re: /Instagram/i, name: "Instagram" },
  { re: /FBAN|FBAV|FB_IAB/i, name: "Facebook" },
  { re: /TikTok|BytedanceWebview|musical_ly/i, name: "TikTok" },
  { re: /Twitter/i, name: "X（Twitter）" },
];

export function detectInAppBrowser(): string | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  return IN_APP_BROWSERS.find((b) => b.re.test(ua))?.name ?? null;
}

export type EnvCheck = {
  /** 解析を実行できる見込みがあるか */
  ok: boolean;
  /** アプリ内ブラウザ名（該当する場合） */
  inAppBrowser: string | null;
  /** WebGLが使えるか */
  webgl: boolean;
};

/** ページを開いた時点で、この端末で解析できそうかを判定する。 */
export function checkEnvironment(): EnvCheck {
  const inAppBrowser = detectInAppBrowser();
  const webgl = hasWebGL();
  return { ok: webgl && !inAppBrowser, inAppBrowser, webgl };
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );
    // 前回失敗して残っているタグは取り除いてから読み込み直す
    if (existing) {
      if (existing.dataset.loaded === "1") return resolve();
      existing.remove();
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = () =>
      reject(new EngineError("network", `読み込み失敗: ${src}`));
    document.head.appendChild(s);
  });
}

async function createDetector(): Promise<any> {
  if (!hasWebGL()) {
    throw new EngineError("unsupported", "WebGLが利用できません");
  }
  await loadScript(TFJS_URL);
  await loadScript(POSE_URL);
  const tf = window.tf;
  const pd = window.poseDetection;
  if (!tf || !pd) {
    throw new EngineError("network", "解析エンジンの初期化に失敗しました");
  }
  await tf.ready();
  // 立位の全身（脚・足まで）検出に強い BlazePose を優先。
  // 失敗時は MoveNet(Thunder) にフォールバック。
  try {
    return await pd.createDetector(pd.SupportedModels.BlazePose, {
      runtime: "tfjs",
      modelType: "full",
      enableSmoothing: false,
    });
  } catch {
    try {
      return await pd.createDetector(pd.SupportedModels.MoveNet, {
        modelType: pd.movenet.modelType.SINGLEPOSE_THUNDER,
      });
    } catch {
      // モデル本体のダウンロードに失敗した場合もここに来る
      throw new EngineError("network", "モデルを読み込めませんでした");
    }
  }
}

async function getDetector(): Promise<any> {
  if (!detectorPromise) detectorPromise = createDetector();
  try {
    return await detectorPromise;
  } catch (e) {
    // 失敗した結果を残さない。通信が回復すれば次回やり直せるようにする。
    detectorPromise = null;
    throw e;
  }
}

// 検出点の採用しきい値（低いほど多くの点を表示）
export const MIN_KP_SCORE = 0.2;

type KP = { x: number; y: number; score?: number; name?: string };

export type Keypoint = KP;

/** 描画用: 写真ごとの検出結果 */
export type PoseOnImage = {
  slot: "front" | "side";
  keypoints: KP[];
};

export type ScoreItem = {
  key: string;
  label: string;
  /** 0-100（100が良好） */
  score: number;
  level: "good" | "warning" | "alert";
};

export type AnalysisResult = {
  detected: boolean;
  overall: number;
  items: ScoreItem[];
  /** 改善ポイントの文言（セルフケア詳細は含めない） */
  points: string[];
  /** 写真ごとの検出キーポイント（オーバーレイ描画用） */
  poses: PoseOnImage[];
  error?: string;
  /** 失敗の種類（画面のメッセージ・案内の出し分け用） */
  errorKind?: FailureKind;
};

function kp(keypoints: KP[], name: string): KP | undefined {
  const k = keypoints.find((p) => p.name === name);
  return k && (k.score ?? 0) >= MIN_KP_SCORE ? k : undefined;
}

// 角度（垂直線からの傾き・度）
function tiltFromVertical(dx: number, dy: number): number {
  return Math.abs((Math.atan2(Math.abs(dx), Math.abs(dy)) * 180) / Math.PI);
}

function clampScore(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

function levelOf(score: number): ScoreItem["level"] {
  if (score >= 80) return "good";
  if (score >= 60) return "warning";
  return "alert";
}

/** 1枚の写真から姿勢を検出する。写真から読み取れないときだけ null を返す。 */
async function detect(
  detector: any,
  img: HTMLImageElement
): Promise<KP[] | null> {
  try {
    const poses = await detector.estimatePoses(img, { flipHorizontal: false });
    if (!poses || poses.length === 0) return null;
    return poses[0].keypoints as KP[];
  } catch {
    // 推論中の失敗はほぼメモリ不足。端末側の問題として扱う。
    throw new EngineError("unsupported", "解析中にエラーが発生しました");
  }
}

// 側面写真からの評価（信頼度の高い左右どちらかを採用）
function analyzeSide(keypoints: KP[]) {
  const pick = (l: string, r: string) => {
    const lk = kp(keypoints, l);
    const rk = kp(keypoints, r);
    if (lk && rk) return (lk.score ?? 0) >= (rk.score ?? 0) ? lk : rk;
    return lk || rk;
  };
  const ear = pick("left_ear", "right_ear");
  const shoulder = pick("left_shoulder", "right_shoulder");
  const hip = pick("left_hip", "right_hip");
  const knee = pick("left_knee", "right_knee");
  const ankle = pick("left_ankle", "right_ankle");

  const items: ScoreItem[] = [];

  // 重心ライン: 耳とくるぶしを結ぶ線が床に対して垂直か
  // （耳・肩・股関節・くるぶしが一直線に並ぶのが理想的な立位）
  if (ear && ankle) {
    const tilt = tiltFromVertical(ear.x - ankle.x, ear.y - ankle.y);
    items.push({
      key: "plumbLine",
      label: "重心ライン（耳〜くるぶし）",
      score: clampScore(100 - (tilt - 3) * 6),
      level: "good",
    });
  }

  // 頭部前方変位: 耳と肩の水平ズレ
  if (ear && shoulder) {
    const tilt = tiltFromVertical(ear.x - shoulder.x, ear.y - shoulder.y);
    items.push({
      key: "forwardHead",
      label: "頭部前方変位",
      score: clampScore(100 - (tilt - 5) * 4),
      level: "good",
    });
  }
  // 猫背: 肩と股関節を結ぶ線の垂直からの傾き
  if (shoulder && hip) {
    const tilt = tiltFromVertical(shoulder.x - hip.x, shoulder.y - hip.y);
    items.push({
      key: "kyphosis",
      label: "猫背（背中の丸まり）",
      score: clampScore(100 - (tilt - 4) * 4.5),
      level: "good",
    });
  }
  // 巻き肩: 肩が股関節より前方に出ている度合い
  if (shoulder && hip) {
    const forward = Math.abs(shoulder.x - hip.x);
    const torso = Math.abs(shoulder.y - hip.y) || 1;
    const ratio = forward / torso;
    items.push({
      key: "roundedShoulder",
      label: "巻き肩",
      score: clampScore(100 - (ratio - 0.08) * 320),
      level: "good",
    });
  }
  // 骨盤前傾: 股関節と膝のラインの傾き（簡易）
  if (hip && knee) {
    const tilt = tiltFromVertical(hip.x - knee.x, hip.y - knee.y);
    items.push({
      key: "pelvicTilt",
      label: "骨盤の傾き",
      score: clampScore(100 - (tilt - 4) * 4),
      level: "good",
    });
  }
  return items;
}

// 正面写真からの評価（左右バランス）
function analyzeFront(keypoints: KP[]): ScoreItem[] {
  const ls = kp(keypoints, "left_shoulder");
  const rs = kp(keypoints, "right_shoulder");
  const lh = kp(keypoints, "left_hip");
  const rh = kp(keypoints, "right_hip");
  const items: ScoreItem[] = [];
  if (ls && rs) {
    const width = Math.abs(ls.x - rs.x) || 1;
    const diff = Math.abs(ls.y - rs.y);
    const deg = (Math.atan2(diff, width) * 180) / Math.PI;
    let score = clampScore(100 - (deg - 1) * 9);
    if (lh && rh) {
      const hipDiff = Math.abs(lh.y - rh.y);
      const hipDeg = (Math.atan2(hipDiff, width) * 180) / Math.PI;
      score = clampScore((score + clampScore(100 - (hipDeg - 1) * 9)) / 2);
    }
    items.push({ key: "balance", label: "左右バランス", score, level: "good" });
  }
  return items;
}

// 改善ポイント（来院を促す文言。セルフケア詳細は出さない）
const POINT_MESSAGES: Record<string, string> = {
  plumbLine:
    "耳からくるぶしを結ぶ体の軸が前後にずれ、重心が偏りやすい傾向です。",
  forwardHead: "頭が前に出やすく、首や肩に負担がかかりやすい姿勢の傾向です。",
  kyphosis: "背中が丸まりやすく、肩こり・呼吸の浅さにつながりやすい傾向です。",
  roundedShoulder: "肩が前に入りやすく、巻き肩の傾向がみられます。",
  pelvicTilt: "骨盤の傾きにより、腰に負担がかかりやすい傾向です。",
  balance: "左右のバランスに差がみられ、体の歪みにつながりやすい傾向です。",
};

export async function analyzeImages(
  front: HTMLImageElement | null,
  side: HTMLImageElement | null
): Promise<AnalysisResult> {
  const fail = (kind: FailureKind, error: string): AnalysisResult => ({
    detected: false,
    overall: 0,
    items: [],
    points: [],
    poses: [],
    error,
    errorKind: kind,
  });

  // ① 解析エンジンの準備（ここでの失敗は写真ではなく端末・通信が原因）
  let detector: any;
  try {
    detector = await getDetector();
  } catch (e) {
    const kind = e instanceof EngineError ? e.kind : "network";
    return kind === "unsupported"
      ? fail(
          "unsupported",
          "お使いの端末では姿勢分析を実行できませんでした。別のスマートフォンやパソコンでお試しください。"
        )
      : fail(
          "network",
          "解析に必要なデータをダウンロードできませんでした。写真は問題ありません。"
        );
  }

  // ② 写真の解析
  try {
    const items: ScoreItem[] = [];
    const poses: PoseOnImage[] = [];

    if (side) {
      const k = await detect(detector, side);
      if (k) {
        items.push(...analyzeSide(k));
        poses.push({ slot: "side", keypoints: k });
      }
    }
    if (front) {
      const k = await detect(detector, front);
      if (k) {
        items.push(...analyzeFront(k));
        poses.push({ slot: "front", keypoints: k });
      }
    }

    if (items.length === 0) {
      return fail(
        "photo",
        "写真から姿勢を読み取れませんでした。頭のてっぺんから足先まで全身が入るように、" +
          "スマホを腰の高さに置いて3〜4歩下がって撮り直してみてください。"
      );
    }

    // レベル付与
    items.forEach((it) => (it.level = levelOf(it.score)));

    const overall = clampScore(
      items.reduce((s, it) => s + it.score, 0) / items.length
    );

    // スコアの低い項目から改善ポイントを生成（最大3件）
    const points = items
      .filter((it) => it.score < 80)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((it) => POINT_MESSAGES[it.key])
      .filter(Boolean);

    return { detected: true, overall, items, points, poses };
  } catch (e) {
    const kind = e instanceof EngineError ? e.kind : "unsupported";
    return fail(
      kind,
      "解析中にエラーが発生しました。写真の枚数を1枚に減らすか、" +
        "他のアプリを閉じてから再度お試しください。"
    );
  }
}
