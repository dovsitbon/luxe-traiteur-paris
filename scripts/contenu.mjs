/**
 * Écrit CONTENU.md : tous les textes du site en français et en anglais, côte à côte, pour validation par le client,
 * précédés de la liste des informations à lui demander.
 *
 *   npm run contenu
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = async (l) => JSON.parse(await readFile(path.join(ROOT, "locales", `${l}.json`), "utf8"));
const fr = await read("fr");
const en = await read("en");

const SECTIONS = {
  meta: "Référencement (titre et description Google)",
  nav: "Menu",
  intro: "Écran d'ouverture",
  hero: "Haut de page",
  receptions: "Nos réceptions",
  house: "Bandeau crème (mariage, salle, décoration et service)",
  weddings: "Mariages",
  table: "La table",
  venue: "Location de salles",
  work: "Réalisations",
  craft: "La maison",
  reassure: "Garanties (au-dessus du pied de page)",
  steps: "Comment se passe une demande (page Devis)",
  reviews: "Avis clients",
  quote: "Demande de devis",
  contact: "Contact",
  footer: "Pied de page",
  fab: "Bouton WhatsApp",
  video: "Vidéos",
  legalPage: "Mentions légales",
  media: "Descriptions des photos (texte alternatif)",
};

const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
function rows(a, b, key = "") {
  if (a !== null && typeof a === "object") {
    return Object.keys(a).flatMap((k) => rows(a[k], b?.[k], key ? `${key}.${k}` : k));
  }
  return [`| ${cell(key)} | ${cell(a)} | ${cell(b)} |`];
}

const out = [`# LUXE TRAITEUR PARIS · Contenu du site (FR / EN)

Document de validation pour le client. Chaque ligne correspond à un texte du site ; la colonne de gauche indique où il apparaît.
Pour modifier un texte : \`locales/fr.json\` et \`locales/en.json\`, puis \`npm run build\` (ce fichier se régénère avec \`npm run contenu\`).

## Informations à demander au client

1. **Salle de réception** (story « Lieu & Location ») : nom, adresse, capacité assise et cocktail, équipements (piste, sono, parking, accès PMR, horaires de fin), photos HD. Emplacements marqués \`À REMPLIR\` sur l'accueil et la page Location de salles ; une photo de réception sert de visuel provisoire.
2. **Menus et formules** : exemples de menus, de pièces cocktail et de desserts (même sans prix publics), pour enrichir la page Mariages et la section « La table ».
3. **Mention halal** : le hashtag #traiteurparishalal apparaît sur Instagram. Rien n'est écrit sur le site tant que le client n'a pas confirmé la formulation (halal, certification, sans alcool…).
4. **Zones et frais de déplacement** : « partout en France » est annoncé ; préciser les conditions hors Île-de-France.
5. **Vrais avis clients** (story « Avis Clients ») : texte, prénom, type d'événement, date. Un emplacement \`À REMPLIR avec de vrais avis clients\` attend sur l'accueil. Aucun avis n'a été inventé.
6. **Mentions légales** : raison sociale, forme juridique, SIRET, adresse du siège, directeur de la publication.
7. **Médias en haute qualité** : seules les 12 publications visibles sans connexion sur Instagram ont pu être récupérées (logo + 11 reels + 1 photo). Les photos du site sont extraites des reels (qualité téléphone, montages avec effets). Demander les photos et vidéos originales, notamment : réceptions d'entreprise, baptêmes, anniversaires (filtres masqués tant qu'ils sont vides), stories à la une « Nos Événements » et « Décorations ».
8. **E-mail de contact** : pour activer l'envoi du devis par e-mail (Formspree ou équivalent), créer le formulaire puis définir \`FORM_ENDPOINT\` dans Vercel. Sans cela, seul l'envoi WhatsApp est proposé.
9. **Nom de domaine** : le site est prévu pour \`luxe-traiteur-paris.vercel.app\` ; définir \`SITE_URL\` si un domaine est acheté.

## Textes
`];

for (const [key, title] of Object.entries(SECTIONS)) {
  if (!(key in fr)) continue;
  out.push(`\n### ${title}\n\n| Emplacement | Français | English |\n|---|---|---|`);
  out.push(...rows(fr[key], en[key], key));
}
await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n") + "\n");
console.log("CONTENU.md écrit.");
