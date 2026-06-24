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

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`読み込み失敗: ${src}`));
    document.head.appendChild(s);
  });
}

async function getDetector(): Promise<any> {
  if (detectorPromise) return detectorPromise;
  detectorPromise = (async () => {
    await loadScript(TFJS_URL);
    await loadScript(POSE_URL);
    const tf = window.tf;
    const pd = window.poseDetection;
    if (!tf || !pd) throw new Error("解析エンジンの初期化に失敗しました");
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
      return await pd.createDetector(pd.SupportedModels.MoveNet, {
        modelType: pd.movenet.modelType.SINGLEPOSE_THUNDER,
      });
    }
  })();
  return detectorPromise;
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

async function detect(img: HTMLImageElement): Promise<KP[] | null> {
  try {
    const detector = await getDetector();
    const poses = await detector.estimatePoses(img, { flipHorizontal: false });
    if (!poses || poses.length === 0) return null;
    return poses[0].keypoints as KP[];
  } catch {
    return null;
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

  const items: ScoreItem[] = [];

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
  try {
    const items: ScoreItem[] = [];
    const poses: PoseOnImage[] = [];

    if (side) {
      const k = await detect(side);
      if (k) {
        items.push(...analyzeSide(k));
        poses.push({ slot: "side", keypoints: k });
      }
    }
    if (front) {
      const k = await detect(front);
      if (k) {
        items.push(...analyzeFront(k));
        poses.push({ slot: "front", keypoints: k });
      }
    }

    if (items.length === 0) {
      return {
        detected: false,
        overall: 0,
        items: [],
        points: [],
        poses: [],
        error:
          "姿勢を読み取れませんでした。全身がはっきり写った写真で再度お試しください。",
      };
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
    return {
      detected: false,
      overall: 0,
      items: [],
      points: [],
      poses: [],
      error:
        "解析エンジンを読み込めませんでした。通信環境の良い場所で再度お試しください。",
    };
  }
}
