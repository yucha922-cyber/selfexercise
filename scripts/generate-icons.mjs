// 依存パッケージなしで PWA 用アイコン(PNG)を生成するスクリプト。
// ネイビー背景に白い "S" を中央に描いた簡易アイコンを作ります。
// 実行: node scripts/generate-icons.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";

const NAVY = [36, 58, 99]; // #243a63
const WHITE = [255, 255, 255];

// 5x7 ドットフォントの "S"
const GLYPH_S = [
  "01110",
  "10001",
  "10000",
  "01110",
  "00001",
  "10001",
  "01110",
];

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
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(size) {
  const px = (x, y) => {
    // グリフ領域 (中央60%) を計算
    const gw = 5, gh = 7;
    const scale = Math.floor((size * 0.6) / gw);
    const drawW = gw * scale;
    const drawH = gh * scale;
    const ox = Math.floor((size - drawW) / 2);
    const oy = Math.floor((size - drawH) / 2);
    if (x >= ox && x < ox + drawW && y >= oy && y < oy + drawH) {
      const gx = Math.floor((x - ox) / scale);
      const gy = Math.floor((y - oy) / scale);
      if (GLYPH_S[gy][gx] === "1") return WHITE;
    }
    return NAVY;
  };

  const raw = Buffer.alloc((size * 3 + 1) * size);
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = px(x, y);
      raw[p++] = r;
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
