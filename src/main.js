/**
 * Comportements du site : intro, défilement fluide, en-tête et menu, langue, apparitions au défilement,
 * parallaxe, vidéos (à l'écran / au survol), galerie filtrable et visionneuse, formulaire de devis → WhatsApp / e-mail.
 */
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
root.classList.add("js");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lang = root.lang;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

/* ---------- intro (une fois par session) ---------- */
const intro = $("[data-intro]");
if (intro && root.classList.contains("intro-on")) {
  let done = false;
  const open = (fast) => {
    if (done) return;
    done = true;
    try { sessionStorage.setItem("lt-intro", "1"); } catch {}
    if (fast) root.classList.add("intro-skipped");
    intro.classList.add("is-opening");
    setTimeout(() => { root.classList.remove("intro-on"); intro.remove(); }, fast ? 400 : 600);
  };
  setTimeout(() => open(false), 1600);
  $("[data-intro-skip]").addEventListener("click", () => open(true));
  addEventListener("keydown", (e) => e.key === "Escape" && open(true), { once: true });
} else intro?.remove();

/* ---------- défilement fluide ---------- */
let lenis = null;
gsap.registerPlugin(ScrollTrigger);
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"], a[href*="/#"]').forEach((a) => a.addEventListener("click", (e) => {
    const url = new URL(a.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(url.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    lenis.scrollTo(target, { offset: -72, duration: 1.4 });
    history.replaceState(null, "", url.hash);
  }));
}

/* ---------- en-tête ---------- */
const header = $("[data-header]");
const onScroll = () => header.classList.toggle("is-solid", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const burger = $("[data-menu-toggle]");
const menu = $("#menu");
function closeMenu() {
  if (!burger || burger.getAttribute("aria-expanded") !== "true") return;
  burger.setAttribute("aria-expanded", "false");
  burger.querySelector(".sr").textContent = burger.querySelector(".sr").dataset.open;
  menu.hidden = true;
  header.classList.remove("is-menu");
  lenis?.start();
}
burger?.addEventListener("click", () => {
  if (burger.getAttribute("aria-expanded") === "true") return closeMenu();
  burger.setAttribute("aria-expanded", "true");
  burger.querySelector(".sr").textContent = burger.querySelector(".sr").dataset.close;
  menu.hidden = false;
  header.classList.add("is-menu");
  lenis?.stop();
});
$$("#menu a").forEach((a) => a.addEventListener("click", closeMenu));
addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

// Langue : le choix est mémorisé (la racine / redirige ensuite vers elle).
$$("[data-lang]").forEach((a) => a.addEventListener("click", () => store.set("lt-lang", a.dataset.lang)));

/* ---------- apparitions et parallaxe ---------- */
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
}), { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
$$(".reveal").forEach((el) => io.observe(el));

if (!reduced) {
  $$("[data-parallax] img, .pagehead__media img").forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.closest("figure, section"), scrub: true } });
  });
  const heroMedia = $(".hero__media");
  if (heroMedia) gsap.to(heroMedia, { yPercent: 12, scale: 1.04, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
}

/* ---------- vidéos : lecture à l'écran, ou au survol dans la galerie ---------- */
const play = (v) => {
  if (v.preload === "none") { v.preload = "auto"; v.load(); }
  v.play().catch(() => {});
};
const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting && getComputedStyle(v).display !== "none" && !v.dataset.userPaused) play(v);
  else v.pause();
}), { threshold: 0.15 });
if (!reduced) $$("video[data-autoplay]").forEach((v) => vio.observe(v));
// Haut de page : la photo s'affiche d'abord ; la vidéo (paysage) ne se charge que sur grand écran, après la page,
// jamais en mode économie de données, puis apparaît en fondu quand elle joue vraiment.
$$(".hero__video").forEach((v) => {
  v.addEventListener("playing", () => v.classList.add("is-playing"), { once: true });
  if (reduced || navigator.connection?.saveData || !matchMedia("(min-width: 900px)").matches) return;
  const start = () => setTimeout(() => vio.observe(v), 1500);
  document.readyState === "complete" ? start() : addEventListener("load", start, { once: true });
});
$$("video[data-hover]").forEach((v) => {
  const box = v.closest("button") || v;
  box.addEventListener("mouseenter", () => !reduced && play(v));
  box.addEventListener("mouseleave", () => v.pause());
});

// Boutons pause : toutes les vidéos du même bloc.
$$("[data-video-toggle]").forEach((b) => b.addEventListener("click", () => {
  const vids = $$("video", b.closest("[data-videos]"));
  const pause = b.getAttribute("aria-pressed") !== "true";
  b.setAttribute("aria-pressed", String(pause));
  b.setAttribute("aria-label", pause ? b.dataset.play : b.dataset.pause);
  vids.forEach((v) => (pause ? ((v.dataset.userPaused = "1"), v.pause()) : (delete v.dataset.userPaused, play(v))));
}));

/* ---------- galerie : filtres ---------- */
const grid = $("[data-masonry]");
const empty = $("[data-empty]");
const applyFilter = (btn) => {
  const f = btn.dataset.filter;
  $$("[data-filters] button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
  let shown = 0;
  $$(".masonry__item", grid).forEach((it) => {
    const on = f === "all" || it.dataset.cat === f;
    it.hidden = !on;
    if (on) { shown++; it.classList.add("is-in"); }
  });
  if (empty) empty.hidden = shown > 0;
  ScrollTrigger.refresh();
};
// Le filtre choisi est reflété dans l'adresse (?cat=…), pour pouvoir partager une catégorie.
$$("[data-filters] button").forEach((btn) => btn.addEventListener("click", () => {
  applyFilter(btn);
  const url = new URL(location.href);
  btn.dataset.filter === "all" ? url.searchParams.delete("cat") : url.searchParams.set("cat", btn.dataset.filter);
  history.replaceState(null, "", url);
}));
const startCat = new URLSearchParams(location.search).get("cat");
const startBtn = startCat && $(`[data-filters] [data-filter="${CSS.escape(startCat)}"]`);
if (startBtn) applyFilter(startBtn);

/* ---------- visionneuse photo et vidéo ---------- */
const lb = $("[data-lb]");
if (lb) {
  const stage = $("[data-lb-media]", lb);
  const caption = $("[data-lb-caption]", lb);
  let list = [], idx = 0, opener = null;
  const show = (i) => {
    idx = (i + list.length) % list.length;
    const b = list[idx];
    stage.innerHTML = "";
    if (b.dataset.video) {
      const v = document.createElement("video");
      Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: !reduced, controls: true, poster: `/media/videos/${b.dataset.video}.webp` });
      v.innerHTML = `<source src="/media/videos/${b.dataset.video}.webm" type="video/webm"><source src="/media/videos/${b.dataset.video}.mp4" type="video/mp4">`;
      stage.append(v);
    } else {
      const img = new Image();
      img.src = b.dataset.src;
      img.alt = b.dataset.caption;
      stage.append(img);
    }
    caption.textContent = b.dataset.caption;
  };
  const close = () => {
    lb.hidden = true;
    stage.innerHTML = "";
    root.classList.remove("lb-open");
    lenis?.start();
    opener?.focus();
  };
  $$("[data-lightbox]").forEach((b) => b.addEventListener("click", () => {
    list = $$("[data-lightbox]").filter((x) => !x.closest("[hidden]"));
    opener = b;
    show(list.indexOf(b));
    lb.hidden = false;
    root.classList.add("lb-open");
    lenis?.stop();
    $("[data-lb-close]", lb).focus();
  }));
  $("[data-lb-close]", lb).addEventListener("click", close);
  $("[data-lb-prev]", lb).addEventListener("click", () => show(idx - 1));
  $("[data-lb-next]", lb).addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", (e) => e.target === lb && close());
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "Tab") { // le focus reste dans la visionneuse
      const f = $$("button", lb);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  // Balayage sur mobile
  let x0 = null;
  lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

/* ---------- formulaire de devis en étapes ---------- */
$$("[data-quote]").forEach((form) => {
  const steps = $$("[data-step]", form);
  const tabs = $$("[data-step-tab]", form);
  const back = $("[data-quote-back]", form);
  const next = $("[data-quote-next]", form);
  const submit = $("[data-quote-submit]", form);
  const email = $("[data-quote-email]", form);
  const count = $("[data-quote-count]", form);
  const bar = $("[data-quote-bar]", form);
  const status = $("[data-quote-status]", form);
  const W = JSON.parse(form.dataset.labels);
  let cur = 0;

  // Type d'événement présélectionné depuis une carte prestation (?type=2).
  const pre = new URLSearchParams(location.search).get("type");
  const radios = $$('input[name="type"]', form);
  if (pre != null && radios[+pre]) radios[+pre].checked = true;

  const go = (i) => {
    steps[cur].hidden = true;
    cur = i;
    steps[cur].hidden = false;
    tabs.forEach((t, k) => t.classList.toggle("is-on", k <= cur));
    back.hidden = cur === 0;
    const last = cur === steps.length - 1;
    next.hidden = last;
    submit.hidden = !last;
    if (email) email.hidden = !last;
    count.textContent = count.dataset.tpl.replace("{n}", cur + 1).replace("{total}", steps.length);
    bar.style.setProperty("--p", (cur + 1) / steps.length);
    status.textContent = "";
    const first = $("input, textarea", steps[cur]);
    first?.focus({ preventScroll: true });
    const top = form.getBoundingClientRect().top;
    if (top < 80) lenis ? lenis.scrollTo(form, { offset: -100 }) : form.scrollIntoView({ behavior: "smooth" });
  };
  const valid = () => {
    const bad = $$("input[required], textarea[required]", steps[cur]).find((el) => {
      if (el.type === "radio") return !$$(`input[name="${el.name}"]`, form).some((r) => r.checked);
      return !el.value.trim() || !el.checkValidity();
    });
    if (bad) {
      status.textContent = form.dataset.required;
      (bad.type === "radio" ? bad : bad).focus();
      bad.setAttribute("aria-invalid", "true");
      return false;
    }
    $$("[aria-invalid]", steps[cur]).forEach((el) => el.removeAttribute("aria-invalid"));
    return true;
  };
  next.addEventListener("click", () => valid() && go(cur + 1));
  back.addEventListener("click", () => go(cur - 1));
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && cur < steps.length - 1) { e.preventDefault(); next.click(); }
  });

  const data = () => {
    const fd = new FormData(form);
    const date = fd.get("dateUnknown") ? $('input[name="dateUnknown"]', form).nextElementSibling.textContent : fd.get("date");
    return {
      type: fd.get("type"),
      date: /^\d{4}-\d{2}-\d{2}$/.test(date || "")
        ? new Date(`${date}T12:00`).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        : date,
      place: [fd.get("place"), fd.get("address")].filter(Boolean).join(" · "),
      guests: fd.get("guests"),
      budget: fd.get("budget"),
      services: fd.getAll("services").join(", "),
      message: fd.get("message"),
      contact: [fd.get("name"), fd.get("phone"), fd.get("email")].filter(Boolean).join(" · "),
    };
  };
  const SEP = lang === "fr" ? " : " : ": ";
  const message = (d) => [W.hello, "", ...["type", "date", "place", "guests", "budget", "services", "message", "contact"]
    .filter((k) => d[k]).map((k) => `• ${W[k]}${SEP}${d[k]}`)].join("\n");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!valid()) return;
    const d = data();
    window.open(`${form.dataset.wa}?text=${encodeURIComponent(message(d))}`, "_blank", "noopener");
    status.textContent = form.dataset.waOpened;
  });
  email?.addEventListener("click", async () => {
    if (!valid()) return;
    email.disabled = true;
    try {
      const d = data();
      const res = await fetch(form.dataset.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...d, _subject: `${W.hello} (${d.type})`, langue: lang }),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      go(0);
      status.textContent = form.dataset.sent;
    } catch {
      status.textContent = form.dataset.error;
    } finally {
      email.disabled = false;
    }
  });
});
