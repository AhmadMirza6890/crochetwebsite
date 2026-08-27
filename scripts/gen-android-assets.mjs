import sharp from "sharp";
import fs from "fs";
import path from "path";

const RES = "android/app/src/main/res";
const BRAND_BG = "#FCE7F3"; // Hearthside Yarn brand baby-pink background

const FLOWER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <ellipse cx="13.5" cy="47" rx="8" ry="3.8" transform="rotate(-36 13.5 47)" fill="#4C7A4C" opacity="0.9"/>
  <ellipse cx="50.5" cy="47" rx="8" ry="3.8" transform="rotate(36 50.5 47)" fill="#4C7A4C" opacity="0.9"/>
  <ellipse cx="32" cy="16.5" rx="7" ry="10" fill="#B4532A"/>
  <ellipse cx="32" cy="16.5" rx="7" ry="10" transform="rotate(60 32 32)" fill="#B4532A"/>
  <ellipse cx="32" cy="16.5" rx="7" ry="10" transform="rotate(120 32 32)" fill="#B4532A"/>
  <ellipse cx="32" cy="16.5" rx="7" ry="10" transform="rotate(30 32 32)" fill="#C97B54"/>
  <ellipse cx="32" cy="16.5" rx="7" ry="10" transform="rotate(90 32 32)" fill="#C97B54"/>
  <ellipse cx="32" cy="16.5" rx="7" ry="10" transform="rotate(150 32 32)" fill="#C97B54"/>
  <circle cx="32" cy="32" r="8" fill="#FAF6F0" stroke="#8C4A2B" stroke-width="2.5"/>
  <circle cx="32" cy="29" r="1.4" fill="#B4532A"/>
  <circle cx="29.2" cy="33.8" r="1.4" fill="#B4532A"/>
  <circle cx="34.8" cy="33.8" r="1.4" fill="#B4532A"/>
</svg>`;

const flowerBuf = Buffer.from(FLOWER);

async function flowerPng(px) {
  return sharp(flowerBuf).resize(px, px, { fit: "contain" }).png().toBuffer();
}

async function solid(size, color) {
  return sharp({
    create: { width: size, height: size, channels: 4, background: color },
  })
    .png()
    .toBuffer();
}

async function composite(background, fg, fgPx, size) {
  const offset = Math.round((size - fgPx) / 2);
  return sharp(background)
    .composite([{ input: fg, left: offset, top: offset }])
    .png()
    .toBuffer();
}

async function write(file, buf) {
  const full = path.join(RES, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, buf);
  console.log("wrote", file);
}

async function main() {
  // ---- Adaptive icon (mipmap-anydpi-v26): background + foreground ----
  const ADP = 432;
  await write(
    "mipmap-anydpi-v26/ic_launcher_background.png",
    await solid(ADP, BRAND_BG)
  );
  const fgFlower = await flowerPng(Math.round(ADP * 0.6)); // within safe zone
  await write(
    "mipmap-anydpi-v26/ic_launcher_foreground.png",
    await composite(await solid(ADP, { r: 0, g: 0, b: 0, alpha: 0 }), fgFlower, Math.round(ADP * 0.6), ADP)
  );

  // ---- Legacy launcher icons (square pink bg + flower) ----
  const densities = {
    mdpi: 48,
    hdpi: 72,
    xhdpi: 96,
    xxhdpi: 144,
    xxxhdpi: 192,
  };
  for (const [d, size] of Object.entries(densities)) {
    const base = await solid(size, BRAND_BG);
    const f = await flowerPng(Math.round(size * 0.55));
    const icon = await composite(base, f, Math.round(size * 0.55), size);
    await write(`mipmap-${d}/ic_launcher.png`, icon);
    await write(`mipmap-${d}/ic_launcher_round.png`, icon);
  }

  // ---- Splash: brand-pink square with centered flower (contained) ----
  const SP = 1080;
  const splashBase = await solid(SP, BRAND_BG);
  const splashFlower = await flowerPng(Math.round(SP * 0.3));
  const splash = await composite(splashBase, splashFlower, Math.round(SP * 0.3), SP);
  await write("drawable/splash.png", splash);
  // remove stale density-specific splash images so the base (contained) is used everywhere
  for (const d of ["port-hdpi", "port-mdpi", "port-xhdpi", "port-xxhdpi", "port-xxxhdpi",
                   "land-hdpi", "land-mdpi", "land-xhdpi", "land-xxhdpi", "land-xxxhdpi"]) {
    const p = path.join(RES, `drawable-${d}`, "splash.png");
    if (fs.existsSync(p)) { fs.unlinkSync(p); console.log("removed", `drawable-${d}/splash.png`); }
  }

  console.log("done");
}

main().catch((e) => { console.error(e); process.exit(1); });
