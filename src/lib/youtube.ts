// YouTube の動画IDを取り出します。
// 各セルフケアJSONの "youtubeId" には、次のどれを書いてもOKです。
//   dQw4w9WgXcQ                                  （動画IDそのもの）
//   https://www.youtube.com/watch?v=dQw4w9WgXcQ  （PCのアドレスバーのURL）
//   https://youtu.be/dQw4w9WgXcQ                 （共有ボタンで出るURL）
//   https://www.youtube.com/shorts/dQw4w9WgXcQ   （ショート動画）
//   https://www.youtube.com/live/dQw4w9WgXcQ     （ライブ配信）
// 余分な ?t=30 や &feature=share が付いていても問題ありません。
// 空欄・未設定・形式が不正なときは null を返し、動画は表示されません。

const ID_ONLY = /^[A-Za-z0-9_-]{11}$/;
const FROM_URL =
  /(?:youtu\.be\/|\/shorts\/|\/embed\/|\/live\/|[?&]v=)([A-Za-z0-9_-]{11})/;

export function parseYoutubeId(input?: string): string | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;
  if (ID_ONLY.test(raw)) return raw;
  return raw.match(FROM_URL)?.[1] ?? null;
}
