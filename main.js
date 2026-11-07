/* Rex — rexxall.github.io. Vanilla, no build step. */
(function () {
  const RAW = "https://raw.githubusercontent.com/Rexxall/";
  const PLUGINS = [
    { slug: "git-note-history", name: "Git Note History", line: "Find a sentence you deleted. Take back only that part.", c: "#7a5af0", roman: "II", dir: "git-note-history", repo: "obsidian-git-history-view",
      notes: ["every save is a <b>commit</b>", "search any sentence you ever wrote", "take back <b>one line</b>, not the file"] },
    { slug: "ai-assistant-suite", name: "AI Assistant Suite", line: "AI suggests title, tags and folder. You tick what to apply.", c: "#0a84ff", roman: "III", dir: "ai-assistant-suite", repo: "obsidian-ai-assistant-suite",
      notes: ["title · tags · folder, <b>proposed</b>", "pick a model, or none", "nothing applied until <b>you tick</b>"] },
    { slug: "polyglot-helper", name: "Polyglot Helper", line: "Look up Japanese and English words, keep them for review.", c: "#30b0c7", roman: "IV", dir: "polyglot-helper", repo: "obsidian-polyglot-helper",
      notes: ["select a word, reading <b>in place</b>", "Japanese and English, same gesture", "kept in a review list <b>in your vault</b>"] },
    { slug: "video-summary", name: "Video Summary", line: "A video link in, a finished note out.", c: "#ff375f", roman: "V", dir: "video-summary", repo: "obsidian-video-summary",
      notes: ["paste a YouTube or Bilibili link", "key points with <b>timestamps</b>", "a note, <b>not a transcript</b>"] },
    { slug: "japan-work-secretary", name: "Japan Work Secretary", line: "Part-time shifts in Japan, warned before 28 hours.", c: "#ff9f0a", roman: "VI", dir: "japan-work-secretary", repo: "japan-work-secretary",
      notes: ["log a shift in one line", "the week against the <b>28-hour</b> limit", "warned <b>before</b> you cross it"] },
    { slug: "ai-accounting", name: "AI Accounting", line: "A receipt in, a checked ledger entry out.", c: "#34c759", roman: "VII", dir: "ai-accounting", repo: "obsidian-ai-accounting",
      notes: ["photograph a receipt", "read and totalled", "<b>checked</b> before it lands"] },
    { slug: "pass-countdown", name: "Pass Countdown", line: "Uses left, time left, and the pace to finish.", c: "#5e5ce6", roman: "VIII", dir: "pass-countdown", repo: "obsidian-pass-countdown",
      notes: ["uses left", "time left", "the <b>pace</b> to finish"] },
    { slug: "tasknotes-countdown", name: "TaskNotes Countdown", line: "Deadlines from TaskNotes, and whether you will make it.", c: "#bf5af2", roman: "IX", dir: "tasknotes-countdown", repo: "tasknotes-countdown",
      notes: ["reads your TaskNotes deadlines", "a countdown for each", "<b>will you make it?</b>"] },
  ];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reel = document.getElementById("reel");
  const mode = () => root.dataset.mode;

  /* ---------- mode ---------- */
  const modeBtn = document.getElementById("mode");
  function setMode(m) { root.dataset.mode = m; try { localStorage.setItem("mode", m); } catch (e) {} modeBtn.setAttribute("aria-pressed", String(m === "film")); }
  modeBtn.addEventListener("click", () => setMode(mode() === "film" ? "atlas" : "film"));
  modeBtn.setAttribute("aria-pressed", String(mode() === "film"));

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
      <span class="file">ITH_PLATE_${p.roman}</span>
      <span class="tab" aria-hidden="true">${p.roman}</span>
      <svg class="dots" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${[0,1,2,3,4].map(k => `<circle cx="${8 + (k * 37) % 84}" cy="${12 + (k * 53) % 76}" r="${(k % 3) * .25 + .35}"/>`).join("")}</svg>
      <div class="holes" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="plate">
        <figure class="specimen" style="margin:0">
          <img data-src="${RAW}${p.repo}/main/assets/readme/demo-{m}.gif" data-still="assets/${p.slug}-{m}.jpg" alt="${p.name} in use" loading="lazy" decoding="async">
          <span class="gloss" aria-hidden="true"></span>
          <svg class="frame" viewBox="0 0 1000 625" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="${rough(1000, 625, i + 11)}"/></svg>
        </figure>
        <div class="notes">
          ${p.notes.map((n, j) => `<div class="what"><span class="n">${j + 1}</span><p class="hand">${n.replace(/<b>(.*?)<\/b>/, '<b><svg class="circ" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M8 22 C 6 8, 40 2, 60 4 C 86 6, 98 14, 94 24 C 90 36, 50 40, 26 36 C 10 33, 4 28, 8 22"/></svg>$1</b>')}</p></div>`).join("")}
        </div>
      </div>
      <svg class="leaders" aria-hidden="true">${[0, 1, 2].map(j => `<path pathLength="1" d="M0 0"/><circle r="8"/><text text-anchor="middle">${j + 1}</text>`).join("")}</svg>
      <div class="name">
        <div><h2>${p.name}</h2><p>${p.line}</p></div>
        <p class="links"><a class="btn" href="https://obsidian.md/plugins?id=${p.dir}">Install in Obsidian</a><a href="https://github.com/Rexxall/${p.repo}">code</a></p>
      </div>
      <span class="sign" aria-hidden="true">R.</span>`;
    anchor.before(sec);
  });

  // leaders: from three points inside the specimen to the three notes, measured after layout
  function layoutLeaders(sec) {
    const svg = sec.querySelector(".leaders"), spec = sec.querySelector(".specimen"), notes = [...sec.querySelectorAll(".notes .what")];
    if (!svg || !spec || !notes.length) return;
    const R = sec.getBoundingClientRect(), S = spec.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${R.width} ${R.height}`); svg.setAttribute("width", R.width); svg.setAttribute("height", R.height);
    const paths = svg.querySelectorAll("path"), dots = svg.querySelectorAll("circle");
    notes.forEach((n, j) => {
      const N = n.getBoundingClientRect();
      const x1 = S.right - R.left + 10, y1 = S.top - R.top + S.height * (.22 + j * .28);
      const x2 = N.left - R.left - 14, y2 = N.top - R.top + 14, xm = S.right - R.left + 34;
      paths[j].setAttribute("d", `M${x1} ${y1} L${xm} ${y2} H${x2}`);
      dots[j].setAttribute("cx", x1); dots[j].setAttribute("cy", y1); const lab = svg.querySelectorAll("text")[j]; if (lab) { lab.setAttribute("x", x1); lab.setAttribute("y", y1 + 3.5); }
    });
  }
  const relayout = () => document.querySelectorAll(".plate-scene").forEach(layoutLeaders);
  addEventListener("resize", relayout); setTimeout(relayout, 60); document.fonts && document.fonts.ready.then(relayout);

  // the demo GIF for the current mode; a still from this site while it loads, and if GitHub is slow
  // the reel for the current mode: a still first, the GIF once it has loaded and the scene is on screen
  function loadShots() {
    const m = mode() === "film" ? "dark" : "light";
    document.querySelectorAll(".plate-scene").forEach(sec => {
      const img = sec.querySelector(".specimen img");
      const still = img.dataset.still.replace("{m}", m), gif = img.dataset.src.replace("{m}", m);
      img.src = still; img.dataset.gif = gif;
      const pre = new Image(); pre.onload = () => { if (img.dataset.gif === gif) img.src = gif; }; pre.src = gif;
    });
  }
  new MutationObserver(loadShots).observe(root, { attributes: true, attributeFilter: ["data-mode"] });
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
    if (en.isIntersecting) { en.target.classList.add("on"); active = i; railLinks.forEach((l, k) => l.classList.toggle("on", k === i)); history.replaceState(null, "", "#" + en.target.id); }
  }), { root: reel, threshold: .55 });
  scenes.forEach(s => io.observe(s));
  // belt and braces: after any scroll settles, the scene under the viewport is on
  function markActive() {
    const i = Math.max(0, Math.min(scenes.length - 1, Math.round(reel.scrollTop / Math.max(1, reel.clientHeight))));
    scenes[i].classList.add("on"); active = i; railLinks.forEach((l, k) => l.classList.toggle("on", k === i));
  }
  let settle; reel.addEventListener("scroll", () => { clearTimeout(settle); settle = setTimeout(markActive, 90); }, { passive: true });
  setTimeout(markActive, 120); setTimeout(markActive, 600);
  const blink = document.createElement("div"); blink.className = "blink"; document.body.appendChild(blink);
  const spot = document.createElement("div"); spot.className = "spot"; document.body.appendChild(spot);
  let lastActive = -1;
  const blinkIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { const i = scenes.indexOf(en.target); if (lastActive >= 0 && i !== lastActive && !reduce) { blink.classList.remove("go"); void blink.offsetWidth; blink.classList.add("go"); } lastActive = i; } }), { root: reel, threshold: .55 });
  scenes.forEach(s => blinkIO.observe(s));
  addEventListener("pointermove", e => { spot.style.setProperty("--sx", e.clientX + "px"); spot.style.setProperty("--sy", e.clientY + "px"); }, { passive: true });
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
      feed.innerHTML = rows.length ? rows.map((x, i) => `<li>
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
    const el = document.getElementById("day"); if (el) el.textContent = `DAY ${day} · W${w} · `; })();

  /* ---------- credits roll ---------- */
  const roll = document.getElementById("roll"); const inner = document.createElement("div"); inner.className = "roll-inner";
  while (roll.firstChild) inner.appendChild(roll.firstChild); roll.appendChild(inner);

  /* ---------- hero: ECG → prism → eight bands, driven by the pointer and by scroll ---------- */
  const cv = document.getElementById("pulse"), ctx = cv.getContext("2d");
  const bands = document.getElementById("bands");
  PLUGINS.forEach(p => { const li = document.createElement("li"); li.style.setProperty("--c", p.c); li.innerHTML = `<a href="#${p.slug}">${p.name}</a>`; bands.appendChild(li); });
  const bandEls = [...bands.children];
  let W = 0, H = 0, mouse = { x: -1, y: -1 }, t0 = performance.now(), smoothY = null, scrollK = 0;
  function size() { const dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  addEventListener("resize", size); size();
  const hero = document.getElementById("i");
  hero.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1; });
  reel.addEventListener("scroll", () => { scrollK = Math.min(1, reel.scrollTop / Math.max(1, H)); }, { passive: true });
  const css = () => getComputedStyle(root);
  function ecgY(u) {
    if (u < .28) return 0; if (u < .33) return -(u - .28) / .05 * 10; if (u < .38) return -10 + (u - .33) / .05 * 10; if (u < .44) return 0;
    if (u < .48) return -(u - .44) / .04 * 70; if (u < .54) return -70 + (u - .48) / .06 * 120; if (u < .59) return 50 - (u - .54) / .05 * 68; if (u < .63) return -18 + (u - .59) / .04 * 18;
    if (u < .72) return 0; if (u < .84) return -Math.sin((u - .72) / .12 * Math.PI) * 20; return 0;
  }
  function draw(now) {
    const dark = mode() === "film", ink = css().getPropertyValue("--m-ink").trim(), mute = css().getPropertyValue("--m-mute").trim();
    ctx.clearRect(0, 0, W, H);
    const wide = W > 860, baseY = H * (wide ? .5 : .8);
    const targetY = mouse.y > 0 && wide ? Math.min(H * .78, Math.max(H * .22, mouse.y)) : baseY;
    smoothY = smoothY == null ? baseY : smoothY + (targetY - smoothY) * .08;
    const x0 = wide ? W * .50 : 16, px = wide ? W * .74 : W * .42, h = Math.min(wide ? 220 : 150, H * .34) * (1 + scrollK * .6);
    const speed = reduce ? 0 : (now - t0) / 1000;
    // the pulse, beating faster the further you have scrolled
    ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = ink; ctx.beginPath();
    for (let x = x0; x <= px - h * .36; x += 2) {
      const u = (((x + speed * (110 + scrollK * 160)) / 420) % 1 + 1) % 1, y = smoothY + ecgY(u) * (h / 220);
      x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    const cx = px, cy = smoothY;
    ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy - h * .58); ctx.lineTo(cx + h * .5, cy + h * .36); ctx.lineTo(cx - h * .5, cy + h * .36); ctx.closePath(); ctx.stroke();
    ctx.globalAlpha = .35; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - h * .1, cy + h * .05); ctx.lineTo(cx + h * .18, cy - h * .18); ctx.lineTo(cx + h * .24, cy + h * .18); ctx.stroke(); ctx.globalAlpha = 1;
    // bands open wider as you scroll towards the plates
    const ex = cx + h * .32, spread = Math.min(H * .5, 300) * (1 + scrollK * 1.2), endX = W - (wide ? 28 : 10);
    PLUGINS.forEach((p, i) => {
      const y1 = cy - spread / 2 + (i + .5) * (spread / 8), thick = spread / 8 * .78;
      ctx.beginPath(); ctx.moveTo(ex, cy - 4 + i); ctx.lineTo(endX, y1 - thick / 2); ctx.lineTo(endX, y1 + thick / 2); ctx.lineTo(ex, cy - 3 + i); ctx.closePath();
      ctx.fillStyle = p.c; ctx.globalAlpha = (dark ? .92 : .84) - scrollK * .3; ctx.fill(); ctx.globalAlpha = 1;
      const el = bandEls[i]; if (wide) { el.style.left = (endX - 190) + "px"; el.style.top = (y1 - 12) + "px"; }
      el.classList.toggle("on", mouse.x > ex && Math.abs(mouse.y - y1) < spread / 16);
    });
    ctx.fillStyle = mute; ctx.font = "500 10px " + css().getPropertyValue("--f-label"); ctx.textAlign = "center"; ctx.fillText("E I G H T   T O O L S", cx, cy + h * .36 + 26);
    if (!reduce) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  if (reduce) new MutationObserver(() => requestAnimationFrame(draw)).observe(root, { attributes: true });
})();
