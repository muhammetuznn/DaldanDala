import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

const jobs = [
  {
    sheet: "public/assets/images/characters/monkey-characters-pack.png",
    cols: 4,
    rows: 1,
    out: "public/assets/images/generated/characters",
    max: [260, 260],
    names: ["monkey-default.png", "monkey-ninja.png", "monkey-robot.png", "monkey-pirate.png"]
  },
  {
    sheet: "public/assets/images/vines/vine-types-pack.png",
    cols: 5,
    rows: 1,
    out: "public/assets/images/generated/vines",
    max: [140, 520],
    names: ["vine-normal.png", "vine-wet.png", "vine-gold.png", "vine-dark.png", "vine-thorn.png"]
  },
  {
    sheet: "public/assets/images/obstacles/obstacles-pack.png",
    cols: 3,
    rows: 2,
    out: "public/assets/images/generated/obstacles",
    max: [210, 210],
    names: ["snake.png", "bee-swarm.png", "thorn.png", "coconut.png", "spider-web.png", "eagle-shadow.png"]
  },
  {
    sheet: "public/assets/images/bananas/banana-powerups-pack.png",
    cols: 3,
    rows: 2,
    out: "public/assets/images/generated/bananas",
    max: [150, 150],
    names: [
      "banana-normal.png",
      "banana-gold.png",
      "banana-red.png",
      "banana-blue.png",
      "banana-purple.png",
      "banana-rotten.png"
    ]
  },
  {
    sheet: "public/assets/images/powerups/powerup-icons-pack.png",
    cols: 4,
    rows: 2,
    out: "public/assets/images/generated/powerups",
    max: [150, 150],
    names: [
      "magnet.png",
      "shield.png",
      "slow-time.png",
      "sticky-hand.png",
      "banana-frenzy.png",
      "eagle-ward.png",
      "boss-shield.png",
      "super-jump.png"
    ]
  }
];

function isCheckerBackground(data, index) {
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const a = data[index + 3];
  if (a === 0) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return min >= 220 && max - min <= 26;
}

function removeConnectedCheckerboard(data, width, height) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    visited[pixel] = 1;
    if (isCheckerBackground(data, pixel * 4)) queue.push(pixel);
  };

  for (let x = 0; x < width; x += 1) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  for (let head = 0; head < queue.length; head += 1) {
    const pixel = queue[head];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    data[pixel * 4 + 3] = 0;
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }
}

function contentBounds(data, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < 0) return { left: 0, top: 0, width, height };

  const pad = 8;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const right = Math.min(width - 1, maxX + pad);
  const bottom = Math.min(height - 1, maxY + pad);
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

async function extractJob(job) {
  const sheetPath = path.join(root, job.sheet);
  const metadata = await sharp(sheetPath).metadata();
  await fs.mkdir(path.join(root, job.out), { recursive: true });

  for (let i = 0; i < job.names.length; i += 1) {
    const col = i % job.cols;
    const row = Math.floor(i / job.cols);
    const left = Math.round((col * metadata.width) / job.cols);
    const top = Math.round((row * metadata.height) / job.rows);
    const right = Math.round(((col + 1) * metadata.width) / job.cols);
    const bottom = Math.round(((row + 1) * metadata.height) / job.rows);
    const width = right - left;
    const height = bottom - top;

    const { data, info } = await sharp(sheetPath)
      .extract({ left, top, width, height })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    removeConnectedCheckerboard(data, info.width, info.height);
    const bounds = contentBounds(data, info.width, info.height);
    const outPath = path.join(root, job.out, job.names[i]);

    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .extract(bounds)
      .resize({ width: job.max[0], height: job.max[1], fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outPath);
  }
}

await fs.rm(path.join(root, "public/assets/images/generated"), { recursive: true, force: true });
for (const job of jobs) {
  await extractJob(job);
}

console.log("Generated extracted assets.");
