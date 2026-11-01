/**
 * Prépare les visuels du dossier assets/ pour le web (à relancer après tout ajout de photo ou de vidéo) :
 *   - photos -> public/media/<catégorie>/<nom>-<largeur>.avif|webp (480, 960, 1440 px max)
 *   - vidéos -> public/media/videos/<nom>.mp4 (H.264) + .webm (VP9), sans son, + affiche .webp
 *   - logo   -> or détouré (WebP/PNG transparents) : logo complet, couronne (et son contour, pour l'intro),
 *               monogramme LT, emblème, favicon, icônes, image Open Graph
 * Écrit src/data/media-sizes.json (dimensions lues par le générateur de pages).
 *
 *   npm run media
 */
import { readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";

const ROOT = path.resolve(import.meta.dirname, "..");
const ASSETS = path.join(ROOT, "assets");
const OUT = path.join(ROOT, "public", "media");
const WIDTHS = [480, 960, 1440];
const PHOTO_DIRS = ["mariages", "buffets-et-plats", "cocktails", "decoration", "salle", "service-et-coulisses"];

const sizes = {};
const fresh = async (src, out) => {
  try {
    return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;
  } catch {
    return false;
  }
};

for (const dir of PHOTO_DIRS) {
  const files = (await readdir(path.join(ASSETS, dir)).catch(() => [])).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  await mkdir(path.join(OUT, dir), { recursive: true });
  for (const file of files) {
    const name = file.replace(/\.[^.]+$/, "");
    const src = path.join(ASSETS, dir, file);
    const meta = await sharp(src).metadata();
    const widths = [...new Set(WIDTHS.map((w) => Math.min(w, meta.width)))];
    for (const w of widths) {
      const base = path.join(OUT, dir, `${name}-${w}`);
      if (await fresh(src, `${base}.webp`)) continue;
      const img = sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).sharpen({ sigma: 0.5 });
      await img.clone().avif({ quality: 54, effort: 5 }).toFile(`${base}.avif`);
      await img.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
    }
    sizes[`${dir}/${name}`] = { w: meta.width, h: meta.height, widths };
  }
}

await mkdir(path.join(OUT, "videos"), { recursive: true });
for (const file of (await readdir(path.join(ASSETS, "videos")).catch(() => [])).filter((f) => f.endsWith(".mp4"))) {
  const name = file.replace(/\.mp4$/, "");
  const src = path.join(ASSETS, "videos", file);
  const base = path.join(OUT, "videos", name);
  if (!(await fresh(src, `${base}.webm`))) {
    // vertical : 540 px de large ; paysage : 960 px
    const input = ["-v", "error", "-y", "-i", src, "-an", "-vf", "scale='if(gt(iw,ih),960,540)':-2,fps=30"];
    execFileSync(ffmpeg, [...input, "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${base}.mp4`]);
    execFileSync(ffmpeg, [...input, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", `${base}.webm`]);
    const poster = path.join(tmpdir(), `lt-${name}.jpg`);
    execFileSync(ffmpeg, ["-v", "error", "-y", "-ss", "0.1", "-i", `${base}.mp4`, "-frames:v", "1", "-q:v", "2", poster]);
    await sharp(poster).webp({ quality: 72 }).toFile(`${base}.webp`);
  }
  const m = await sharp(`${base}.webp`).metadata();
  sizes[`videos/${name}`] = { w: m.width, h: m.height };
}

/*
 * Logo : or sur noir. L'or devient opaque et le noir transparent (alpha = luminosité),
 * pour poser le logo sur n'importe quel fond sombre sans « rond » noir.
 */
const LOGO = path.join(ASSETS, "logo", "logo.jpg");
// Le cercle doré du logo est retiré (on ne garde que l'intérieur), ainsi que les zones exclues par `drop`.
async function goldOnTransparent(region, width, drop = () => false) {
  const src = await sharp(LOGO).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const S = src.info.width, c = S / 2;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (Math.hypot(x - c, y - c) > S * 0.43 || drop(x, y)) src.data.fill(0, (y * S + x) * 3, (y * S + x) * 3 + 3);
  }
  const { data, info } = await sharp(src.data, { raw: src.info }).extract(region).resize({ width }).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = Math.min(255, Math.max(0, (Math.max(r, g, b) - 58) * 1.9));
    // couleur « dé-assombrie » : on retire le noir pour que les bords ne grisent pas
    const k = a ? 255 / Math.max(r, g, b, 1) : 0;
    out[j] = Math.min(255, r * k * 0.88); out[j + 1] = Math.min(255, g * k * 0.88); out[j + 2] = Math.min(255, b * k * 0.88); out[j + 3] = a;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}
/** Contour d'une image détourée (bord de l'alpha), pour les tracés au trait fin. */
async function outline(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, A = (x, y) => data[(y * W + x) * 4 + 3] > 110;
  const out = Buffer.alloc(W * H * 4);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const me = A(x, y);
    if (me === A(x - 1, y) && me === A(x + 1, y) && me === A(x, y - 1) && me === A(x, y + 1)) continue;
    const j = (y * W + x) * 4;
    out[j] = 230; out[j + 1] = 204; out[j + 2] = 143; out[j + 3] = 255;
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } }).blur(0.35);
}

await mkdir(path.join(OUT, "logo"), { recursive: true });
const FULL = { left: 110, top: 60, width: 860, height: 620 }; // couronne -> signature manuscrite
const CROWN = { left: 425, top: 62, width: 230, height: 130 };
const MONO = { left: 280, top: 192, width: 570, height: 290 }; // LT + toque, sans la couronne
const MARK = { left: 280, top: 60, width: 570, height: 420 }; // couronne + LT (header, favicon)
await (await goldOnTransparent(FULL, 640)).webp({ quality: 90, alphaQuality: 90 }).toFile(path.join(OUT, "logo", "logo-or.webp"));
await (await goldOnTransparent(FULL, 640)).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo", "logo-or.png"));
const crown = await (await goldOnTransparent(CROWN, 460, (x, y) => y > 160 && x < 462)).png().toBuffer();
await sharp(crown).webp({ quality: 92, alphaQuality: 95 }).toFile(path.join(OUT, "logo", "couronne.webp"));
await (await outline(crown)).webp({ quality: 92, alphaQuality: 95 }).toFile(path.join(OUT, "logo", "couronne-trait.webp"));
await (await goldOnTransparent(MONO, 570)).webp({ quality: 92, alphaQuality: 95 }).toFile(path.join(OUT, "logo", "monogramme.webp"));
const mark = await (await goldOnTransparent(MARK, 570)).png().toBuffer();
await sharp(mark).resize({ width: 240 }).webp({ quality: 92, alphaQuality: 95 }).toFile(path.join(OUT, "logo", "embleme.webp"));

// Favicon et icônes : couronne + LT sur noir.
const icon = async (size, pad) => {
  const m = await sharp(mark).resize({ width: Math.round(size * (1 - pad * 2)) }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: "#0B0B0B" } }).composite([{ input: m, gravity: "center" }]);
};
await (await icon(64, 0.06)).png().toFile(path.join(ROOT, "public", "favicon.png"));
await writeFile(path.join(ROOT, "public", "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0B0B0B"/><image href="data:image/png;base64,${(await (await icon(128, 0.08)).png().toBuffer()).toString("base64")}" width="64" height="64"/></svg>`);
for (const [file, size] of [["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
  await (await icon(size, 0.12)).png().toFile(path.join(ROOT, "public", file));
}

// Image de partage 1200x630 : logo à gauche, salle dressée à droite.
const ogLogo = await (await goldOnTransparent(FULL, 520)).png().toBuffer();
const ogPhoto = await sharp(path.join(ASSETS, "mariages", "salle-centre-de-table.jpg")).resize(560, 630, { fit: "cover" }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#0B0B0B" } })
  .composite([{ input: ogLogo, left: 60, top: 128 }, { input: ogPhoto, left: 640, top: 0 }])
  .jpeg({ quality: 84 }).toFile(path.join(ROOT, "public", "og.jpg"));

await mkdir(path.join(ROOT, "src", "data"), { recursive: true });
await writeFile(path.join(ROOT, "src", "data", "media-sizes.json"), JSON.stringify(sizes, null, 1));
console.log(`${Object.keys(sizes).length} médias prêts.`);
