// 依存パッケージなしで PWA 用アイコン(PNG)を生成するスクリプト。
// 白背景に NAORU ブランドのコーラルのハートを描いた簡易アイコンを作ります。
// 実行: node scripts/generate-icons.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";

const BG = [255, 255, 255]; // 白
const HEART = [234, 85, 50]; // #EA5532 コーラル

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

// ハート形の内側かどうか（数式: (x^2+y^2-1)^3 - x^2 y^3 <= 0）
function inHeart(nx, ny) {
  const x = nx;
  const y = -ny; // 上下反転
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y <= 0;
}

function makePng(size) {
  // ハートを中央に配置（マスカブル対応で60%程度に収める）
  const scale = 1.5; // 座標系の広がり
  const cx = size / 2;
  const cy = size * 0.46;
  const r = size * 0.32;

  const px = (x, y) => {
    const nx = ((x - cx) / r) * scale;
    const ny = ((y - cy) / r) * scale;
    return inHeart(nx, ny) ? HEART : BG;
  };

  const raw = Buffer.alloc((size * 3 + 1) * size);
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r2, g, b] = px(x, y);
      raw[p++] = r2;
      raw[p++] = g;
      raw[p++] = b;
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync("public/icons", { recursive: true });
for (const size of [192, 512]) {
  writeFileSync(`public/icons/icon-${size}.png`, makePng(size));
  console.log(`generated public/icons/icon-${size}.png`);
}
