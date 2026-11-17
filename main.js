/* Rex — rexxall.github.io. Vanilla, no build step. */
(function () {
  "use strict";
  const wall = document.getElementById("wall");
  const posters = [...wall.querySelectorAll(".pst")];

  const INFO = {
    "video-summary": { page: "video-summary/", media: { video: "video-summary/demo.mp4", poster: "video-summary/demo-poster.jpg", w: 1920, h: 1200 }, install: true,
      notes: ["Paste a YouTube or Bilibili link", "Key points with timestamps, and the frames worth keeping", "A note you can read, not a transcript"],
      extra: '<a href="https://chromewebstore.google.com/detail/video-summary-capture/jomhbnehfmgblkllekjeioancoocppjn">Chrome companion</a>' },
    "ai-assistant-suite": { media: { src: "assets/cabinet/aas.png", w: 962, h: 655, max: 481 }, install: true,
      notes: ["Title, tags, folder and tidier text, proposed", "Cloud models or one on your own machine", "Nothing changes until you tick it"] },
    "git-note-history": { page: "git-note-history/", media: { src: "git-note-history/f/trail.jpg", w: 1060, h: 690, max: 530 }, install: true,
      notes: ["Every save is a commit", "Search any sentence you ever wrote", "Take back one passage, not the whole file"] },
    "ai-accounting": { page: "ai-accounting/", media: { src: "ai-accounting/f/ledger.jpg", w: 2330, h: 1320 }, install: true,
      notes: ["Photograph a receipt or import a bill", "Read, totalled and sorted", "Checked against the numbers before it lands"] },
    "polyglot-helper": { page: "polyglot-helper/", media: { src: "polyglot-helper/f/learn.jpg", w: 2250, h: 1370 }, install: true,
      notes: ["Select a word, get its reading in place", "Japanese and English with the same gesture", "Kept in a review list inside your vault"] },
    "japan-work-secretary": { media: { src: "assets/cabinet/jws.png", w: 962, h: 732, max: 481 }, install: true,
      notes: ["Log a shift in one line", "The week measured against the 28-hour limit", "Warned before you cross it"] },
    "pass-countdown": { media: { src: "assets/cabinet/pc.png", w: 962, h: 659, max: 481 }, install: true,
      notes: ["Uses left", "Time left", "The pace you need to finish"] },
    "tasknotes-countdown": { page: "tasknotes-countdown/", media: { src: "tasknotes-countdown/f/card.jpg", w: 1842, h: 1360 }, install: true,
      notes: ["Reads your TaskNotes deadlines", "A countdown for each", "Whether you will make it"] },
    noesis: { media: { src: "assets/noesis-light.jpg", dark: "assets/noesis-dark.jpg", w: 1600, h: 1000 }, app: "https://rexxall.github.io/noesis-paper-companion/", repo: "noesis-paper-companion",
      notes: ["Skeleton: the abstract, every figure, the conclusion, and one sentence of yours", "Close reading: notes and answers in the margin beside their paragraph", "Last pass: say what the paper did in your own words; the AI never writes it for you"] },
    bunmyaku: { media: { src: "assets/bunmyaku-light.jpg", dark: "assets/bunmyaku-dark.jpg", w: 1600, h: 1000 }, app: "https://rexxall.github.io/bunmyaku-nihongo/", repo: "bunmyaku-nihongo",
      notes: ["Any Japanese material, turned into a lesson pack", "Readings, vocabulary, grammar and listening in one desk", "Content and keys stay on your machine"] },
  };
  const REPO = {};

  /* ---------- area = downloads, floor a third of the largest ---------- */
  function weights() {
    const d = posters.map(p => +p.dataset.d || 0);
    const max = Math.max(...d, 1), floor = max / 3;
    return posters.map((p, i) => ({ el: p, v: Math.max(d[i], floor) }));
  }
  function squarify(items, x, y, w, h, out) {
    if (!items.length) return;
    const total = items.reduce((a, b) => a + b.v, 0);
    if (items.length === 1) { out.push({ ...items[0], x, y, w, h }); return; }
    const side = Math.min(w, h);
    let row = [], best = Infinity;
    for (const it of items) {
      const r = [...row, it], s = r.reduce((a, b) => a + b.v, 0) / total * w * h, l = s / side;
      const worst = Math.max(...r.map(q => { const o = (q.v / total * w * h) / l; return Math.max(l / o, o / l); }));
      if (worst > best) break;
      best = worst; row = r;
    }
    const s = row.reduce((a, b) => a + b.v, 0) / total * w * h, l = s / side;
    let off = 0;
    row.forEach(q => {
      const o = (q.v / total * w * h) / l;
      out.push(w >= h ? { ...q, x, y: y + off, w: l, h: o } : { ...q, x: x + off, y, w: o, h: l });
      off += o;
    });
    const rest = items.slice(row.length);
    if (w >= h) squarify(rest, x + l, y, w - l, h, out); else squarify(rest, x, y + l, w, h - l, out);
  }
  // phones: two columns of equal width, so each poster's height carries its share instead
  function columns(items, W, gap) {
    const n = W >= 720 ? 3 : 2, cw = (W - gap * (n - 1)) / n;
    const minV = Math.min(...items.map(i => i.v));
    const unit = Math.max(cw * 1.25 / items[0].v, 128 / minV), colH = new Array(n).fill(0), out = [];
    items.forEach(it => {
      const c = colH.indexOf(Math.min(...colH)), h = it.v * unit;
      out.push({ ...it, x: c * (cw + gap), y: colH[c], w: cw + gap, h: h + gap });
      colH[c] += h + gap;
    });
    wall.style.height = Math.max(...colH) - gap + "px";
    return out;
  }
  function layout() {
    const W = wall.clientWidth;
    const narrow = W < 620;
    const gap = narrow ? 10 : 12;
    const items = weights().sort((a, b) => b.v - a.v);
    let out = [];
    if (!narrow) {
      wall.style.height = "";
      const H = wall.clientHeight;
      if (!W || !H) return;
      squarify(items, 0, 0, W + gap, H + gap, out);
      // every poster must stay readable; if the treemap can't promise that, hang them in columns
      if (out.some(r => r.w - gap < 170 || r.h - gap < 140)) out = [];
    }
    if (!out.length) out = columns(items, W, gap);
    out.forEach(r => {
      Object.assign(r.el.style, {
        left: r.x + "px", top: r.y + "px",
        width: Math.max(0, r.w - gap) + "px", height: Math.max(0, r.h - gap) + "px",
      });
    });
  }
  new ResizeObserver(() => requestAnimationFrame(layout)).observe(wall);
  layout();

  /* ---------- fresh counts (same origin, tiny); baked numbers stay if this fails ---------- */
  const fmtN = n => n.toLocaleString("en-US");
  const plural = n => (n === 1 ? " download" : " downloads");
  // dev only: ?data=worst on localhost swaps in realistic growth to test the wall
  const worst = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get("data") === "worst";
  const ready = fetch("data/stats.json", { cache: "no-cache" }).then(r => r.ok ? r.json() : null).then(d => {
    if (!d || !d.plugins) return;
    if (worst) {
      const W = { "video-summary": 12480, "ai-assistant-suite": 1, "git-note-history": 3021, "tasknotes-countdown": 1 };
      d.plugins.forEach(p => { if (W[p.id] != null) { p.downloads = W[p.id]; p.versions = p.id === "video-summary" ? Array.from({ length: 84 }, (_, i) => ["3." + i + ".0", 40 + (i * 37) % 300]) : p.versions; } });
      d.total = d.plugins.reduce((a, p) => a + (p.downloads || 0), 0);
    }
    let changed = false;
    d.plugins.forEach(p => {
      REPO[p.id] = p;
      const el = wall.querySelector(`[data-id="${p.id}"]`);
      if (!el || p.downloads == null) return;
      if (+el.dataset.d !== p.downloads) {
        el.dataset.d = p.downloads; changed = true;
        el.querySelector(".dl").innerHTML = `<b>${fmtN(p.downloads)}</b>${plural(p.downloads)}`;
      }
      const flap = el.querySelector(".flap");
      if (flap) { const ds = String(p.downloads).split(""); flap.style.setProperty("--n", ds.length); flap.innerHTML = ds.map(c => `<i>${c}</i>`).join(""); }
    });
    const tot = document.querySelector(".label .num");
    if (tot && d.total) tot.textContent = fmtN(d.total);
    if (changed) layout();
  }).catch(() => {});

  /* ---------- poster sheet ---------- */
  const sheet = document.getElementById("sheet");
  const $ = id => document.getElementById(id);
  const fmt = iso => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  let lastFocus = null;

  function open(id, push) {
    const el = wall.querySelector(`[data-id="${id}"]`), info = INFO[id];
    if (!el || !info) return;
    lastFocus = el.querySelector("a");
    const clone = el.cloneNode(true);
    clone.removeAttribute("style");
    clone.querySelector("a").setAttribute("tabindex", "-1");
    clone.querySelector("a").removeAttribute("href");
    $("sheet-poster").replaceChildren(clone);
    $("sheet-name").textContent = el.querySelector(".nm").textContent;
    $("sheet-line").textContent = el.querySelector(".ln").textContent;
    $("sheet-notes").innerHTML = info.notes.map(n => `<li>${n}</li>`).join("");
    const m = info.media, alt = el.querySelector(".nm").textContent + " in use";
    $("sheet-shot").innerHTML = m.video
      ? `<video src="${m.video}" poster="${m.poster}" width="${m.w}" height="${m.h}" autoplay muted loop playsinline preload="none" aria-label="${alt}"></video>`
      : `${m.dark ? `<source media="(prefers-color-scheme: dark)" srcset="${m.dark}">` : ""}<img src="${m.src}" alt="${alt}" width="${m.w}" height="${m.h}" decoding="async" style="${m.max ? `max-width:${m.max}px` : ""}">`;
    const v = $("sheet-shot").querySelector("video");
    if (v && matchMedia("(prefers-reduced-motion: reduce)").matches) { v.removeAttribute("autoplay"); v.controls = true; }

    const s = REPO[id], strip = $("sheet-strip");
    if (s && s.versions && s.versions.length) {
      const max = Math.max(...s.versions.map(v => v[1]), 1);
      $("sheet-bars").innerHTML = s.versions.map(([v, c]) => `<i style="height:${Math.max(3, c / max * 100)}%" title="${v}: ${c}"></i>`).join("");
      const top = s.versions.reduce((a, b) => (b[1] > a[1] ? b : a));
      $("sheet-cap").textContent = `${s.versions.length} versions, ${fmtN(s.downloads)}${plural(s.downloads)}. Most: ${top[0]} (${fmtN(top[1])}).` + (s.latest && s.latest.date ? ` Latest: ${s.latest.tag}, ${fmt(s.latest.date)}.` : "");
      $("sheet-bars").setAttribute("role", "img");
      $("sheet-bars").setAttribute("aria-label", `Downloads per version, ${s.versions.length} versions`);
      strip.hidden = false;
    } else if (s && s.downloads != null) {
      $("sheet-bars").innerHTML = "";
      $("sheet-cap").textContent = `${fmtN(s.downloads)}${plural(s.downloads)}, last seen in the stats file on ${s.seen ? fmt(s.seen) : "an earlier day"}. Per-version counts return when Obsidian lists it again.`;
      strip.hidden = false;
    } else strip.hidden = true;

    const repo = s ? s.repo : info.repo;
    const links = [];
    if (info.install) links.push(`<a class="btn" href="https://obsidian.md/plugins?id=${id}">Install in Obsidian</a>`);
    if (info.app) links.push(`<a class="btn" href="${info.app}">Open</a>`);
    if (info.page) links.push(`<a href="${info.page}">The page</a>`);
    if (repo) links.push(`<a href="https://github.com/Rexxall/${repo}">Code</a>`);
    if (info.extra) links.push(info.extra);
    $("sheet-links").innerHTML = links.join("");

    // grow out of the poster that was clicked, and go back into it
    const r = el.getBoundingClientRect(), vw = innerWidth, vh = innerHeight;
    const sw = Math.min(1080, vw - 32), sh = Math.min(vh - 32, 900);
    sheet.style.setProperty("--from", `${r.left + r.width / 2 - (vw - sw) / 2}px ${r.top + r.height / 2 - (vh - sh) / 2}px`);
    sheet.classList.remove("out");
    if (!sheet.open) sheet.showModal();
    sheet.querySelector(".sheet-in").focus({ preventScroll: true });
    sheet.scrollTop = 0;
    if (push) history.pushState({ sheet: id }, "", "#" + id);
  }
  function close() {
    if (!sheet.open || sheet.classList.contains("out")) return;
    sheet.classList.add("out");
    const done = () => { sheet.classList.remove("out"); if (sheet.open) sheet.close(); };
    sheet.addEventListener("animationend", done, { once: true });
    setTimeout(done, 260);
  }
  sheet.addEventListener("cancel", e => { e.preventDefault(); close(); });
  sheet.addEventListener("close", () => {
    $("sheet-shot").replaceChildren();
    if (location.hash && INFO[location.hash.slice(1)]) history.pushState(null, "", location.pathname + location.search);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  });
  sheet.addEventListener("click", e => {
    if (e.target === sheet || e.target.closest("[data-close]")) close();
  });
  wall.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a) return;
    const id = a.parentElement.dataset.id;
    if (!INFO[id]) return;
    e.preventDefault();
    open(id, true);
  });
  function fromHash() {
    const id = location.hash.slice(1);
    if (INFO[id]) open(id, false); else close();
  }
  addEventListener("popstate", fromHash);
  if (location.hash) {
    Promise.race([ready, new Promise(r => setTimeout(r, 800))]).then(fromHash);
  }
})();
