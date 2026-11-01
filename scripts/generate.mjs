/**
 * Génère les pages statiques du site, une par langue :
 *   /index.html (redirection vers la langue du navigateur ou celle mémorisée), /fr/…, /en/…
 *   + public/sitemap.xml, public/robots.txt, public/llms.txt
 * Textes : locales/<langue>.json — Médias : src/data/media-sizes.json (npm run media).
 *
 *   npm run gen   (lancé automatiquement par npm run dev et npm run build)
 */
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = (process.env.SITE_URL || "https://luxe-traiteur-paris.vercel.app").replace(/\/$/, "");
// Adresse d'envoi du formulaire par e-mail (Formspree ou équivalent). Vide : seul l'envoi WhatsApp est proposé.
const FORM_ENDPOINT = process.env.FORM_ENDPOINT || "";
const LANGS = ["fr", "en"];
const read = async (p) => JSON.parse(await readFile(path.join(ROOT, p), "utf8"));
const L = { fr: await read("locales/fr.json"), en: await read("locales/en.json") };
const SIZES = await read("src/data/media-sizes.json");

const PHONE = "06 26 82 55 46";
const PHONE_INTL = "+33626825546";
const WA = "https://wa.me/33626825546";
const INSTAGRAM = "https://www.instagram.com/luxetraiteurparis/";
// Polices chargées sans bloquer le rendu (le texte s'affiche d'abord dans la police de secours).
const FONTS = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Pinyon+Script&display=swap";

// Pages et leurs adresses dans chaque langue.
const PAGES = {
  home: { fr: "", en: "" },
  mariages: { fr: "mariages/", en: "weddings/" },
  location: { fr: "location-de-salles/", en: "venue-hire/" },
  realisations: { fr: "realisations/", en: "our-work/" },
  devis: { fr: "devis/", en: "quote/" },
  legal: { fr: "mentions-legales/", en: "legal-notice/" },
};
const href = (lang, page, hash = "") => `/${lang}/${PAGES[page][lang]}${hash}`;

// Réalisations : [média, catégorie]. Les vidéos s'ouvrent dans la visionneuse.
// Un filtre n'apparaît que s'il contient au moins un média (entreprises, baptêmes, anniversaires : photos à recevoir du client).
const GALLERY = [
  ["mariages/salle-tables-rondes", "mariages"],
  ["buffets-et-plats/buffet-desserts-bougies", "mariages"],
  ["cocktails/bar-a-jus", "cocktails"],
  ["videos/coulisses-chef", "cocktails"],
  ["mariages/table-honneur-fleurs", "mariages"],
  ["decoration/coin-maries", "mariages"],
  ["cocktails/buffet-colore", "cocktails"],
  ["service-et-coulisses/maitre-hotel-plateaux", "mariages"],
  ["videos/hero-buffet", "cocktails"],
  ["mariages/soiree-salle-comble", "mariages"],
  ["cocktails/canapes", "cocktails"],
  ["buffets-et-plats/grand-buffet-salle", "mariages"],
  ["cocktails/macarons", "cocktails"],
  ["mariages/vin-honneur-palmiers", "mariages"],
  ["decoration/assiette-serviette-noire", "mariages"],
  ["cocktails/mini-burgers", "cocktails"],
  ["mariages/soiree-guirlandes", "mariages"],
  ["buffets-et-plats/desserts-roses", "cocktails"],
  ["cocktails/plateau-sushis", "cocktails"],
  ["mariages/salle-centre-de-table", "mariages"],
  ["videos/salle-mariage", "mariages"],
  ["buffets-et-plats/buffet-invites", "mariages"],
  ["cocktails/sushis-presentation", "cocktails"],
  ["service-et-coulisses/brigade-verrines", "cocktails"],
];
const FILTERS = ["mariages", "cocktails", "entreprises", "baptemes", "anniversaires"];
const VIDEO_ALT = { "videos/salle-mariage": "weddings", "videos/hero-buffet": "hero", "videos/coulisses-chef": "craft" };

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
const roman = (n) => ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n];
const waLink = (text) => `${WA}?text=${encodeURIComponent(text)}`;
const alt = (lang, key) => L[lang].media[key] || "";

/** Image responsive (AVIF + WebP) à partir des tailles produites par npm run media. */
function pic(key, altText, { sizes = "100vw", cls = "", eager = false } = {}) {
  const m = SIZES[key];
  if (!m) throw new Error(`Média manquant : ${key} (lancer npm run media)`);
  const set = (ext) => m.widths.map((w) => `/media/${key}-${w}.${ext} ${w}w`).join(", ");
  const last = m.widths[m.widths.length - 1];
  return `<picture${cls ? ` class="${cls}"` : ""}><source type="image/avif" srcset="${set("avif")}" sizes="${sizes}"><img src="/media/${key}-${last}.webp" srcset="${set("webp")}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(altText)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}
const big = (key) => `/media/${key}-${SIZES[key].widths[SIZES[key].widths.length - 1]}.webp`;

/** Vidéo d'ambiance muette en boucle, lancée quand elle est visible (data-autoplay) ou au survol (data-hover). */
const video = (name, label, cls = "", mode = "autoplay") => {
  const m = SIZES[`videos/${name}`];
  return `<video class="${cls}" muted loop playsinline preload="none" poster="/media/videos/${name}.webp" width="${m.w}" height="${m.h}" data-${mode}${label ? ` aria-label="${esc(label)}"` : ' aria-hidden="true"'}><source src="/media/videos/${name}.webm" type="video/webm"><source src="/media/videos/${name}.mp4" type="video/mp4"></video>`;
};

const icon = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.6A8.3 8.3 0 0 1 7.8 19L4 20l1-3.7a8.3 8.3 0 1 1 15-4.7Z"/><path d="M9 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.6 1 1.4 1.8 2.5 2.4.2.1.4.1.5 0l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.2.3.4 0 .5-.2 1.2-.7 1.5-.5.3-1.4.6-2.6.2-1.3-.4-2.7-1.4-3.8-2.6-1-1.1-1.6-2.3-1.8-3.2-.1-.8.2-1.5.5-1.9Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 7l5 5-5 5"/></svg>',
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5Z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>',
};
// Bouton pause des vidéos en boucle (au-delà de 5 s, WCAG 2.2.2).
const pauseBtn = (lang, cls = "") => `<button type="button" class="vtoggle ${cls}" data-video-toggle aria-pressed="false" aria-label="${esc(L[lang].video.pause)}" data-pause="${esc(L[lang].video.pause)}" data-play="${esc(L[lang].video.play)}">${icon.pause}${icon.play}</button>`;
// Petite couronne d'ornement (trait fin), reprise du logo.
const crown = '<svg class="crown" viewBox="0 0 40 22" aria-hidden="true"><path d="M3 17 1.5 6l9 6L20 2l9.5 10 9-6L37 17Z"/><path d="M4 20.5h32"/><circle cx="20" cy="2" r="1.2"/><circle cx="1.5" cy="6" r="1"/><circle cx="38.5" cy="6" r="1"/></svg>';

const kicker = (n, text) => `<p class="kicker"><span class="kicker__n">${roman(n)}</span><span class="kicker__line" aria-hidden="true"></span>${esc(text)}</p>`;

/* ------------------------------------------------------------------ <head> et données structurées */

function head(lang, page) {
  const t = L[lang];
  const meta = t.meta[page];
  const url = `${SITE}${href(lang, page)}`;
  const alternates = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${href(l, page)}">`).join("\n");
  const ld = [business(lang)];
  if (page !== "home") ld.push(breadcrumb(lang, page));
  if (page === "mariages") ld.push(serviceLd(lang));
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<link rel="canonical" href="${url}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${SITE}${href("fr", page)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Luxe Traiteur Paris">
<meta property="og:locale" content="${t.locale}">
<meta property="og:locale:alternate" content="${L[lang === "fr" ? "en" : "fr"].locale}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B0B0B">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}">
<link rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<link rel="stylesheet" href="/src/styles/main.css">
<script>try{localStorage.setItem("lt-lang","${lang}")}catch(e){}${page === "home" ? `try{if(!sessionStorage.getItem("lt-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-on")}catch(e){}` : ""}</script>
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>`;
}

function business(lang) {
  const t = L[lang];
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FoodEstablishment"],
    "@id": `${SITE}/#business`,
    name: "Luxe Traiteur Paris",
    alternateName: "Luxe Traiteur",
    slogan: t.intro.tagline,
    description: t.meta.home.description,
    url: `${SITE}/${lang}/`,
    logo: `${SITE}/icon-512.png`,
    image: `${SITE}/og.jpg`,
    telephone: PHONE_INTL,
    priceRange: "€€€",
    servesCuisine: lang === "fr" ? ["Française", "Cuisine de réception"] : ["French", "Event catering"],
    // Adresse précise à compléter quand le client l'aura communiquée.
    address: { "@type": "PostalAddress", addressLocality: "Paris", addressRegion: "Île-de-France", addressCountry: "FR" },
    areaServed: [{ "@type": "City", name: "Paris" }, { "@type": "AdministrativeArea", name: "Île-de-France" }, { "@type": "Country", name: "France" }],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.services.title,
      itemListElement: t.services.items.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text, serviceType: "Catering" } })),
    },
    sameAs: [INSTAGRAM],
    knowsLanguage: ["fr", "en"],
  };
}
function serviceLd(lang) {
  const t = L[lang].weddings;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: lang === "fr" ? "Traiteur de mariage" : "Wedding catering",
    name: t.pageTitle,
    description: t.pageIntro,
    provider: { "@id": `${SITE}/#business` },
    areaServed: ["Paris", "Île-de-France", "France"],
  };
}
function breadcrumb(lang, page) {
  const t = L[lang];
  const names = { mariages: t.nav.weddings, location: t.nav.venue, realisations: t.nav.work, devis: t.nav.quote, legal: t.footer.legal };
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: `${SITE}/${lang}/` },
      { "@type": "ListItem", position: 2, name: names[page], item: `${SITE}${href(lang, page)}` },
    ],
  };
}

/* ------------------------------------------------------------------ en-tête, intro, pied de page */

function header(lang, page) {
  const t = L[lang];
  const links = [
    [href(lang, "home"), t.nav.home, page === "home"],
    [href(lang, "home", "#prestations"), t.nav.services],
    [href(lang, "mariages"), t.nav.weddings, page === "mariages"],
    [href(lang, "location"), t.nav.venue, page === "location"],
    [href(lang, "realisations"), t.nav.work, page === "realisations"],
    [href(lang, "home", "#avis"), t.nav.reviews],
    [href(lang, "home", "#contact"), t.nav.contact],
  ];
  const nav = links.map(([h, label, cur]) => `<li><a href="${h}"${cur ? ' aria-current="page"' : ""}>${esc(label)}</a></li>`).join("");
  const switcher = `<div class="lang" role="group" aria-label="${esc(t.nav.langLabel)}">${LANGS.map((l, i) => `${i ? '<span aria-hidden="true">·</span>' : ""}<a href="${href(l, page)}" hreflang="${l}" lang="${l}" data-lang="${l}"${l === lang ? ' aria-current="true"' : ""}>${l.toUpperCase()}</a>`).join("")}</div>`;
  return `<a class="skip" href="#main">${esc(t.nav.skip)}</a>
<header class="header${page === "home" ? " header--over" : ""}" data-header>
  <div class="header__inner">
    <a class="brand" href="/${lang}/" aria-label="Luxe Traiteur Paris, ${esc(t.nav.home)}">
      <img src="/media/logo/embleme.webp" width="240" height="177" alt="">
      <span class="brand__word" aria-hidden="true" translate="no">Luxe Traiteur<small>Paris</small></span>
    </a>
    <nav class="header__nav" aria-label="${esc(t.nav.main)}"><ul>${nav}</ul></nav>
    <div class="header__tools">
      ${switcher}
      <a class="btn btn--gold btn--sm header__cta" href="${href(lang, "devis")}">${esc(t.nav.quote)}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle><span class="sr" data-open="${esc(t.nav.menu)}" data-close="${esc(t.nav.close)}">${esc(t.nav.menu)}</span><i></i><i></i></button>
    </div>
  </div>
  <div class="menu" id="menu" hidden>
    <ul>${nav}</ul>
    ${switcher}
    <a class="btn btn--gold" href="${href(lang, "devis")}">${esc(t.nav.quote)}</a>
    <a class="menu__phone" href="tel:${PHONE_INTL}">${icon.phone}${PHONE}</a>
  </div>
</header>`;
}

function intro(lang) {
  const t = L[lang].intro;
  const words = t.tagline.split(" ").map((w, i) => `<span style="--i:${i}">${esc(w)}</span>`).join(" ");
  const sparks = Array.from({ length: 14 }, (_, i) => {
    const x = (i * 37 + 11) % 100, y = (i * 53 + 23) % 100;
    return `<i style="--x:${x}%;--y:${y}%;--s:${0.5 + ((i * 7) % 5) / 5};--d:${((i * 13) % 10) / 10}"></i>`;
  }).join("");
  return `<div class="intro" data-intro aria-hidden="true">
  <div class="intro__sparks">${sparks}</div>
  <div class="intro__stage">
    <div class="intro__crown">
      <img class="intro__crown-line" src="/media/logo/couronne-trait.webp" width="460" height="260" alt="">
      <img class="intro__crown-fill" src="/media/logo/couronne.webp" width="460" height="260" alt="">
    </div>
    <div class="intro__mono"><img src="/media/logo/monogramme.webp" width="570" height="290" alt=""><span class="intro__shine"></span></div>
    <p class="intro__brand">${esc(t.brand)}</p>
    <p class="intro__tagline">${words}</p>
  </div>
  <button class="intro__skip" type="button" data-intro-skip>${esc(t.skip)}</button>
</div>`;
}

function footer(lang, page) {
  const t = L[lang];
  const links = [["home", t.nav.home], ["mariages", t.nav.weddings], ["location", t.nav.venue], ["realisations", t.nav.work], ["devis", t.nav.quote], ["legal", t.footer.legal]];
  return `<footer class="footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <img src="/media/logo/logo-or.webp" width="640" height="461" alt="Luxe Traiteur" loading="lazy">
      <p class="footer__list">${esc(t.footer.list)}</p>
    </div>
    <div>
      <p class="eyebrow">${esc(t.contact.kicker)}</p>
      <ul class="footer__links">
        <li><a href="tel:${PHONE_INTL}">${icon.phone}${PHONE}</a></li>
        <li><a href="${waLink(t.contact.waMsg)}" target="_blank" rel="noopener">${icon.wa}WhatsApp</a></li>
        <li><a href="${INSTAGRAM}" target="_blank" rel="noopener">${icon.ig}@luxetraiteurparis</a></li>
      </ul>
      <p class="footer__zone"><span class="eyebrow">${esc(t.contact.zone)}</span>${esc(t.contact.zoneText)}</p>
    </div>
    <nav aria-label="${esc(t.footer.nav)}">
      <p class="eyebrow">${esc(t.footer.nav)}</p>
      <ul class="footer__links">${links.map(([p, label]) => `<li><a href="${href(lang, p)}"${p === page ? ' aria-current="page"' : ""}>${esc(label)}</a></li>`).join("")}</ul>
    </nav>
  </div>
  <div class="wrap footer__base">
    <p>© ${new Date().getFullYear()} Luxe Traiteur Paris. ${esc(t.footer.rights)}</p>
    <p>${esc(t.footer.credit)}</p>
  </div>
</footer>
<a class="fab" href="${waLink(t.contact.waMsg)}" target="_blank" rel="noopener" aria-label="${esc(t.fab)}">${icon.wa}</a>`;
}

/* ------------------------------------------------------------------ sections */

function hero(lang) {
  const t = L[lang].hero;
  return `<section class="hero" aria-labelledby="hero-title" data-videos>
  <div class="hero__media">
    ${video("hero-buffet", "", "hero__video hero__video--a")}
    ${video("hero-brigade", "", "hero__video hero__video--b")}
    ${video("hero-table", "", "hero__video hero__video--c")}
  </div>
  <div class="hero__shade"></div>
  <div class="hero__content">
    <h1 id="hero-title" class="hero__h1"><span class="hero__eyebrow">${crown}<span>${esc(t.eyebrow)}</span></span><span class="hero__title">${esc(t.title)}</span></h1>
    <p class="hero__sub">${esc(t.sub)}</p>
    <div class="hero__ctas">
      <a class="btn btn--gold" href="${href(lang, "devis")}">${esc(t.ctaQuote)}</a>
      <a class="btn btn--ghost" href="#prestations">${esc(t.ctaServices)}</a>
    </div>
  </div>
  ${pauseBtn(lang, "vtoggle--hero")}
  <a class="hero__scroll" href="#prestations"><span>${esc(t.scroll)}</span><i aria-hidden="true"></i></a>
</section>`;
}

function trust(lang) {
  const items = L[lang].trust.map((s) => `<li>${esc(s)}</li>`).join("");
  // Liste doublée pour le défilement continu ; la copie est ignorée des lecteurs d'écran.
  return `<div class="trust"><ul>${items}</ul><ul aria-hidden="true">${items}</ul></div>`;
}

const SERVICE_IMG = {
  mariages: "mariages/salle-tables-rondes",
  cocktails: "cocktails/buffet-colore",
  affaires: "cocktails/canapes",
  familles: "buffets-et-plats/desserts-roses",
  decoration: "decoration/assiette-serviette-noire",
  service: "service-et-coulisses/maitre-hotel-plateaux",
};
const SERVICE_TYPE = { mariages: 0, cocktails: 2, affaires: 3, familles: 1, decoration: 0, service: 0 };

function services(lang, n) {
  const t = L[lang].services;
  return `<section class="section section--dark services" id="prestations" aria-labelledby="services-title">
  <div class="wrap">
    <div class="section__head section__head--split reveal">
      <div>${kicker(n, t.kicker)}<h2 id="services-title" class="h2">${esc(t.title)}</h2></div>
      <p class="lead">${esc(t.intro)}</p>
    </div>
    <div class="services__grid">
      ${t.items.map((s, i) => {
        const target = s.id === "mariages" ? href(lang, "mariages") : `${href(lang, "devis")}?type=${SERVICE_TYPE[s.id]}`;
        return `<a class="service reveal" href="${target}" style="--d:${i % 3}">
        <div class="service__media">${pic(SERVICE_IMG[s.id], alt(lang, SERVICE_IMG[s.id]), { sizes: "(min-width: 1000px) 31vw, (min-width: 640px) 48vw, 92vw" })}</div>
        <div class="service__body">
          <span class="service__n">${String(i + 1).padStart(2, "0")}</span>
          <h3 class="service__title">${esc(s.title)}</h3>
          <p class="service__text">${esc(s.text)}</p>
          <span class="link">${esc(t.more)}${icon.arrow}</span>
        </div>
      </a>`;
      }).join("")}
    </div>
  </div>
</section>`;
}

function weddingSteps(lang) {
  const t = L[lang].weddings;
  return `<ol class="timeline">
      ${t.steps.map((s, i) => `<li class="reveal" style="--d:${i}"><span class="timeline__n">${roman(i + 1)}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join("")}
    </ol>`;
}

function weddings(lang, n) {
  const t = L[lang].weddings;
  return `<section class="section section--ivory weddings" aria-labelledby="weddings-title">
  <div class="wrap weddings__grid">
    <div class="weddings__text">
      <div class="reveal">${kicker(n, t.kicker)}<h2 id="weddings-title" class="h2">${esc(t.title)}</h2><p class="lead">${esc(t.intro)}</p></div>
      ${weddingSteps(lang)}
      <p class="reveal"><a class="btn btn--dark" href="${href(lang, "mariages")}">${esc(t.teaser)}</a></p>
    </div>
    <div class="weddings__media">
      <figure class="weddings__main reveal" data-parallax>${pic("mariages/table-honneur-fleurs", alt(lang, "mariages/table-honneur-fleurs"), { sizes: "(min-width: 900px) 40vw, 92vw" })}</figure>
      <figure class="weddings__float reveal" style="--d:2">${video("salle-mariage", t.videoLabel, "", "autoplay")}<figcaption>${esc(alt(lang, "mariages/salle-tables-rondes").split(",")[0])}</figcaption></figure>
    </div>
  </div>
</section>`;
}

const TABLE = [
  ["buffets-et-plats/buffet-desserts-bougies", "tall"],
  ["cocktails/canapes", "wide"],
  ["cocktails/macarons", ""],
  ["buffets-et-plats/grand-buffet-salle", "tall"],
  ["cocktails/mini-burgers", ""],
  ["cocktails/bar-a-jus", "wide"],
  ["cocktails/plateau-sushis", ""],
  ["cocktails/verrines-jus", ""],
];

function table(lang, n) {
  const t = L[lang].table;
  return `<section class="section section--dark table-sec" aria-labelledby="table-title">
  <div class="wrap">
    <div class="section__head section__head--center reveal">
      ${kicker(n, t.kicker)}
      <h2 id="table-title" class="h2">${esc(t.title)}</h2>
      <p class="lead">${esc(t.intro)}</p>
    </div>
    <ul class="mosaic">
      ${TABLE.map(([key, size], i) => `<li class="mosaic__item ${size ? `mosaic__item--${size}` : ""} reveal" style="--d:${i % 4}">
        <figure>${pic(key, "", { sizes: "(min-width: 1000px) 25vw, 50vw" })}<figcaption>${esc(alt(lang, key))}</figcaption></figure>
      </li>`).join("")}
    </ul>
    <p class="center reveal"><a class="btn btn--gold" href="${href(lang, "devis")}">${esc(t.cta)}</a></p>
  </div>
</section>`;
}

function venueFacts(lang) {
  const t = L[lang].venue;
  return `<dl class="facts">
      ${t.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}
    </dl>`;
}

function venue(lang, n) {
  const t = L[lang].venue;
  return `<section class="section section--ivory venue" aria-labelledby="venue-title">
  <div class="wrap venue__grid">
    <div class="venue__media reveal">
      <!-- À REMPLIR : photos de la salle (nom, adresse, capacité) à recevoir du client. Photo provisoire ci-dessous. -->
      ${pic("mariages/salle-centre-de-table", alt(lang, "mariages/salle-centre-de-table"), { sizes: "(min-width: 900px) 50vw, 92vw" })}
      <p class="venue__note">${esc(t.note)}</p>
    </div>
    <div class="venue__text reveal" style="--d:1">
      ${kicker(n, t.kicker)}
      <h2 id="venue-title" class="h2">${esc(t.title)}</h2>
      <p class="lead">${esc(t.intro)}</p>
      ${venueFacts(lang)}
      <div class="row">
        <a class="btn btn--dark" href="${waLink(t.ctaMsg)}" target="_blank" rel="noopener">${esc(t.cta)}</a>
        <a class="link link--dark" href="${href(lang, "location")}">${esc(t.more)}${icon.arrow}</a>
      </div>
    </div>
  </div>
</section>`;
}

function galleryItem(lang, [key, cat], i) {
  const t = L[lang].work;
  if (key.startsWith("videos/")) {
    const name = key.slice(7);
    const label = { weddings: L[lang].weddings.videoLabel, craft: L[lang].craft.videoLabel, hero: alt(lang, "buffets-et-plats/buffet-lustres") }[VIDEO_ALT[key]];
    const m = SIZES[key];
    return `<li class="masonry__item reveal" data-cat="${cat}" style="--d:${i % 3}">
      <button type="button" class="masonry__btn" data-lightbox data-video="${name}" data-caption="${esc(label)}" aria-label="${esc(t.video)} : ${esc(label)}">
        <video muted loop playsinline preload="none" poster="/media/videos/${name}.webp" width="${m.w}" height="${m.h}" data-hover aria-hidden="true"><source src="/media/videos/${name}.webm" type="video/webm"><source src="/media/videos/${name}.mp4" type="video/mp4"></video>
        <span class="masonry__play">${icon.play}</span>
      </button>
    </li>`;
  }
  return `<li class="masonry__item reveal" data-cat="${cat}" style="--d:${i % 3}">
      <button type="button" class="masonry__btn" data-lightbox data-src="${big(key)}" data-caption="${esc(alt(lang, key))}" aria-label="${esc(t.open)} : ${esc(alt(lang, key))}">
        ${pic(key, alt(lang, key), { sizes: "(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 92vw" })}
      </button>
    </li>`;
}

function lightbox(lang) {
  const t = L[lang].work;
  return `<div class="lightbox" data-lb hidden role="dialog" aria-modal="true" aria-label="${esc(t.kicker)}">
  <button class="lightbox__close" type="button" data-lb-close aria-label="${esc(t.close)}">${icon.close}</button>
  <button class="lightbox__nav lightbox__nav--prev" type="button" data-lb-prev aria-label="${esc(t.prev)}">${icon.prev}</button>
  <figure class="lightbox__stage"><div data-lb-media></div><figcaption data-lb-caption></figcaption></figure>
  <button class="lightbox__nav lightbox__nav--next" type="button" data-lb-next aria-label="${esc(t.next)}">${icon.next}</button>
</div>`;
}

function work(lang, n, full = false) {
  const t = L[lang].work;
  const items = full ? GALLERY : GALLERY.slice(0, 9);
  const count = (c) => GALLERY.filter(([, k]) => !c || k === c).length;
  const filters = full ? `<ul class="filters reveal" data-filters>
      ${[[null, t.all], ...FILTERS.filter((f) => count(f)).map((f) => [f, t.filters[f]])].map(([id, label]) => `<li><button type="button" data-filter="${id || "all"}" aria-pressed="${id ? "false" : "true"}">${esc(label)}<span>${count(id)}</span></button></li>`).join("")}
    </ul>` : "";
  return `<section class="section section--dark work" id="realisations" aria-labelledby="work-title">
  <div class="wrap">
    ${full ? `<h2 id="work-title" class="sr">${esc(t.title)}</h2>` : `<div class="section__head section__head--split reveal">
      <div>${kicker(n, t.kicker)}<h2 id="work-title" class="h2">${esc(t.title)}</h2></div>
      <p class="lead">${esc(t.intro)}</p>
    </div>`}
    ${filters}
    <ul class="masonry" data-masonry>
      ${items.map((it, i) => galleryItem(lang, it, i)).join("")}
    </ul>
    ${full ? `<p class="work__empty" data-empty hidden>${esc(t.empty)} <a href="${INSTAGRAM}" target="_blank" rel="noopener">${esc(t.instagram)}</a></p>` : ""}
    <p class="center reveal">${full
      ? `<a class="btn btn--ghost" href="${INSTAGRAM}" target="_blank" rel="noopener">${icon.ig}${esc(t.instagram)}</a>`
      : `<a class="btn btn--ghost" href="${href(lang, "realisations")}">${esc(t.seeAll)}</a>`}</p>
  </div>
</section>`;
}

function craft(lang, n) {
  const t = L[lang].craft;
  return `<section class="section section--black craft" aria-labelledby="craft-title">
  <div class="wrap craft__grid">
    <figure class="craft__media reveal" data-videos>${video("coulisses-chef", t.videoLabel)}${pauseBtn(lang)}</figure>
    <div class="craft__text reveal" style="--d:1">
      ${kicker(n, t.kicker)}
      <h2 id="craft-title" class="h2">${esc(t.title)}</h2>
      ${t.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
      <ul class="points">${t.points.map((p) => `<li><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("")}</ul>
      <p class="craft__aside script">${esc(t.aside)}</p>
    </div>
  </div>
</section>`;
}

function steps(lang, n) {
  const t = L[lang].steps;
  return `<section class="section section--ivory steps" aria-labelledby="steps-title">
  <div class="wrap">
    <div class="section__head section__head--center reveal">${kicker(n, t.kicker)}<h2 id="steps-title" class="h2">${esc(t.title)}</h2></div>
    <ol class="steps__list">
      ${t.items.map((s, i) => `<li class="reveal" style="--d:${i}"><span class="steps__n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}
    </ol>
  </div>
</section>`;
}

function reviews(lang, n) {
  const t = L[lang].reviews;
  const slot = (i) => `<li class="review review--empty reveal" style="--d:${i}">
        <!-- À REMPLIR avec de vrais avis clients (texte, prénom, type d'événement, date) -->
        <span class="review__quote" aria-hidden="true">“</span>
        <p class="review__text">${esc(t.placeholder)}</p>
      </li>`;
  return `<section class="section section--dark reviews" id="avis" aria-labelledby="reviews-title">
  <div class="wrap">
    <div class="section__head section__head--split reveal">
      <div>${kicker(n, t.kicker)}<h2 id="reviews-title" class="h2">${esc(t.title)}</h2></div>
      <p class="lead">${esc(t.intro)}</p>
    </div>
    <ul class="reviews__list">${[0, 1, 2].map(slot).join("")}</ul>
    <p class="center reveal"><a class="btn btn--ghost" href="${INSTAGRAM}" target="_blank" rel="noopener">${icon.ig}${esc(t.cta)}</a></p>
  </div>
</section>`;
}

/** Formulaire de devis en plusieurs étapes : à l'envoi, ouvre WhatsApp avec un message rédigé (et l'envoie par e-mail si FORM_ENDPOINT est défini). */
function quoteForm(lang) {
  const t = L[lang].quote;
  const f = t.fields;
  const radios = (name, opts, req = true) => `<div class="choices">${opts.map((o, i) => `<label class="choice"><input type="radio" name="${name}" value="${esc(o)}"${req && i === 0 ? " required" : ""}><span>${esc(o)}</span></label>`).join("")}</div>`;
  const checks = (name, opts) => `<div class="choices">${opts.map((o) => `<label class="choice"><input type="checkbox" name="${name}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join("")}</div>`;
  const steps = [
    ["event", `<legend>${esc(f.type)}</legend>${radios("type", f.types)}`],
    ["details", `<legend class="sr">${esc(t.steps.details)}</legend>
      <div class="field"><label for="q-date">${esc(f.date)}</label><input id="q-date" name="date" type="date"></div>
      <label class="check"><input type="checkbox" name="dateUnknown" value="1"><span>${esc(f.dateUnknown)}</span></label>
      <p class="field__label">${esc(f.place)}</p>${radios("place", f.placeOptions)}
      <div class="field"><label for="q-address">${esc(f.address)}</label><input id="q-address" name="address" type="text" autocomplete="address-level2" placeholder="${esc(f.addressHint)}"></div>`],
    ["guests", `<legend class="sr">${esc(t.steps.guests)}</legend>
      <div class="field"><label for="q-guests">${esc(f.guests)}</label><input id="q-guests" name="guests" type="number" inputmode="numeric" min="1" max="5000" required></div>
      <p class="field__label">${esc(f.budget)}</p>${radios("budget", f.budgets, false)}`],
    ["services", `<legend>${esc(f.services)}</legend>${checks("services", f.serviceOptions)}
      <div class="field"><label for="q-message">${esc(f.message)}</label><textarea id="q-message" name="message" rows="3" placeholder="${esc(f.messageHint)}"></textarea></div>`],
    ["contact", `<legend class="sr">${esc(t.steps.contact)}</legend>
      <div class="field"><label for="q-name">${esc(f.name)}</label><input id="q-name" name="name" type="text" autocomplete="name" required></div>
      <div class="field"><label for="q-phone">${esc(f.phone)}</label><input id="q-phone" name="phone" type="tel" autocomplete="tel" required></div>
      <div class="field"><label for="q-email">${esc(f.emailField)}</label><input id="q-email" name="email" type="email" autocomplete="email" spellcheck="false"></div>
      <p class="form__privacy">${esc(t.privacy)}</p>`],
  ];
  const total = steps.length;
  return `<form class="quote" data-quote novalidate data-endpoint="${esc(FORM_ENDPOINT)}" data-wa="${WA}" data-labels="${esc(JSON.stringify(t.wa))}" data-required="${esc(t.required)}" data-sent="${esc(t.sent)}" data-wa-opened="${esc(t.waOpened)}" data-error="${esc(t.error)}">
    <div class="quote__progress" aria-hidden="true"><span data-quote-bar style="--p:${1 / total}"></span></div>
    <ol class="quote__steps" aria-hidden="true">${steps.map(([id], i) => `<li data-step-tab="${i}"${i === 0 ? ' class="is-on"' : ""}>${esc(t.steps[id])}</li>`).join("")}</ol>
    <p class="quote__count" aria-live="polite" data-quote-count data-tpl="${esc(t.progress)}">${esc(fill(t.progress, { n: 1, total }))}</p>
    ${steps.map(([id, html], i) => `<fieldset class="quote__step" data-step="${i}"${i ? " hidden" : ""}>${html}</fieldset>`).join("\n    ")}
    <div class="quote__nav">
      <button type="button" class="btn btn--line" data-quote-back hidden>${esc(t.back)}</button>
      <button type="button" class="btn btn--gold" data-quote-next>${esc(t.next)}</button>
      <button type="submit" class="btn btn--gold" data-quote-submit hidden>${icon.wa}${esc(t.submit)}</button>
      ${FORM_ENDPOINT ? `<button type="button" class="btn btn--line" data-quote-email hidden>${esc(t.email)}</button>` : ""}
    </div>
    <p class="quote__status" role="status" data-quote-status></p>
  </form>`;
}

function quote(lang, n, full = false) {
  const t = L[lang].quote;
  const c = L[lang].contact;
  return `<section class="section section--black quote-sec" id="${full ? "formulaire" : "devis"}" aria-labelledby="quote-title">
  <div class="wrap quote-sec__grid">
    <div class="quote-sec__text reveal">
      ${full ? "" : kicker(n, t.kicker)}
      <h2 id="quote-title" class="h2">${esc(t.title)}</h2>
      <p class="lead">${esc(t.intro)}</p>
      <div class="contact" id="contact">
        <p class="eyebrow">${esc(c.title)}</p>
        <p>${esc(c.text)}</p>
        <ul class="contact__list">
          <li><a href="tel:${PHONE_INTL}">${icon.phone}<span><small>${esc(c.phone)}</small>${PHONE}</span></a></li>
          <li><a href="${waLink(c.waMsg)}" target="_blank" rel="noopener">${icon.wa}<span><small>${esc(c.whatsapp)}</small>+33 6 26 82 55 46</span></a></li>
          <li><a href="${INSTAGRAM}" target="_blank" rel="noopener">${icon.ig}<span><small>${esc(c.instagram)}</small>@luxetraiteurparis</span></a></li>
        </ul>
        <p class="contact__zone"><small>${esc(c.zone)}</small>${esc(c.zoneText)}</p>
      </div>
    </div>
    <div class="reveal" style="--d:1">${quoteForm(lang)}</div>
  </div>
</section>`;
}

function pageHead(lang, title, intro, kickerText, media) {
  return `<section class="pagehead${media ? " pagehead--media" : ""}">
  ${media ? `<div class="pagehead__media">${media}</div><div class="pagehead__shade"></div>` : ""}
  <div class="wrap pagehead__inner">
    <p class="kicker kicker--plain">${crown}${esc(kickerText)}</p>
    <h1 class="h1">${esc(title)}</h1>
    ${intro ? `<p class="lead">${esc(intro)}</p>` : ""}
  </div>
</section>`;
}

/* ------------------------------------------------------------------ pages */

function homePage(lang) {
  let n = 0;
  return `${intro(lang)}
${header(lang, "home")}
<main id="main">
${hero(lang)}
${trust(lang)}
${services(lang, ++n)}
${weddings(lang, ++n)}
${table(lang, ++n)}
${venue(lang, ++n)}
${work(lang, ++n)}
${craft(lang, ++n)}
${steps(lang, ++n)}
${reviews(lang, ++n)}
${quote(lang, ++n)}
</main>
${lightbox(lang)}`;
}

function weddingsPage(lang) {
  const t = L[lang].weddings;
  const gallery = ["mariages/salle-tables-rondes", "decoration/coin-maries", "mariages/vin-honneur-palmiers", "mariages/soiree-salle-comble", "decoration/assiette-serviette-noire", "buffets-et-plats/buffet-desserts-bougies"];
  return `${header(lang, "mariages")}
<main id="main">
${pageHead(lang, t.pageTitle, t.pageIntro, t.kicker, pic("mariages/salle-tables-rondes", "", { eager: true }))}
<section class="section section--ivory">
  <div class="wrap weddings__grid">
    <div class="weddings__text">
      <div class="reveal">${kicker(1, t.kicker)}<h2 class="h2">${esc(t.title)}</h2><p class="lead">${esc(t.intro)}</p></div>
      ${weddingSteps(lang)}
    </div>
    <div class="weddings__media">
      <figure class="weddings__main reveal" data-parallax>${pic("mariages/table-honneur-fleurs", alt(lang, "mariages/table-honneur-fleurs"), { sizes: "(min-width: 900px) 40vw, 92vw" })}</figure>
      <figure class="weddings__float reveal" style="--d:2">${pic("cocktails/verrines-jus", alt(lang, "cocktails/verrines-jus"), { sizes: "(min-width: 900px) 18vw, 40vw" })}</figure>
    </div>
  </div>
</section>
<section class="section section--black">
  <div class="wrap included">
    <div class="reveal">${kicker(2, t.kicker)}<h2 class="h2">${esc(t.includedTitle)}</h2></div>
    <ul class="included__list">${t.included.map((s, i) => `<li class="reveal" style="--d:${i % 3}">${crown}<span>${esc(s)}</span></li>`).join("")}</ul>
  </div>
</section>
<section class="section section--dark">
  <div class="wrap">
    <div class="section__head reveal">${kicker(3, L[lang].work.kicker)}<h2 class="h2">${esc(t.galleryTitle)}</h2></div>
    <ul class="masonry" data-masonry>${gallery.map((k, i) => galleryItem(lang, [k, "mariages"], i)).join("")}${galleryItem(lang, ["videos/salle-mariage", "mariages"], 6)}</ul>
  </div>
</section>
${steps(lang, 4)}
${quote(lang, 5)}
</main>
${lightbox(lang)}`;
}

function venuePage(lang) {
  const t = L[lang].venue;
  return `${header(lang, "location")}
<main id="main">
${pageHead(lang, t.pageTitle, t.pageIntro, t.kicker, pic("mariages/salle-centre-de-table", "", { eager: true }))}
<section class="section section--ivory venue">
  <div class="wrap venue__grid">
    <div class="venue__media reveal">
      <!-- À REMPLIR : galerie de la salle (photos HD), nom, adresse exacte, capacité assise et cocktail. Photos provisoires ci-dessous. -->
      ${pic("mariages/soiree-salle-comble", alt(lang, "mariages/soiree-salle-comble"), { sizes: "(min-width: 900px) 50vw, 92vw" })}
      <p class="venue__note">${esc(t.note)}</p>
    </div>
    <div class="venue__text reveal" style="--d:1">
      ${kicker(1, t.kicker)}
      <h2 class="h2">${esc(t.title)}</h2>
      ${venueFacts(lang)}
      <h3 class="h3">${esc(t.equipmentTitle)}</h3>
      <!-- À REMPLIR : équipements réels de la salle (sono, piste de danse, parking, accès PMR, horaires…) -->
      <ul class="ticks">${t.equipment.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
      <a class="btn btn--dark" href="${waLink(t.ctaMsg)}" target="_blank" rel="noopener">${icon.wa}${esc(t.cta)}</a>
    </div>
  </div>
</section>
<section class="section section--black">
  <div class="wrap">
    <div class="section__head section__head--center reveal">${kicker(2, t.kicker)}<h2 class="h2">${esc(t.whyTitle)}</h2></div>
    <ol class="steps__list steps__list--dark">${t.why.map((w, i) => `<li class="reveal" style="--d:${i}"><span class="steps__n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></li>`).join("")}</ol>
  </div>
</section>
${quote(lang, 3)}
</main>`;
}

function workPage(lang) {
  const t = L[lang].work;
  return `${header(lang, "realisations")}
<main id="main">
${pageHead(lang, t.pageTitle, t.intro, t.kicker)}
${work(lang, 1, true)}
${quote(lang, 2)}
</main>
${lightbox(lang)}`;
}

function quotePage(lang) {
  const t = L[lang].quote;
  return `${header(lang, "devis")}
<main id="main" class="main--quote">
${pageHead(lang, t.title, "", t.kicker)}
${quote(lang, 1, true)}
${steps(lang, 2)}
</main>`;
}

function legalPage(lang) {
  const t = L[lang].legalPage;
  return `${header(lang, "legal")}
<main id="main">
${pageHead(lang, t.title, "", "Luxe Traiteur Paris")}
<section class="section section--ivory">
  <div class="wrap prose">
    <!-- À REMPLIR : raison sociale, forme juridique, SIRET, adresse du siège, directeur de la publication -->
    ${t.sections.map((s) => `<h2 class="h3">${esc(s.h)}</h2><p>${esc(s.p)}</p>`).join("\n    ")}
  </div>
</section>
</main>`;
}

const BUILD = { home: homePage, mariages: weddingsPage, location: venuePage, realisations: workPage, devis: quotePage, legal: legalPage };

/* ------------------------------------------------------------------ écriture */

for (const lang of LANGS) await rm(path.join(ROOT, lang), { recursive: true, force: true });
for (const lang of LANGS) {
  for (const [page, build] of Object.entries(BUILD)) {
    const html = `${head(lang, page)}
<body class="page-${page}">
${build(lang)}
${footer(lang, page)}
<script type="module" src="/src/main.js"></script>
</body>
</html>
`;
    const dir = path.join(ROOT, lang, PAGES[page][lang]);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), html);
  }
}

// Racine : langue mémorisée, sinon celle du navigateur (français par défaut).
await writeFile(path.join(ROOT, "index.html"), `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(L.fr.meta.home.title)}</title>
<meta name="description" content="${esc(L.fr.meta.home.description)}">
<link rel="canonical" href="${SITE}/fr/">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${SITE}/fr/">
<meta name="theme-color" content="#0B0B0B">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>html{background:#0B0B0B}</style>
<script>
var l;try{l=localStorage.getItem("lt-lang")}catch(e){}
if(l!=="fr"&&l!=="en")l=/^fr\\b/i.test(navigator.language||"fr")||!/^en\\b/i.test(navigator.language||"")?"fr":"en";
location.replace("/"+l+"/"+location.hash);
</script>
</head>
<body><noscript><a href="/fr/">Français</a> · <a href="/en/">English</a></noscript></body>
</html>
`);

const urls = LANGS.flatMap((lang) => Object.keys(PAGES).map((page) => ({ lang, page })));
await writeFile(path.join(ROOT, "public", "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(({ lang, page }) => `  <url><loc>${SITE}${href(lang, page)}</loc>${LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${href(l, page)}"/>`).join("")}<priority>${page === "home" ? "1.0" : page === "legal" ? "0.2" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`);
await writeFile(path.join(ROOT, "public", "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
const fr = L.fr;
await writeFile(path.join(ROOT, "public", "llms.txt"), `# Luxe Traiteur Paris

> ${fr.meta.home.description}

Traiteur haut de gamme basé à Paris, intervenant en Île-de-France et partout en France. Signature : « ${fr.intro.tagline} ».
Téléphone et WhatsApp : ${PHONE} (${PHONE_INTL}). Instagram : ${INSTAGRAM}
Tarifs : sur devis uniquement (menus composés sur mesure).

## Prestations
${fr.services.items.map((s) => `- ${s.title} : ${s.text}`).join("\n")}

## Pages
- [Accueil](${SITE}/fr/)
- [Traiteur de mariage](${SITE}${href("fr", "mariages")})
- [Location de salle de réception](${SITE}${href("fr", "location")})
- [Réalisations](${SITE}${href("fr", "realisations")})
- [Demande de devis](${SITE}${href("fr", "devis")})
- [English version](${SITE}/en/)
`);
console.log(`Pages générées (${urls.length}) pour ${SITE}`);
