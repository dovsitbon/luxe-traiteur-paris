/**
 * Photos du site tirées des reels : une image à l'instant choisi, bords noirs retirés,
 * recadrage éventuel (fractions de l'image), légère correction (tons chauds, mauve atténué).
 * Écrit assets/<catégorie>/<nom>.jpg. Liste à ajuster ici quand le client envoie ses photos HD.
 *
 *   node scripts/stills.mjs
 */
import { mkdir, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";

const ROOT = path.resolve(import.meta.dirname, "..");
const REELS = path.join(ROOT, "assets", "raw", "reels");
const files = await readdir(REELS);
const reel = (id) => path.join(REELS, files.find((f) => f.startsWith(id) && f.endsWith(".mp4")));

// [reel, seconde, catégorie/nom, recadrage {l,t,w,h} en fractions après retrait des bords noirs]
const STILLS = [
  ["Dd2bvW0MyXe", 0.4, "mariages/salle-tables-rondes"],
  ["DVjetb0jCgP", 0.8, "mariages/table-honneur-fleurs", { l: 0, t: 0.02, w: 1, h: 0.8 }],
  ["DVjetb0jCgP", 13.5, "mariages/vin-honneur-palmiers", { l: 0, t: 0, w: 1, h: 0.82 }],
  ["DVjetb0jCgP", 6.8, "buffets-et-plats/buffet-lustres", { l: 0, t: 0, w: 1, h: 0.82 }],
  ["Dd64t_wsoxK", 30.8, "mariages/soiree-salle-comble", { l: 0.07, t: 0.04, w: 0.88, h: 0.76 }],
  ["Dd64t_wsoxK", 33.8, "mariages/salle-centre-de-table", { l: 0.12, t: 0.05, w: 0.74, h: 0.6 }],
  ["Dd64t_wsoxK", 11.3, "decoration/coin-maries", { l: 0.08, t: 0.15, w: 0.86, h: 0.72 }],
  ["Dd64t_wsoxK", 12.8, "decoration/assiette-serviette-noire", { l: 0.015, t: 0.015, w: 0.97, h: 0.96 }],
  ["Dd64t_wsoxK", 17.3, "cocktails/bar-a-jus", { l: 0.12, t: 0.06, w: 0.74, h: 0.8 }],
  ["Dd64t_wsoxK", 20.3, "buffets-et-plats/buffet-desserts-bougies", { l: 0, t: 0, w: 0.84, h: 1 }],
  ["Dd64t_wsoxK", 21.8, "buffets-et-plats/buffet-invites", { l: 0.09, t: 0.17, w: 0.87, h: 0.43 }],
  ["Dd64t_wsoxK", 27.8, "service-et-coulisses/maitre-hotel-plateaux", { l: 0.07, t: 0.06, w: 0.71, h: 0.86 }],
  ["DekDymwsJph", 8.3, "buffets-et-plats/grand-buffet-salle"],
  ["DfC4Aj7ssch", 6.8, "cocktails/canapes"],
  ["DfC4Aj7ssch", 12.8, "cocktails/buffet-colore"],
  ["DfC4Aj7ssch", 17.3, "cocktails/macarons"],
  ["DfC4Aj7ssch", 20.3, "cocktails/mini-burgers"],
  ["DfC4Aj7ssch", 24.8, "cocktails/plateau-sushis"],
  ["DfC4Aj7ssch", 26.3, "cocktails/sushis-presentation", { l: 0, t: 0.1, w: 0.72, h: 0.9 }],
  ["De-6yoDs9Er", 50.3, "buffets-et-plats/desserts-roses"],
  ["De-6yoDs9Er", 42.8, "service-et-coulisses/chef-dressage"],
  ["De41dd3MmBp", 0.8, "service-et-coulisses/brigade-verrines"],
  ["De41dd3MmBp", 4.3, "cocktails/verrines-jus"],
  ["DPR0AnDjDUg", 6.8, "service-et-coulisses/organisation-equipe", { l: 0, t: 0.32, w: 1, h: 0.68 }],
];

const darkCrop = async (buf) => {
  // retire les bandes noires (montages « photo dans la vidéo »)
  const t = await sharp(buf).trim({ background: "#000000", threshold: 28 }).toBuffer({ resolveWithObject: true }).catch(() => null);
  return t ? t.data : buf;
};

{
  for (const [id, t, key, crop] of STILLS) {
    const tmp = path.join(tmpdir(), `lt-${id}-${t}.png`);
    execFileSync(ffmpeg, ["-v", "error", "-y", "-ss", String(t), "-i", reel(id), "-frames:v", "1", tmp]);
    let img = await darkCrop(await sharp(tmp).toBuffer());
    const m = await sharp(img).metadata();
    if (crop) img = await sharp(img).extract({ left: Math.round(crop.l * m.width), top: Math.round(crop.t * m.height), width: Math.round(crop.w * m.width), height: Math.round(crop.h * m.height) }).toBuffer().then(darkCrop);
    // tons : un peu plus chaud, un peu moins saturé (les salles sont éclairées en mauve)
    const out = path.join(ROOT, "assets", `${key}.jpg`);
    await mkdir(path.dirname(out), { recursive: true });
    await sharp(img).recomb([[1.03, 0.02, 0], [0, 1, 0], [0, 0.02, 0.92]]).modulate({ saturation: 0.9 }).jpeg({ quality: 92 }).toFile(out);
    const o = await sharp(out).metadata();
    console.log(key, `${o.width}x${o.height}`);
  }
}
