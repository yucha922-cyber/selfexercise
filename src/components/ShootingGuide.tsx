"use client";

import { useState } from "react";

// 一人で姿勢写真を撮るためのセッティング手順。
// AIが見ているランドマーク（耳・肩・股関節・くるぶし）が写るように誘導します。

const SETUP_STEPS = [
  {
    title: "スマホを置く",
    body: "イスの座面や棚に、スマホを立てかけて置きます。カメラが自分のほうを向くようにしてください。",
    note: "高さの目安は「腰の高さ（床から70〜80cm）」。低すぎると見上げる角度になり、姿勢が正しく判定できません。",
  },
  {
    title: "5歩ぶん離れて立つ",
    body: "スマホから3〜4歩（約2m）下がって立ちます。頭のてっぺんから足先まで全身が画面に入る位置です。",
    note: "壁を背にすると、背景がすっきりして精度が上がります。",
  },
  {
    title: "セルフタイマーで撮る",
    body: "カメラのセルフタイマーを10秒に設定してから、立ち位置に戻って撮影します。",
    note: "動画で撮って、良いコマを静止画で切り出す方法でもかまいません。",
  },
];

const LANDMARKS = [
  {
    name: "耳",
    todo: "髪が耳にかからないようにする",
    why: "頭が前に出ていないか（ストレートネック）を見ます",
  },
  {
    name: "肩",
    todo: "体のラインが分かる服を着る",
    why: "巻き肩や左右の高さの差を見ます",
  },
  {
    name: "股関節",
    todo: "上着の裾を腰より上にする",
    why: "骨盤の傾きや猫背の度合いを見ます",
  },
  {
    name: "くるぶし",
    todo: "裸足か靴下。ズボンの裾を少し上げる",
    why: "体の重心が前後にずれていないかを見ます",
  },
];

const MISTAKES = [
  "スマホの位置が低く、見上げる角度になっている",
  "足先や頭が画面から切れている",
  "側面のとき、体が斜めを向いている（真横を向く）",
  "撮るときに姿勢を正してしまう（普段どおりで撮る）",
];

export default function ShootingGuide() {
  const [open, setOpen] = useState(true);

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span>
          <span className="block font-serif text-base font-bold text-ink-900">
            写真の撮り方（一人でも撮れます）
          </span>
          <span className="mt-0.5 block text-xs text-ink-500">
            正しく撮れていないと、姿勢を読み取れないことがあります
          </span>
        </span>
        <span className="shrink-0 text-sm text-ink-400">{open ? "閉じる" : "開く"}</span>
      </button>

      {open && (
        <div className="border-t border-ink-100 px-5 pb-6 pt-5">
          {/* セッティング図 */}
          <SetupDiagram />

          {/* 手順 */}
          <ol className="mt-5 space-y-4">
            {SETUP_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-800">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.body}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* 立ち方 */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PoseCard
              title="正面の写真"
              items={[
                "カメラをまっすぐ見る",
                "足は腰はばに開き、つま先は前へ",
                "腕は体の横に自然に下ろす",
              ]}
            />
            <PoseCard
              title="側面の写真"
              items={[
                "体を真横（90度）に向ける",
                "顔も正面ではなく横のまま",
                "腕は体の横。体が腕で隠れないように",
              ]}
            />
          </div>

          <p className="mt-4 rounded-xl bg-brand-50/70 p-3 text-sm leading-relaxed text-ink-700">
            <span className="font-bold">いちばん大切なこと：</span>
            撮るときに<strong>姿勢を正さないでください</strong>。
            普段どおり、力を抜いて立った状態で撮ると、正しい傾向が出ます。
          </p>

          {/* ランドマーク */}
          <h3 className="mt-6 font-serif text-sm font-bold text-ink-900">
            AIが見ている4つのポイント
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-500">
            この4か所がはっきり写っていると、精度が上がります。
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
            <LandmarkDiagram />
            <ul className="flex-1 space-y-2.5">
              {LANDMARKS.map((l, i) => (
                <li key={l.name} className="rounded-xl bg-cream-100 p-3">
                  <p className="text-sm font-bold text-ink-800">
                    <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] text-brand-600 ring-1 ring-brand-200">
                      {i + 1}
                    </span>
                    {l.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{l.todo}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-400">{l.why}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* よくある失敗 */}
          <h3 className="mt-6 font-serif text-sm font-bold text-ink-900">
            よくある失敗
          </h3>
          <ul className="mt-2 space-y-1.5">
            {MISTAKES.map((m) => (
              <li key={m} className="flex gap-2 text-sm leading-relaxed text-ink-600">
                <span className="shrink-0 font-bold text-brand-600" aria-hidden>
                  ✕
                </span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function PoseCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-ink-100 p-3">
      <p className="text-sm font-bold text-ink-800">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((t) => (
          <li key={t} className="flex gap-1.5 text-sm leading-relaxed text-ink-600">
            <span className="shrink-0 text-accent-600" aria-hidden>
              ○
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** スマホをイスに置いて、離れて立つセッティングの図 */
function SetupDiagram() {
  return (
    <svg
      viewBox="0 0 320 130"
      className="h-auto w-full rounded-xl bg-cream-100"
      role="img"
      aria-label="イスに置いたスマートフォンから約2メートル離れて立つ配置図"
    >
      {/* 床 */}
      <line x1="10" y1="112" x2="310" y2="112" stroke="#d6d3cd" strokeWidth="2" />

      {/* イス */}
      <g stroke="#a8a29a" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <line x1="34" y1="112" x2="34" y2="88" />
        <line x1="62" y1="112" x2="62" y2="88" />
        <line x1="30" y1="88" x2="66" y2="88" />
        <line x1="64" y1="88" x2="64" y2="60" />
      </g>
      {/* スマホ */}
      <rect x="40" y="62" width="17" height="28" rx="3" fill="#2f3542" />
      <rect x="42" y="65" width="13" height="21" rx="1.5" fill="#8fb8e8" />
      <text x="48" y="126" textAnchor="middle" fontSize="9" fill="#7a756d">
        イスにスマホを置く
      </text>

      {/* 距離 */}
      <g stroke="#ea5532" strokeWidth="1.5" strokeDasharray="5 4">
        <line x1="72" y1="70" x2="232" y2="70" />
      </g>
      <text x="152" y="63" textAnchor="middle" fontSize="11" fill="#ea5532" fontWeight="bold">
        3〜4歩（約2m）
      </text>

      {/* 人 */}
      <g fill="none" stroke="#2f3542" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="252" cy="46" r="9" />
        <line x1="252" y1="55" x2="252" y2="84" />
        <line x1="252" y1="62" x2="240" y2="80" />
        <line x1="252" y1="62" x2="264" y2="80" />
        <line x1="252" y1="84" x2="245" y2="112" />
        <line x1="252" y1="84" x2="259" y2="112" />
      </g>
      <text x="252" y="126" textAnchor="middle" fontSize="9" fill="#7a756d">
        全身が入る位置
      </text>

      {/* 座面の高さ目安（左端に矢印で表示） */}
      <g stroke="#a8a29a" strokeWidth="1.2">
        <line x1="20" y1="88" x2="20" y2="112" />
        <line x1="16" y1="88" x2="24" y2="88" />
        <line x1="16" y1="112" x2="24" y2="112" />
      </g>
      <text x="86" y="104" fontSize="9" fill="#7a756d">
        座面は腰の高さ（70〜80cm）
      </text>
    </svg>
  );
}

/** 側面から見た4つのランドマークの図 */
function LandmarkDiagram() {
  const dots = [
    { cy: 26, n: 1, name: "耳" },
    { cy: 52, n: 2, name: "肩" },
    { cy: 100, n: 3, name: "股関節" },
    { cy: 172, n: 4, name: "くるぶし" },
  ];
  return (
    <svg
      viewBox="0 0 170 196"
      className="mx-auto h-52 w-auto shrink-0 rounded-xl bg-cream-100 sm:mx-0"
      role="img"
      aria-label="横から見たとき、耳・肩・股関節・くるぶしが縦一直線に並ぶ図"
    >
      {/* 体（うすいグレーの補助線） */}
      <g fill="none" stroke="#c9c5be" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="46" cy="24" r="13" />
        <path d="M46 52 C60 68, 60 84, 47 100" />
        <path d="M47 100 C36 122, 40 150, 46 172" />
        <path d="M46 172 L60 175" />
      </g>

      {/* 重心ライン（この4点が縦一直線が理想） */}
      <line
        x1="46"
        y1="10"
        x2="46"
        y2="186"
        stroke="#ea5532"
        strokeWidth="1.3"
        strokeDasharray="5 4"
      />

      {/* ランドマーク点とラベル */}
      {dots.map((d) => (
        <g key={d.n}>
          <circle cx="46" cy={d.cy} r="7" fill="#ffffff" stroke="#ea5532" strokeWidth="2.5" />
          <text
            x="46"
            y={d.cy + 3.4}
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#ea5532"
          >
            {d.n}
          </text>
          <text x="60" y={d.cy + 4} fontSize="12" fill="#4a4640">
            {d.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
