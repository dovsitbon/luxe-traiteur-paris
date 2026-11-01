# Luxe Traiteur Paris

Site vitrine bilingue (FR/EN) du traiteur haut de gamme **Luxe Traiteur Paris** : mariages, baptêmes, cocktails, repas d'affaires, décoration, service et location de salle.

## Choix technique

Site statique **Vite + GSAP + Lenis**, pages HTML pré-générées pour chaque langue (`/fr/…`, `/en/…`) par `scripts/generate.mjs`. Pas de framework côté client : un site vitrine sans back-office n'en a pas besoin, et des pages déjà rendues donnent le meilleur score Lighthouse et un référencement propre (hreflang, données structurées, sitemap).

## Commandes

```bash
npm install
npm run dev        # http://localhost:5191
npm run build      # dist/
npm run contenu    # régénère CONTENU.md (textes FR/EN + infos à demander)
```

Médias (à relancer après ajout de visuels) :

```bash
npm run frames             # images extraites des reels (assets/raw/reels -> assets/raw/frames)
node scripts/stills.mjs    # photos choisies, recadrées et étalonnées -> assets/<catégorie>/
node scripts/clips.mjs     # extraits vidéo -> assets/videos/
npm run media              # versions web (AVIF/WebP, MP4/WebM), logo détouré, favicon, image de partage
```

`assets/raw/` (reels Instagram bruts) n'est pas versionné.

## Où modifier

- Textes : `locales/fr.json`, `locales/en.json`
- Galerie, prestations, pages : `scripts/generate.mjs`
- Styles : `src/styles/main.css` · Comportements : `src/main.js`

## Variables d'environnement (Vercel)

- `SITE_URL` : adresse publique (par défaut `https://luxe-traiteur-paris.vercel.app`)
- `FORM_ENDPOINT` : URL Formspree (ou équivalent) pour l'envoi du devis par e-mail ; vide = WhatsApp seulement
