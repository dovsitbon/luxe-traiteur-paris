/**
 * Extrait des images fixes des reels (assets/raw/reels/*.mp4) pour choisir les photos du site :
 *   assets/raw/frames/<id>-<seconde>.jpg, une image toutes les 1,5 s.
 *
 *   npm run frames
 */
import { readdir, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const RAW = path.resolve(import.meta.dirname, "..", "assets", "raw");
const OUT = path.join(RAW, "frames");
await mkdir(OUT, { recursive: true });
for (const file of (await readdir(path.join(RAW, "reels"))).filter((f) => f.endsWith(".mp4"))) {
  const id = file.split(".")[0];
  execFileSync(ffmpeg, ["-v", "error", "-y", "-i", path.join(RAW, "reels", file), "-vf", "fps=2/3", "-q:v", "2", path.join(OUT, `${id}-%02d.jpg`)]);
}
console.log("Images extraites dans assets/raw/frames/");
