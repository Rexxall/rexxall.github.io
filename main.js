/* Rex — rexxall.github.io. Vanilla, no build step. */
(function () {
  const RAW = "https://raw.githubusercontent.com/Rexxall/";
  const PLUGINS = [
    { slug: "git-note-history", red: 2, name: "Git Note History", line: "Find a sentence you deleted. Take back only that part.", c: "#7a5af0", roman: "II", dir: "git-note-history", repo: "obsidian-git-history-view",
      notes: ["every save is a <b>commit</b>", "search any sentence you ever wrote", "take back <b>one line</b>, not the file"] },
    { slug: "ai-assistant-suite", red: 2, name: "AI Assistant Suite", line: "AI suggests title, tags and folder. You tick what to apply.", c: "#0a84ff", roman: "III", dir: "ai-assistant-suite", repo: "obsidian-ai-assistant-suite",
      notes: ["title · tags · folder, <b>proposed</b>", "pick a model, or none", "nothing applied until <b>you tick</b>"] },
    { slug: "polyglot-helper", red: 0, name: "Polyglot Helper", line: "Look up Japanese and English words, keep them for review.", c: "#30b0c7", roman: "IV", dir: "polyglot-helper", repo: "obsidian-polyglot-helper",
      notes: ["select a word, reading <b>in place</b>", "Japanese and English, same gesture", "kept in a review list <b>in your vault</b>"] },
    { slug: "video-summary", red: 2, name: "Video Summary", line: "A video link in, a finished note out.", c: "#ff375f", roman: "V", dir: "video-summary", repo: "obsidian-video-summary",
      notes: ["paste a YouTube or Bilibili link", "key points with <b>timestamps</b>", "a note, <b>not a transcript</b>"] },
    { slug: "japan-work-secretary", red: 2, name: "Japan Work Secretary", line: "Part-time shifts in Japan, warned before 28 hours.", c: "#ff9f0a", roman: "VI", dir: "japan-work-secretary", repo: "japan-work-secretary",
      notes: ["log a shift in one line", "the week against the <b>28-hour</b> limit", "warned <b>before</b> you cross it"] },
    { slug: "ai-accounting", red: 2, name: "AI Accounting", line: "A receipt in, a checked ledger entry out.", c: "#34c759", roman: "VII", dir: "ai-accounting", repo: "obsidian-ai-accounting",
      notes: ["photograph a receipt", "read and totalled", "<b>checked</b> before it lands"] },
    { slug: "pass-countdown", red: 2, name: "Pass Countdown", line: "Uses left, time left, and the pace to finish.", c: "#5e5ce6", roman: "VIII", dir: "pass-countdown", repo: "obsidian-pass-countdown",
      notes: ["uses left", "time left", "the <b>pace</b> to finish"] },
    { slug: "tasknotes-countdown", red: 2, name: "TaskNotes Countdown", line: "Deadlines from TaskNotes, and whether you will make it.", c: "#bf5af2", roman: "IX", dir: "tasknotes-countdown", repo: "tasknotes-countdown",
      notes: ["reads your TaskNotes deadlines", "a countdown for each", "<b>will you make it?</b>"] },
  ];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reel = document.getElementById("reel");

  /* ---------- plate scenes ---------- */
  const rough = (w, h, seed) => {
    let s = seed; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280 - .5) * 2.2;
    const pts = [], edge = (ax, ay, bx, by) => { for (let i = 0; i < 16; i++) { const t = i / 16; pts.push([ax + (bx - ax) * t + r(), ay + (by - ay) * t + r()]); } };
    edge(4, 4, w - 4, 4); edge(w - 4, 4, w - 4, h - 4); edge(w - 4, h - 4, 4, h - 4); edge(4, h - 4, 4, 4);
    return "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + " Z";
  };
  const anchor = document.getElementById("x");
  PLUGINS.forEach((p, i) => {
    const sec = document.createElement("section");
    sec.className = "scene plate-scene"; sec.id = p.slug; sec.dataset.roman = p.roman; sec.style.setProperty("--c", p.c);
    sec.innerHTML = `
      <div class="plate-head"><span class="num">FIG. ${p.roman}</span><span class="k"><span class="atlas-only">Obsidian plugin</span><span class="film-only">Scene ${p.roman}</span></span></div>
      <span class="file">REX_PLATE_${p.roman}</span>
      <span class="tab" aria-hidden="true">${p.roman}</span>
      <div class="holes" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="plate">
        <figure class="specimen">
          <img data-src="${RAW}${p.repo}/main/assets/readme/demo-{m}.gif" data-still="assets/${p.slug}-{m}.jpg" alt="${p.name} in use" loading="lazy" decoding="async">
          <svg class="frame" viewBox="0 0 1000 625" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="${rough(1000, 625, i + 11)}"/></svg>
        </figure>
        <div class="notes">
          ${p.notes.map((n, j) => `<div class="what"><span class="n">${j + 1}</span><p class="hand">${(j === p.red ? n : n.replace(/<\/?b>/g, "")).replace(/<b>(.*?)<\/b>/, '<b><svg class="circ" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M8 22 C 6 8, 40 2, 60 4 C 86 6, 98 14, 94 24 C 90 36, 50 40, 26 36 C 10 33, 4 28, 8 22"/></svg>$1</b>')}</p></div>`).join("")}
        </div>
      </div>
      <svg class="leaders" aria-hidden="true">${[0, 1, 2].map(() => `<path pathLength="1" d="M0 0"/>`).join("")}</svg>
      <div class="name">
        <div><h2>${p.name}</h2><p class="type">${p.line}</p></div>
        <p class="links"><a class="btn" href="https://obsidian.md/plugins?id=${p.dir}">Install in Obsidian</a><a href="https://github.com/Rexxall/${p.repo}">code</a></p>
      </div>
      <span class="sign" aria-hidden="true">R.</span>`;
    anchor.before(sec);
  });

  /* ---------- one night shift: dusk in red, the small hours in blue, dawn on white paper ---------- */
  const SHIFT = { i: ["tense", "18:40"], "git-note-history": ["tense", "19:30"], "ai-assistant-suite": ["tense", "20:50"], "polyglot-helper": ["tense", "22:10"],
    "video-summary": ["night", "23:40"], "japan-work-secretary": ["night", "00:50"], "ai-accounting": ["night", "02:10"], "pass-countdown": ["night", "03:20"],
    "tasknotes-countdown": ["night", "04:10"], x: ["night", "04:50"], now: ["quiet", "05:40"], credits: ["quiet", "06:30"] };
  document.querySelectorAll(".scene").forEach(sc => {
    const [m, t] = SHIFT[sc.id] || ["quiet", ""]; sc.dataset.mood = m;
    const num = sc.querySelector(".plate-head .num"); if (num && t) num.insertAdjacentHTML("beforeend", ` <span class="clock">· ${t}</span>`);
  });
  document.getElementById("now").classList.add("dawn");

  // leaders: from three points inside the specimen to the three notes, measured after layout
  function layoutLeaders(sec) {
    const svg = sec.querySelector(".leaders"), spec = sec.querySelector(".specimen"), notes = [...sec.querySelectorAll(".notes .what")];
    if (!svg || !spec || !notes.length) return;
    const R = sec.getBoundingClientRect(), S = spec.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${R.width} ${R.height}`); svg.setAttribute("width", R.width); svg.setAttribute("height", R.height);
    const paths = svg.querySelectorAll("path");
    notes.forEach((n, j) => {
      const N = n.getBoundingClientRect(), y = N.top - R.top + 13;
      const x1 = S.right - R.left + 14, x2 = N.left - R.left - 16;
      // a short tick down into the specimen's edge, then straight across to the note
      paths[j].setAttribute("d", `M${x1 - 6} ${y} H${x2}`);
    });
  }
  document.querySelectorAll(".frame path[data-seed]").forEach(pa => pa.setAttribute("d", rough(1000, 625, +pa.dataset.seed)));
  const relayout = () => document.querySelectorAll(".plate-scene").forEach(layoutLeaders);
  addEventListener("resize", relayout); setTimeout(relayout, 60); document.fonts && document.fonts.ready.then(relayout);

  // the demo GIF for the current mode; a still from this site while it loads, and if GitHub is slow
  // the reel for the current mode: a still first, the GIF once it has loaded and the scene is on screen
  function loadShots() {
    document.querySelectorAll(".specimen img[data-still]").forEach(img => {
      const m = img.closest(".scene").dataset.mood === "quiet" ? "light" : "dark";
      const still = img.dataset.still.replace("{m}", m); img.src = still;
      if (!img.dataset.src) return;
      const gif = img.dataset.src.replace("{m}", m); img.dataset.gif = gif;
      const pre = new Image(); pre.onload = () => { if (img.dataset.gif === gif) img.src = gif; }; pre.src = gif;
    });
  }
  loadShots();

  /* ---------- rail + active scene ---------- */
  const scenes = [...document.querySelectorAll(".scene")];
  const rail = document.getElementById("rail");
  scenes.forEach(s => {
    const a = document.createElement("a"); a.href = "#" + s.id; a.setAttribute("aria-label", s.id);
    const img = s.querySelector(".specimen img");
    a.innerHTML = `<span class="rn">${s.dataset.roman}</span>` + (img ? `<img class="rt" src="${img.dataset.still.replace("{m}", "dark")}" alt="">` : `<span class="rt rt-blank"></span>`);
    if (s.style.getPropertyValue("--c")) a.style.setProperty("--c", s.style.getPropertyValue("--c"));
    rail.appendChild(a);
  });
  const railLinks = [...rail.children];
  let active = 0;
  const io = new IntersectionObserver(es => es.forEach(en => {
    const i = scenes.indexOf(en.target);
    if (en.isIntersecting) { en.target.classList.add("on"); active = i; root.dataset.chrome = en.target.dataset.mood; railLinks.forEach((l, k) => l.classList.toggle("on", k === i)); history.replaceState(null, "", "#" + en.target.id); }
  }), { root: reel, threshold: .55 });
  scenes.forEach(s => io.observe(s));
  // belt and braces: after any scroll settles, the scene under the viewport is on
  function markActive() {
    const i = Math.max(0, Math.min(scenes.length - 1, Math.round(reel.scrollTop / Math.max(1, reel.clientHeight))));
    scenes[i].classList.add("on"); active = i; root.dataset.chrome = scenes[i].dataset.mood; railLinks.forEach((l, k) => l.classList.toggle("on", k === i));
  }
  let settle; reel.addEventListener("scroll", () => { clearTimeout(settle); settle = setTimeout(markActive, 90); }, { passive: true });
  setTimeout(markActive, 120); setTimeout(markActive, 600);
  const blink = document.createElement("div"); blink.className = "blink"; document.body.appendChild(blink);
  let lastActive = -1;
  const blinkIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { const i = scenes.indexOf(en.target); if (lastActive >= 0 && i !== lastActive && !reduce) { blink.classList.remove("go"); void blink.offsetWidth; blink.classList.add("go"); } lastActive = i; } }), { root: reel, threshold: .55 });
  scenes.forEach(s => blinkIO.observe(s));
  // anchors scroll inside the reel
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const t = document.getElementById(a.getAttribute("href").slice(1)); if (!t) return;
    e.preventDefault(); t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });
  addEventListener("keydown", e => {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); scenes[Math.min(scenes.length - 1, active + 1)].scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
    if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); scenes[Math.max(0, active - 1)].scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
  });
  if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) { reel.style.scrollBehavior = "auto"; t.scrollIntoView({ behavior: "instant" }); setTimeout(() => { t.scrollIntoView({ behavior: "instant" }); reel.style.scrollBehavior = ""; }, 80); } }

  /* ---------- now: live from GitHub ---------- */
  (async () => {
    const feed = document.getElementById("feed");
    try {
      const r = await fetch("https://api.github.com/users/Rexxall/events/public?per_page=60", { headers: { Accept: "application/vnd.github+json" } });
      const ev = (await r.json()).filter(e => e.type === "PushEvent" && e.repo.name.startsWith("Rexxall/"));
      const seen = new Map();
      ev.forEach(e => { const k = e.repo.name; if (!seen.has(k)) seen.set(k, { repo: k.split("/")[1], at: new Date(e.created_at), msg: (e.payload.commits || []).slice(-1)[0]?.message?.split("\n")[0] || "" }); });
      const rows = [...seen.values()].slice(0, 6);
      const rel = d => { const h = Math.round((Date.now() - d) / 36e5); return h < 1 ? "just now" : h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago`; };
      const fmt = d => `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
      feed.innerHTML = rows.length ? rows.map((x, i) => `<li${i === 0 ? ' class="new"' : ""}>
          <span class="t"><i>${fmt(x.at)}</i><small>${rel(x.at)}</small></span>
          <span class="r"><a href="https://github.com/Rexxall/${x.repo}">${x.repo}</a><small>${x.msg.replace(/</g, "&lt;")}</small></span>
          <span class="slate" aria-hidden="true"><b>SC. ${["II","III","IV","V","VI","VII","VIII","IX"][i] || "X"}</b><b>TAKE ${rows.length - i}</b><b>${fmt(x.at)}</b></span>
        </li>`).join("")
        : `<li class="hand dim">a quiet week on GitHub</li>`;
    } catch (e) {
      feed.innerHTML = `<li class="hand dim">GitHub did not answer; the log is at <a href="https://github.com/Rexxall">github.com/Rexxall</a></li>`;
    }
  })();

  // the plate carries today's number, the way the diary does
  (() => { const d = new Date(), s = new Date(d.getFullYear(), 0, 0), day = Math.floor((d - s) / 864e5);
    const w = Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 864e5 + new Date(d.getFullYear(), 0, 1).getDay() + 1) / 7);
    const el = document.getElementById("day"); if (el) el.textContent = `DAY ${day} · W${w} · `; const e2 = document.getElementById("day2"); if (e2) e2.textContent = `DAY ${day} · 18:40 · `; })();

  /* ---------- film: lines are typed one character at a time ---------- */
  document.querySelectorAll(".type").forEach(el => {
    const chars = [...el.textContent]; el.style.setProperty("--d", (.45 + chars.length * .026 + .1).toFixed(2) + "s");
    el.innerHTML = chars.map((ch, i) => `<span style="--i:${i}">${ch === "<" ? "&lt;" : ch === "&" ? "&amp;" : ch}</span>`).join("");
  });

  /* ---------- credits roll: a different line on the verse card each time the page opens ---------- */
  const VERSES = [
    ["The tool proposes, you decide, undo always.", "工具提议，你来决定，随时撤销。", "the one line under every plugin"],
    ["Find a sentence you deleted. Take back only that part.", "找回删掉的那句话，只拿回那一部分。", "Git Note History"],
    ["AI suggests title, tags and folder. You tick what to apply.", "AI 提议标题、标签和文件夹，你勾选要用的。", "AI Assistant Suite"],
    ["Look up Japanese and English words, keep them for review.", "查日文和英文单词，留下来复习。", "Polyglot Helper"],
    ["A video link in, a finished note out.", "进去一个视频链接，出来一篇写好的笔记。", "Video Summary"],
    ["Part-time shifts in Japan, warned before 28 hours.", "在日本打工的班表，到 28 小时之前先提醒。", "Japan Work Secretary"],
    ["A receipt in, a checked ledger entry out.", "进去一张小票，出来一条核过的账。", "AI Accounting"],
    ["Uses left, time left, and the pace to finish.", "还剩几次、还剩多久、照这个速度赶不赶得完。", "Pass Countdown"],
    ["Deadlines from TaskNotes, and whether you will make it.", "TaskNotes 里的截止日，和你赶不赶得上。", "TaskNotes Countdown"],
    ["Start from a real chore.", "从一件真实的杂事开始。", "how I build"],
    ["Keep data local, in Markdown and Git.", "数据留在本地，用 Markdown 和 Git。", "how I build"],
    ["Follow the host app's theme.", "跟着宿主应用的主题走。", "how I build"],
  ];
  (() => { const v = VERSES[Math.floor(Math.random() * VERSES.length)], card = document.querySelector(".verse"); if (!card) return;
    card.querySelector(".en").textContent = v[0]; card.querySelector(".zh").textContent = v[1]; card.querySelector(".by").textContent = "— " + v[2]; })();
  const roll = document.getElementById("roll"); const inner = document.createElement("div"); inner.className = "roll-inner";
  while (roll.firstChild) inner.appendChild(roll.firstChild); roll.appendChild(inner);

  /* ---------- the hero's row of plugins ---------- */
  const ticks = document.getElementById("ticks");
  PLUGINS.forEach(p => { const li = document.createElement("li"); li.innerHTML = `<a href="#${p.slug}"><b>${p.roman}</b><small>${p.name}</small></a>`; ticks.appendChild(li); });

  /* ---------- one sky behind the whole page: scrolling is the night passing ----------
     the monitor trace is the horizon. dusk from 红光, the small hours from 深夜冷蓝, the teal before dawn
     from 蓝绿舞台光, the fog and the white page from 苍白留白. one keyframe per scene, eased between. */
  const hero = document.getElementById("i");
  const cv = document.createElement("canvas"); cv.id = "sky"; cv.setAttribute("aria-hidden", "true"); document.body.prepend(cv);
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, t0 = performance.now(), mouseY = -1, smoothBase = null;
  function size() { const dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  addEventListener("resize", size); size();
  hero.addEventListener("pointermove", e => { mouseY = e.clientY; }); hero.addEventListener("pointerleave", () => { mouseY = -1; });
  function ecgY(u) {
    if (u < .28) return 0; if (u < .33) return -(u - .28) / .05 * 10; if (u < .38) return -10 + (u - .33) / .05 * 10; if (u < .44) return 0;
    if (u < .48) return -(u - .44) / .04 * 70; if (u < .54) return -70 + (u - .48) / .06 * 120; if (u < .59) return 50 - (u - .54) / .05 * 68; if (u < .63) return -18 + (u - .59) / .04 * 18;
    if (u < .72) return 0; if (u < .84) return -Math.sin((u - .72) / .12 * Math.PI) * 20; return 0;
  }
  // top, horizon glow, glow height, ground, sun [x, y above horizon, r, alpha], moon [x, y, alpha], stars, fog, mist ground
  const K = [
    { top: "#07090b", glow: "#a24328", gh: .62, ground: "#07090b", sun: [.76, .2, 86, .92], moon: [.12, -.1, 0], stars: 0, fog: 0 },   // 18:40
    { top: "#07090b", glow: "#7a1d15", gh: .42, ground: "#07090b", sun: [.56, .03, 70, .85], moon: [.12, -.1, 0], stars: 0, fog: 0 },  // 19:30
    { top: "#07090b", glow: "#4a120e", gh: .3, ground: "#07090b", sun: [.58, -.08, 60, .7], moon: [.12, -.1, 0], stars: .15, fog: 0 }, // 20:50
    { top: "#05081a", glow: "#2a1636", gh: .26, ground: "#06081a", sun: [.86, -.2, 50, 0], moon: [0.52, .06, .5], stars: .45, fog: 0 },   // 22:10
    { top: "#040a1c", glow: "#0e2350", gh: .3, ground: "#040a1c", sun: [.86, -.2, 50, 0], moon: [0.58, .26, .95], stars: .8, fog: 0 },   // 23:40
    { top: "#040a1c", glow: "#0d2148", gh: .3, ground: "#040a1c", sun: [.86, -.2, 50, 0], moon: [0.66, .44, 1], stars: 1, fog: 0 },     // 00:50
    { top: "#030817", glow: "#0b1e48", gh: .28, ground: "#030817", sun: [.86, -.2, 50, 0], moon: [0.74, .52, 1], stars: 1, fog: 0 },    // 02:10
    { top: "#030817", glow: "#0d2552", gh: .3, ground: "#030817", sun: [.86, -.2, 50, 0], moon: [0.82, .46, .95], stars: .9, fog: 0 },  // 03:20
    { top: "#040b1e", glow: "#123a5a", gh: .36, ground: "#040b1e", sun: [.86, -.2, 50, 0], moon: [0.9, .3, .8], stars: .6, fog: 0 },   // 04:10
    { top: "#06112a", glow: "#2c6a72", gh: .46, ground: "#06112a", sun: [.86, -.2, 50, 0], moon: [0.97, .14, .3], stars: .3, fog: .1 }, // 04:50
    { top: "#dfe5ec", glow: "#f5f5f3", gh: .7, ground: "#c9ced6", sun: [.7, -.02, 60, .25], moon: [0.97, .1, 0], stars: 0, fog: .8 },     // 05:40
    { top: "#f5f5f3", glow: "#f5f5f3", gh: .7, ground: "#dcdcd8", sun: [.7, .08, 60, 0], moon: [0.97, .1, 0], stars: 0, fog: .5 },        // 06:30
  ];
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`; };
  const lerp = (a, b, t) => a + (b - a) * t;
  const STARS = Array.from({ length: 140 }, (_, i) => { let s = (i + 1) * 9301; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280); return [r(), r() * .62, r() * 1.2 + .3, r() * 6.28]; });
  function draw(now) {
    const f = Math.max(0, Math.min(K.length - 1, reel.scrollTop / Math.max(1, reel.clientHeight)));
    const i = Math.min(K.length - 2, Math.floor(f)), t0e = f - i, t = t0e * t0e * (3 - 2 * t0e), A = K[i], B = K[i + 1];
    const wide = W > 860, heroK = Math.min(1, f);
    // the horizon: high and wide on the cover, low along the bottom edge on every plate after
    const text = hero.querySelector(".hero-text").getBoundingClientRect();
    const xStart = wide ? lerp(text.right + Math.max(48, W * .04), 0, heroK) : 0;
    const baseHero = wide ? H * .58 : H * .93, baseLow = H - (wide ? 26 : 18);
    let base = lerp(baseHero, baseLow, heroK);
    if (heroK < .05 && mouseY > 0 && wide) { const target = Math.min(H * .66, Math.max(H * .44, mouseY)); smoothBase = smoothBase == null ? base : smoothBase + (target - smoothBase) * .06; base = smoothBase; } else smoothBase = null;
    const amp = lerp(Math.min(260, H * .3), wide ? 120 : 80, heroK) / 220;
    const top = mixc(A.top, B.top, t), glow = mixc(A.glow, B.glow, t), ground = mixc(A.ground, B.ground, t), gh = lerp(A.gh, B.gh, t);
    ctx.fillStyle = top; ctx.fillRect(0, 0, W, H);
    // the glow rises from the horizon
    const gy = base - H * gh, g = ctx.createLinearGradient(0, gy, 0, base);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, glow);
    ctx.save(); ctx.fillStyle = top; ctx.fillRect(0, gy, W, base - gy);
    const gg = ctx.createLinearGradient(0, gy, 0, base); gg.addColorStop(0, top); gg.addColorStop(1, glow); ctx.fillStyle = gg;
    ctx.fillRect(xStart, gy, W - xStart, base - gy + 2);
    if (xStart > 0) { const fx = ctx.createLinearGradient(xStart, 0, xStart + W * .14, 0); fx.addColorStop(0, top); fx.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = fx; ctx.fillRect(xStart, gy, W * .14, base - gy + 2); }
    ctx.restore();
    // stars
    const st = lerp(A.stars, B.stars, t), sec = (now - t0) / 1000;
    if (st > .01) { ctx.fillStyle = "#e6eefc"; STARS.forEach(([sx, sy, r, ph]) => { if (sx * W < xStart) return; ctx.globalAlpha = st * (.35 + .35 * Math.sin(sec * .8 + ph)); ctx.beginPath(); ctx.arc(sx * W, sy * H, r, 0, 6.283); ctx.fill(); }); ctx.globalAlpha = 1; }
    // sun
    const sa = lerp(A.sun[3], B.sun[3], t);
    if (sa > .01) { const sx = lerp(A.sun[0], B.sun[0], t) * W, sy = base - lerp(A.sun[1], B.sun[1], t) * H - lerp(A.sun[2], B.sun[2], t) * .4, sr = lerp(A.sun[2], B.sun[2], t) * (wide ? 1 : .36);
      const syP = wide ? sy : lerp(H * .085, sy, heroK);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, base); ctx.clip(); ctx.globalAlpha = sa; ctx.fillStyle = "#d7b485"; ctx.beginPath(); ctx.arc(wide ? sx : W * .8, syP, sr, 0, 6.283); ctx.fill(); ctx.restore(); }
    // moon, with a faint ring of light
    const ma = lerp(A.moon[2], B.moon[2], t);
    if (ma > .01) { const mx = lerp(A.moon[0], B.moon[0], t) * W, my = wide ? H * (.31 - .19 * Math.max(0, lerp(A.moon[1], B.moon[1], t)) / .52) : H * .085, mr = wide ? 20 : 14;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, base); ctx.clip(); ctx.globalAlpha = ma;
      const halo = ctx.createRadialGradient(mx, my, mr, mx, my, mr * 5); halo.addColorStop(0, "rgba(142,197,255,.22)"); halo.addColorStop(1, "rgba(142,197,255,0)"); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(mx, my, mr * 5, 0, 6.283); ctx.fill();
      ctx.fillStyle = "#e6eefc"; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.283); ctx.fill();
      ctx.globalCompositeOperation = "destination-out"; ctx.beginPath(); ctx.arc(mx + mr * .45, my - mr * .2, mr * .92, 0, 6.283); ctx.fill(); ctx.restore(); }
    // the horizon itself: the monitor trace, filled down as ground
    const speed = reduce ? 0 : sec, period = Math.max(360, (W - xStart) / (wide ? 2.2 : 1.4)) * lerp(1, 1.6, heroK);
    ctx.beginPath();
    for (let x = xStart; x <= W + 2; x += 2) { const u = (((x + speed * (110 + heroK * 60)) / period) % 1 + 1) % 1, y = base + ecgY(u) * amp * H / 900 * (900 / Math.max(H, 1)) * 1; x === xStart ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.lineTo(W + 2, H + 2); ctx.lineTo(xStart, H + 2); ctx.closePath(); ctx.fillStyle = ground; ctx.fill();
    // fog before dawn
    const fog = lerp(A.fog, B.fog, t);
    if (fog > .01) { const fg = ctx.createLinearGradient(0, H * .35, 0, H); fg.addColorStop(0, "rgba(245,245,243,0)"); fg.addColorStop(1, `rgba(245,245,243,${fog})`); ctx.fillStyle = fg; ctx.fillRect(0, H * .35, W, H * .65); }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
