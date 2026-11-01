/**
 * Extraits vidéo tirés des reels : coupe, recadrage (retire les incrustations), mêmes tons que les photos, sans son.
 * Écrit assets/videos/<nom>.mp4 (qualité haute), encodé ensuite pour le web par npm run media.
 *
 *   node scripts/clips.mjs
 */
import { mkdir, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const ROOT = path.resolve(import.meta.dirname, "..");
const REELS = path.join(ROOT, "assets", "raw", "reels");
const files = await readdir(REELS);
const reel = (id) => path.join(REELS, files.find((f) => f.startsWith(id) && f.endsWith(".mp4")));

// [nom, reel, début (s) ou liste de [début, durée] (plans enchaînés), durée (s), filtre de recadrage ffmpeg]
const CLIPS = [
  ["hero-buffet", "DVjetb0jCgP", 3, 9, "crop=iw:ih*0.69:0:ih*0.11"],
  ["hero-table", "DVjetb0jCgP", 0, 3.4, "crop=iw:ih*0.69:0:ih*0.11"],
  ["hero-brigade", "De41dd3MmBp", 0, 5.7, "crop=iw:ih:0:0"],
  ["salle-mariage", "Dd2bvW0MyXe", 0, 4, "crop=iw:ih:0:0"],
  ["coulisses-chef", "De-6yoDs9Er", [[42, 2.4], [46, 2]], 0, "crop=iw:ih:0:0"],
];
const GRADE = "scale=trunc(iw/2)*2:trunc(ih/2)*2,colorchannelmixer=rr=1.03:rg=0.02:bb=0.92:bg=0.02,eq=saturation=0.9";

await mkdir(path.join(ROOT, "assets", "videos"), { recursive: true });
for (const [name, id, ss, t, crop] of CLIPS) {
  const out = path.join(ROOT, "assets", "videos", `${name}.mp4`);
  const enc = ["-an", "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", out];
  if (Array.isArray(ss)) {
    // plusieurs plans sans les transitions à effets du reel
    const parts = ss.map(([a, d], i) => `[0:v]trim=${a}:${a + d},setpts=PTS-STARTPTS[p${i}]`).join(";");
    const cat = `${ss.map((_, i) => `[p${i}]`).join("")}concat=n=${ss.length}:v=1:a=0,${crop},${GRADE}[v]`;
    execFileSync(ffmpeg, ["-v", "error", "-y", "-i", reel(id), "-filter_complex", `${parts};${cat}`, "-map", "[v]", ...enc]);
  } else {
    execFileSync(ffmpeg, ["-v", "error", "-y", "-ss", String(ss), "-t", String(t), "-i", reel(id), "-vf", `${crop},${GRADE}`, ...enc]);
  }
  console.log(name);
}
