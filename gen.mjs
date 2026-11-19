// gen.mjs — draws entry.png (1024x1024) for make.fun news-image-20261118.
// Pure Node, standard library only. Deterministic: fixed seed, no dates.
// News of Wednesday 18 November 2026, five verified stories (see captions).

import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const W = 1024;
const H = 1024;
const buf = new Uint8Array(W * H * 3);

// ---- palette ----
const PAPER = [247, 243, 232];
const INK = [24, 30, 46];
const NAVY = [26, 42, 74];
const WHITE = [255, 255, 255];
const RED = [198, 44, 44];
const BLUE = [36, 90, 160];
const GOLD = [212, 160, 60];
const GREEN = [46, 125, 70];
const SKY = [150, 190, 220];
const SEA = [28, 95, 130];
const SAND = [190, 160, 110];

// ---- raster helpers ----
function px(x, y, c) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2];
}
function rect(x, y, w, h, c) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) px(i, j, c);
}
function circle(cx, cy, r, c) {
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++)
      if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r) px(x, y, c);
}
function line(x0, y0, x1, y1, c) {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, x = x0, y = y0;
  for (;;) {
    px(x, y, c);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}
function thickLine(x0, y0, x1, y1, t, c) {
  for (let k = -t; k <= t; k++) {
    line(x0 + k, y0, x1 + k, y1, c);
    line(x0, y0 + k, x1, y1 + k, c);
  }
}
function tri(x0, y0, x1, y1, x2, y2, c) {
  const minX = Math.min(x0, x1, x2), maxX = Math.max(x0, x1, x2);
  const minY = Math.min(y0, y1, y2), maxY = Math.max(y0, y1, y2);
  const d = (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
  for (let y = minY; y <= maxY; y++)
    for (let x = minX; x <= maxX; x++) {
      const s = (x1 - x0) * (y - y0) - (y1 - y0) * (x - x0);
      const t = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);
      const u = (x0 - x2) * (y - y2) - (y0 - y2) * (x - x2);
      if ((s >= 0 && t >= 0 && u >= 0) || (s <= 0 && t <= 0 && u <= 0)) px(x, y, c);
    }
}
// deterministic pseudo-random (fixed seed)
let seed = 123456789;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

// ---- 5x7 bitmap font ----
const FONT = {
  A: ["01110","10001","10001","11111","10001","10001","10001"],
  B: ["11110","10001","10001","11110","10001","10001","11110"],
  C: ["01110","10001","10000","10000","10000","10001","01110"],
  D: ["11110","10001","10001","10001","10001","10001","11110"],
  E: ["11111","10000","10000","11110","10000","10000","11111"],
  F: ["11111","10000","10000","11110","10000","10000","10000"],
  G: ["01110","10001","10000","10111","10001","10001","01111"],
  H: ["10001","10001","10001","11111","10001","10001","10001"],
  I: ["01110","00100","00100","00100","00100","00100","01110"],
  J: ["00111","00010","00010","00010","00010","10010","01100"],
  K: ["10001","10010","10100","11000","10100","10010","10001"],
  L: ["10000","10000","10000","10000","10000","10000","11111"],
  M: ["10001","11011","10101","10101","10001","10001","10001"],
  N: ["10001","11001","10101","10011","10001","10001","10001"],
  O: ["01110","10001","10001","10001","10001","10001","01110"],
  P: ["11110","10001","10001","11110","10000","10000","10000"],
  Q: ["01110","10001","10001","10001","10101","10010","01101"],
  R: ["11110","10001","10001","11110","10100","10010","10001"],
  S: ["01111","10000","10000","01110","00001","00001","11110"],
  T: ["11111","00100","00100","00100","00100","00100","00100"],
  U: ["10001","10001","10001","10001","10001","10001","01110"],
  V: ["10001","10001","10001","10001","10001","01010","00100"],
  W: ["10001","10001","10001","10101","10101","11011","10001"],
  X: ["10001","10001","01010","00100","01010","10001","10001"],
  Y: ["10001","10001","01010","00100","00100","00100","00100"],
  Z: ["11111","00001","00010","00100","01000","10000","11111"],
  "0": ["01110","10001","10011","10101","11001","10001","01110"],
  "1": ["00100","01100","00100","00100","00100","00100","01110"],
  "2": ["01110","10001","00001","00110","01000","10000","11111"],
  "3": ["11111","00010","00100","00010","00001","10001","01110"],
  "4": ["00010","00110","01010","10010","11111","00010","00010"],
  "5": ["11111","10000","11110","00001","00001","10001","01110"],
  "6": ["01110","10000","10000","11110","10001","10001","01110"],
  "7": ["11111","00001","00010","00100","01000","01000","01000"],
  "8": ["01110","10001","10001","01110","10001","10001","01110"],
  "9": ["01110","10001","10001","01111","00001","00001","01110"],
  " ": ["00000","00000","00000","00000","00000","00000","00000"],
  "-": ["00000","00000","00000","01110","00000","00000","00000"],
  ".": ["00000","00000","00000","00000","00000","01100","01100"],
  ",": ["00000","00000","00000","00000","01100","00100","01000"],
  ":": ["00000","01100","01100","00000","01100","01100","00000"],
  "+": ["00000","00100","00100","01110","00100","00100","00000"],
  "(": ["00010","00100","01000","01000","01000","00100","00010"],
  ")": ["01000","00100","00010","00010","00010","00100","01000"],
  "'": ["00100","00100","01000","00000","00000","00000","00000"],
  "/": ["00001","00010","00010","00100","01000","01000","10000"],
  "%": ["11001","11010","00010","00100","01000","01011","10011"],
  "=": ["00000","00000","11111","00000","11111","00000","00000"],
  "!": ["00100","00100","00100","00100","00100","00000","00100"],
  "?": ["01110","10001","00001","00110","00100","00000","00100"],
};
function textWidth(s, scale) { return s.length * 6 * scale - scale; }
function drawText(s, cx, y, scale, c) {
  const w = textWidth(s, scale);
  let x = Math.round(cx - w / 2);
  for (const ch of s) {
    const g = FONT[ch] || FONT["?"];
    for (let r = 0; r < 7; r++)
      for (let col = 0; col < 5; col++)
        if (g[r][col] === "1") rect(x + col * scale, y + r * scale, scale, scale, c);
    x += 6 * scale;
  }
}

// ---- background ----
rect(0, 0, W, H, PAPER);

// ---- masthead ----
rect(0, 0, W, 118, NAVY);
rect(0, 118, W, 4, GOLD);
drawText("18 NOVEMBER 2026", W / 2, 16, 6, WHITE);
drawText("WORLD NEWS IN ONE IMAGE", W / 2, 72, 3, GOLD);

// ---- panels ----
const PX = [12, 518];           // panel x starts
const PW = 494;                 // panel width
const PY = [130, 512];          // panel y starts (rows 1-2)
const PH = 370;                 // panel height
const BY = 894;                 // bottom wide panel y
const BH = 118;                 // bottom wide panel height

function panelFrame(x, y, w, h) {
  rect(x, y, w, h, WHITE);
  rect(x, y, w, 3, INK);
  rect(x, y, 3, h, INK);
  rect(x + w - 3, y, 3, h, INK);
  rect(x, y + h - 3, w, 3, INK);
}
function caption(x, w, yBottom, line1, line2) {
  drawText(line1, x + w / 2, yBottom - 42, 2, INK);
  drawText(line2, x + w / 2, yBottom - 22, 2, RED);
}

// Panel 1 — US strikes Iran base on Qeshm, Iran drones at US bases (top-left)
{
  const x = PX[0], y = PY[0];
  panelFrame(x, y, PW, PH);
  rect(x + 3, y + 3, PW - 6, 190, [38, 70, 110]);       // dusk sky
  rect(x + 3, y + 193, PW - 6, 105, SEA);               // strait water
  // island of Qeshm
  tri(x + 120, y + 250, x + 250, y + 210, x + 380, y + 250, SAND);
  rect(x + 120, y + 250, 260, 48, SAND);
  // missile base + rising missiles
  rect(x + 215, y + 205, 60, 18, [90, 90, 90]);
  thickLine(x + 245, y + 200, x + 210, y + 80, 2, WHITE);
  thickLine(x + 245, y + 200, x + 300, y + 60, 2, WHITE);
  circle(x + 210, y + 80, 7, GOLD);
  circle(x + 300, y + 60, 7, GOLD);
  // explosions (interceptions) in the sky
  for (const [ex, ey, r] of [[140, 90, 26], [370, 100, 30], [440, 60, 18]]) {
    circle(x + ex, y + ey, r, [255, 170, 40]);
    circle(x + ex, y + ey, Math.round(r * 0.55), [255, 220, 120]);
    circle(x + ex, y + ey, Math.round(r * 0.25), WHITE);
  }
  // drones: small crosses in the sky
  for (const [dx, dy] of [[90, 150], [420, 150], [330, 140]]) {
    thickLine(x + dx - 12, y + dy, x + dx + 12, y + dy, 1, [220, 220, 220]);
    thickLine(x + dx, y + dy - 6, x + dx, y + dy + 6, 1, [220, 220, 220]);
  }
  drawText("US STRIKES IRAN BASE ON QESHM", x + PW / 2, y + PH - 66, 2, INK);
  drawText("IRAN DRONES HIT US BASES", x + PW / 2, y + PH - 46, 2, RED);
  drawText("KUWAIT + BAHRAIN: DRONES DOWN", x + PW / 2, y + PH - 26, 2, INK);
}

// Panel 2 — Xi meets Putin in Shenzhen, APEC (top-right)
{
  const x = PX[1], y = PY[0];
  panelFrame(x, y, PW, PH);
  rect(x + 3, y + 3, PW - 6, 295, [220, 232, 242]);     // pale sky
  // Shenzhen skyline
  const towers = [[30, 150, 46, 145], [95, 110, 52, 185], [165, 170, 40, 125],
                  [225, 90, 56, 205], [300, 140, 44, 155], [360, 100, 50, 195], [425, 160, 40, 135]];
  for (const [tx, ty, tw, th] of towers) {
    rect(x + tx, y + ty, tw, th, [52, 74, 110]);
    for (let wy = ty + 12; wy < ty + th - 8; wy += 18)
      for (let wx = tx + 7; wx < tx + tw - 7; wx += 14)
        rect(x + wx, y + wy, 6, 8, GOLD);
  }
  rect(x + 3, y + 295, PW - 6, 3, [52, 74, 110]);
  // two flags on poles
  line(x + 150, y + 120, x + 150, y + 200, INK);
  rect(x + 150, y + 120, 74, 46, [222, 40, 40]);        // China flag
  for (const [sx, sy] of [[160, 130], [172, 128], [172, 140], [182, 132], [182, 142]])
    circle(x + sx - 150 + 150, y + sy, 3, GOLD);
  line(x + 330, y + 120, x + 330, y + 200, INK);
  rect(x + 330, y + 120, 74, 46, WHITE);                // Russia flag
  rect(x + 330, y + 135, 74, 16, BLUE);
  rect(x + 330, y + 151, 74, 15, RED);
  drawText("XI MEETS PUTIN IN SHENZHEN", x + PW / 2, y + PH - 66, 2, INK);
  drawText("APEC: AGAINST SANCTIONS", x + PW / 2, y + PH - 46, 2, RED);
  drawText("TRUMP JOINS THURSDAY", x + PW / 2, y + PH - 26, 2, INK);
}

// Panel 3 — Peltola wins Alaska Senate, Democrats 56-44 (bottom-left)
{
  const x = PX[0], y = PY[1];
  panelFrame(x, y, PW, PH);
  rect(x + 3, y + 3, PW - 6, 295, [232, 238, 244]);     // light grey-blue
  // Capitol dome
  circle(x + 247, y + 210, 62, WHITE);
  rect(x + 185, y + 210, 124, 85, WHITE);
  rect(x + 240, y + 140, 14, 22, WHITE);
  circle(x + 247, y + 138, 8, WHITE);
  for (let cx = 200; cx <= 290; cx += 18) rect(x + cx, y + 232, 8, 60, [180, 188, 198]);
  rect(x + 185, y + 292, 124, 3, [180, 188, 198]);
  // ballot box with a ballot
  rect(x + 60, y + 215, 90, 80, BLUE);
  rect(x + 78, y + 195, 54, 40, WHITE);
  rect(x + 60, y + 215, 90, 6, [20, 60, 120]);
  // big green checkmark
  thickLine(x + 390, y + 240, x + 415, y + 268, 4, GREEN);
  thickLine(x + 415, y + 268, x + 460, y + 205, 4, GREEN);
  // stars
  for (const [sx, sy] of [[80, 60], [420, 70], [360, 45], [140, 45]]) {
    circle(x + sx, y + sy, 4, GOLD);
  }
  drawText("PELTOLA WINS ALASKA SENATE", x + PW / 2, y + PH - 66, 2, INK);
  drawText("DEMOCRATS TAKE SENATE 56-44", x + PW / 2, y + PH - 46, 2, RED);
  drawText("REP. SULLIVAN LOSES", x + PW / 2, y + PH - 26, 2, INK);
}

// Panel 4 — Ebola in Congo passes 11,000 cases (bottom-right)
{
  const x = PX[1], y = PY[1];
  panelFrame(x, y, PW, PH);
  rect(x + 3, y + 3, PW - 6, 295, [238, 232, 220]);     // sand background
  // simplified Africa outline
  const africa = [
    [150, 30], [300, 25], [380, 60], [400, 130], [360, 210], [300, 260],
    [260, 250], [230, 200], [180, 190], [140, 150], [120, 90],
  ];
  // fill polygon by scanline
  for (let yy = 30; yy <= 260; yy++) {
    const xs = [];
    for (let i = 0; i < africa.length; i++) {
      const [ax, ay] = africa[i];
      const [bx, by] = africa[(i + 1) % africa.length];
      if ((ay <= yy && by > yy) || (by <= yy && ay > yy)) {
        xs.push(ax + ((yy - ay) / (by - ay)) * (bx - ax));
      }
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2)
      rect(x + Math.round(xs[k]), y + yy, Math.round(xs[k + 1] - xs[k]), 1, [90, 140, 90]);
  }
  // Congo highlighted (centre of the map)
  circle(x + 255, y + 165, 34, RED);
  circle(x + 255, y + 165, 26, [255, 120, 120]);
  // red cross
  rect(x + 247, y + 145, 16, 40, WHITE);
  rect(x + 237, y + 155, 36, 16, WHITE);
  // case dots around the map
  for (let i = 0; i < 26; i++) {
    const dx = 130 + Math.round(rnd() * 260);
    const dy = 40 + Math.round(rnd() * 220);
    circle(x + dx, y + dy, 3, RED);
  }
  drawText("EBOLA IN CONGO: 11,000+ CASES", x + PW / 2, y + PH - 66, 2, INK);
  drawText("SECOND-WORST OUTBREAK EVER", x + PW / 2, y + PH - 46, 2, RED);
  drawText("CHILDREN UNDER 5 HIT HARDEST", x + PW / 2, y + PH - 26, 2, INK);
}

// Panel 5 — Voyager 1 reaches one light-day (wide bottom strip)
{
  const x = 12, y = BY;
  panelFrame(x, y, 1000, BH);
  rect(x + 3, y + 3, 994, BH - 6, [8, 12, 28]);         // space
  // stars
  for (let i = 0; i < 90; i++) {
    const sx = 6 + Math.round(rnd() * 988);
    const sy = 6 + Math.round(rnd() * (BH - 12));
    circle(x + sx, y + sy, rnd() > 0.85 ? 2 : 1, WHITE);
  }
  // Voyager probe (left side): dish + body + boom
  const px0 = x + 60, py0 = y + BH / 2;
  circle(px0, py0, 26, [220, 220, 220]);
  circle(px0, py0, 18, [180, 180, 180]);
  circle(px0, py0, 8, GOLD);
  rect(px0 + 20, py0 - 6, 46, 12, [200, 200, 200]);
  line(px0 + 66, py0 - 6, px0 + 110, py0 - 26, GOLD);
  line(px0 + 66, py0 + 6, px0 + 110, py0 + 26, GOLD);
  circle(px0 + 110, py0 - 26, 4, GOLD);
  circle(px0 + 110, py0 + 26, 4, GOLD);
  // Earth (small, far left)
  circle(x + 18, y + BH - 22, 10, BLUE);
  circle(x + 15, y + BH - 25, 4, GREEN);
  drawText("VOYAGER 1: ONE LIGHT-DAY FROM EARTH", 560, y + 26, 2, WHITE);
  drawText("16 BILLION MILES - A FIRST FOR HUMANKIND", 560, y + 52, 2, GOLD);
  drawText("NASA, 05:16 ET", 560, y + 78, 2, [170, 190, 220]);
}

// ---- PNG encode (filter 0, zlib deflate) ----
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(b) {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = crcTable[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 8 + data.length);
  return out;
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 3)] = 0;
  raw.set(buf.subarray(y * W * 3, (y + 1) * W * 3), y * (1 + W * 3) + 1);
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);
writeFileSync(new URL("./entry.png", import.meta.url).pathname, png);

// ---- self-check: size, dimensions, colour count, panel samples ----
const colors = new Set();
for (let i = 0; i < buf.length; i += 3) colors.add((buf[i] << 16) | (buf[i + 1] << 8) | buf[i + 2]);
function sample(cx, cy, label) {
  const i = (cy * W + cx) * 3;
  console.log(`sample ${label}: rgb(${buf[i]},${buf[i + 1]},${buf[i + 2]})`);
}
function panelColours(x0, y0, x1, y1, label) {
  const set = new Set();
  for (let y = y0; y < y1; y += 2)
    for (let x = x0; x < x1; x += 2) {
      const i = (y * W + x) * 3;
      set.add((buf[i] << 16) | (buf[i + 1] << 8) | buf[i + 2]);
    }
  console.log(`panel ${label}: distinct colours (sampled) = ${set.size}`);
}
console.log(`entry.png: ${png.length} bytes, ${W}x${H}, colours=${colors.size}`);
panelColours(12, 130, 506, 500, "1 US-Iran");
panelColours(518, 130, 1012, 500, "2 Xi-Putin");
panelColours(12, 512, 506, 882, "3 Peltola");
panelColours(518, 512, 1012, 882, "4 Ebola");
panelColours(12, 894, 1012, 1012, "5 Voyager");
sample(200, 250, "panel1 sky/sea");
sample(750, 250, "panel2 skyline");
sample(200, 650, "panel3 capitol");
sample(750, 650, "panel4 africa");
sample(70, 950, "panel5 space/probe");
console.log("gen.mjs done");
