"use client";

import { useEffect, useRef } from "react";
import type { Keypoint } from "@/lib/poseAnalysis";

// MoveNet(17点)の骨格つながり
const SKELETON: [string, string][] = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
  ["nose", "left_eye"],
  ["nose", "right_eye"],
  ["left_eye", "left_ear"],
  ["right_eye", "right_ear"],
];

const MIN_SCORE = 0.3;

// 写真の上に検出したキーポイント（ドット）と骨格ラインを重ねて描画する。
export default function PoseOverlay({
  src,
  keypoints,
  label,
}: {
  src: string;
  keypoints: Keypoint[];
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const get = (name: string) => {
        const k = keypoints.find((p) => p.name === name);
        return k && (k.score ?? 0) >= MIN_SCORE ? k : undefined;
      };

      // 線の太さ・点の大きさを画像サイズに合わせる
      const unit = Math.max(w, h) / 220;

      // 骨格ライン
      ctx.lineWidth = Math.max(2, unit * 1.6);
      ctx.strokeStyle = "rgba(234,85,50,0.85)"; // brand coral
      ctx.lineCap = "round";
      SKELETON.forEach(([a, b]) => {
        const ka = get(a);
        const kb = get(b);
        if (ka && kb) {
          ctx.beginPath();
          ctx.moveTo(ka.x, ka.y);
          ctx.lineTo(kb.x, kb.y);
          ctx.stroke();
        }
      });

      // ドット
      const r = Math.max(3, unit * 2.4);
      keypoints.forEach((k) => {
        if ((k.score ?? 0) < MIN_SCORE) return;
        ctx.beginPath();
        ctx.arc(k.x, k.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = Math.max(1.5, unit * 1);
        ctx.strokeStyle = "#ea5532";
        ctx.stroke();
      });
    };
    img.src = src;
  }, [src, keypoints]);

  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-xl border border-ink-100 bg-cream-100">
        <canvas ref={canvasRef} className="block h-auto w-full" />
      </div>
      {label && (
        <figcaption className="mt-1.5 text-center text-xs text-ink-500">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
