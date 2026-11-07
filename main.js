/* Rex — rexxall.github.io. Vanilla, no build step. */
(function () {
  const PLUGINS = [
    { slug: "git-note-history", name: "Git Note History", line: "Find a sentence you deleted. Take back only that part.", what: "one sentence, not the file", c: "#7a5af0", roman: "II",
      desc: "Every save is a Git commit. Search any sentence you ever wrote, see where it was deleted, and take back just that part, with nothing else touched.", dir: "git-note-history", repo: "obsidian-git-history-view" },
    { slug: "ai-assistant-suite", name: "AI Assistant Suite", line: "AI suggests title, tags and folder. You tick what to apply.", what: "proposed, never applied", c: "#0a84ff", roman: "III",
      desc: "Title, tags, folder, summary and related notes, proposed by a model you choose. Nothing changes until you tick it.", dir: "ai-assistant-suite", repo: "obsidian-ai-assistant-suite" },
    { slug: "polyglot-helper", name: "Polyglot Helper", line: "Look up Japanese and English words, keep them for review.", what: "kept for review", c: "#30b0c7", roman: "IV",
      desc: "Select a word, get the reading and meaning in place, and keep it in a review list that lives in your vault.", dir: "polyglot-helper", repo: "obsidian-polyglot-helper" },
    { slug: "video-summary", name: "Video Summary", line: "A video link in, a finished note out.", what: "a note, not a transcript", c: "#ff375f", roman: "V",
      desc: "Paste a YouTube or Bilibili link. You get a structured note with key points and timestamps that jump back into the video.", dir: "video-summary", repo: "obsidian-video-summary" },
    { slug: "japan-work-secretary", name: "Japan Work Secretary", line: "Part-time shifts in Japan, warned before 28 hours.", what: "warned at 28 h", c: "#ff9f0a", roman: "VI",
      desc: "Log shifts, see the week's hours against the 28-hour student limit, and get warned before you cross it.", dir: "japan-work-secretary", repo: "japan-work-secretary" },
    { slug: "ai-accounting", name: "AI Accounting", line: "A receipt in, a checked ledger entry out.", what: "checked before it lands", c: "#34c759", roman: "VII",
      desc: "Photograph a receipt. The entry is read, totalled and shown for you to check before it lands in your ledger.", dir: "ai-accounting", repo: "obsidian-ai-accounting" },
    { slug: "pass-countdown", name: "Pass Countdown", line: "Uses left, time left, and the pace to finish.", what: "the pace to finish", c: "#5e5ce6", roman: "VIII",
      desc: "For gym passes, lesson tickets, anything with uses and an expiry: how many left, how long left, and the pace you need to finish.", dir: "pass-countdown", repo: "obsidian-pass-countdown" },
    { slug: "tasknotes-countdown", name: "TaskNotes Countdown", line: "Deadlines from TaskNotes, and whether you will make it.", what: "will you make it", c: "#bf5af2", roman: "IX",
      desc: "Reads your TaskNotes deadlines and shows each as a countdown with the pace you are on.", dir: "tasknotes-countdown", repo: "tasknotes-countdown" },
  ];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mode ---------- */
  const modeBtn = document.getElementById("mode");
  function setMode(m) {
    root.dataset.mode = m;
    try { localStorage.setItem("mode", m); } catch (e) {}
    modeBtn.setAttribute("aria-pressed", String(m === "film"));
  }
  modeBtn.addEventListener("click", () => {
    const next = root.dataset.mode === "film" ? "atlas" : "film";
    // flip every plate while the colours change
    if (!reduce) document.querySelectorAll(".card").forEach((c, i) => { c.classList.add("flip"); setTimeout(() => c.classList.remove("flip"), 700 + i * 40); });
    setMode(next);
  });
  modeBtn.setAttribute("aria-pressed", String(root.dataset.mode === "film"));

  /* ---------- plates ---------- */
  const grid = document.getElementById("grid");
  const rough = (x0, y0, x1, y1, seed) => {
    let s = seed, r = () => ((s = (s * 9301 + 49297) % 233280) / 233280 - .5) * 1.2;
    const pts = [];
    const edge = (ax, ay, bx, by) => { for (let i = 0; i < 14; i++) { const t = i / 14; pts.push([ax + (bx - ax) * t + r(), ay + (by - ay) * t + r()]); } };
    edge(x0, y0, x1, y0); edge(x1, y0, x1, y1); edge(x1, y1, x0, y1); edge(x0, y1, x0, y0);
    return "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + " Z";
  };
  PLUGINS.forEach((p, i) => {
    const li = document.createElement("li");
    li.className = "card"; li.id = p.slug; li.style.setProperty("--c", p.c);
    li.innerHTML = `
      <div class="card-in">
        <div class="face front">
          <div class="hd"><span class="num">FIG. ${p.roman}</span><span class="file">ITH_PLATE_${p.roman}</span></div>
          <div class="holes" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="specimen"><img src="assets/${p.slug}-light.jpg" alt="${p.name} inside Obsidian" loading="lazy" decoding="async"></div>
          <svg class="frame" viewBox="0 0 1128 715" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="${rough(4, 4, 1124, 711, i + 7)}"/></svg>
          <svg class="leader" viewBox="0 0 900 560" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength="1" d="M${430 + (i % 3) * 20} ${150 + (i % 2) * 60} C 520 ${120 + (i % 2) * 60}, 560 ${150}, 620 150 H 648"/>
            <circle cx="${430 + (i % 3) * 20}" cy="${150 + (i % 2) * 60}" r="3.2"/>
          </svg>
          <div class="what"><span class="k">What it does</span><p class="hand">${p.what}</p></div>
          <div class="name"><h3>${p.name}</h3><p>${p.line}</p></div>
          <span class="sign" aria-hidden="true">R.</span>
          <button class="flipbtn" type="button" aria-label="Turn the plate over">↻</button>
        </div>
        <div class="face back">
          <div class="hd"><span class="num">FIG. ${p.roman}</span><span class="file">VERSO</span></div>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <p class="links"><a class="btn" href="https://obsidian.md/plugins?id=${p.dir}">Install in Obsidian</a><a href="https://github.com/Rexxall/${p.repo}">code</a></p>
          <button class="flipbtn" type="button" aria-label="Turn the plate back">↺</button>
        </div>
      </div>`;
    grid.appendChild(li);
  });
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".flipbtn"); if (!b) return;
    b.closest(".card").classList.toggle("flip");
  });
  // film mode swaps the screenshot for its dark twin
  const swapShots = () => document.querySelectorAll(".specimen img").forEach(img => {
    img.src = img.src.replace(/-(light|dark)\.jpg$/, root.dataset.mode === "film" ? "-dark.jpg" : "-light.jpg");
  });
  new MutationObserver(swapShots).observe(root, { attributes: true, attributeFilter: ["data-mode"] });
  swapShots();
  // draw the frame and leader when a plate scrolls in
  const io = new IntersectionObserver((es) => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("seen"); io.unobserve(en.target); } }), { threshold: .35 });
  document.querySelectorAll(".card").forEach(c => io.observe(c));

  /* ---------- credits roll ---------- */
  const roll = document.getElementById("roll");
  const inner = document.createElement("div"); inner.className = "roll-inner";
  while (roll.firstChild) inner.appendChild(roll.firstChild);
  roll.appendChild(inner);

  /* ---------- hero: ECG → prism → eight bands ---------- */
  const cv = document.getElementById("pulse"), ctx = cv.getContext("2d");
  const bands = document.getElementById("bands");
  PLUGINS.forEach(p => {
    const li = document.createElement("li"); li.style.setProperty("--c", p.c);
    li.innerHTML = `<a href="#${p.slug}">${p.name}</a>`; bands.appendChild(li);
  });
  const bandEls = [...bands.children];
  let W = 0, H = 0, dpr = 1, mouse = { x: -1, y: -1 }, t0 = performance.now();
  function size() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", size); size();
  cv.parentElement.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  cv.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1; });
  const css = () => getComputedStyle(root);
  function ecgY(u) { // one heartbeat over u in [0,1]
    if (u < .28) return 0;
    if (u < .33) return -(u - .28) / .05 * 10;
    if (u < .38) return -10 + (u - .33) / .05 * 10;
    if (u < .44) return 0;
    if (u < .48) return -(u - .44) / .04 * 70;
    if (u < .54) return -70 + (u - .48) / .06 * 120;
    if (u < .59) return 50 - (u - .54) / .05 * 68;
    if (u < .63) return -18 + (u - .59) / .04 * 18;
    if (u < .72) return 0;
    if (u < .84) return -Math.sin((u - .72) / .12 * Math.PI) * 20;
    return 0;
  }
  let smoothY = null;
  function draw(now) {
    const dark = root.dataset.mode === "film";
    const ink = css().getPropertyValue("--m-ink").trim(), mute = css().getPropertyValue("--m-mute").trim();
    ctx.clearRect(0, 0, W, H);
    const wide = W > 720;
    const baseY = H * (wide ? .5 : .78);
    const targetY = mouse.y > 0 && wide ? Math.min(H * .8, Math.max(H * .2, mouse.y)) : baseY;
    smoothY = smoothY == null ? baseY : smoothY + (targetY - smoothY) * .08;
    const x0 = wide ? W * .50 : 24, px = wide ? W * .74 : W * .62, prismH = Math.min(190, H * .32);
    const speed = reduce ? 0 : (now - t0) / 1000;
    // the line: beats scroll leftwards, 1 beat per 420 px
    ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = ink; ctx.beginPath();
    for (let x = x0; x <= px - prismH * .36; x += 2) {
      const u = (((x + speed * 110) / 420) % 1 + 1) % 1;
      const y = smoothY + ecgY(u) * (prismH / 190);
      x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // the prism
    const cx = px, cy = smoothY, h = prismH;
    ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(cx, cy - h * .58); ctx.lineTo(cx + h * .5, cy + h * .36); ctx.lineTo(cx - h * .5, cy + h * .36); ctx.closePath(); ctx.stroke();
    ctx.globalAlpha = .35; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - h * .1, cy + h * .05); ctx.lineTo(cx + h * .18, cy - h * .18); ctx.lineTo(cx + h * .24, cy + h * .18); ctx.stroke(); ctx.globalAlpha = 1;
    // eight bands out of the right face
    const ex = cx + h * .32, exitY = cy;
    const spread = Math.min(H * .42, 260), endX = W - (wide ? 28 : 12);
    PLUGINS.forEach((p, i) => {
      const y1 = exitY - spread / 2 + (i + .5) * (spread / 8), thick = spread / 8 * .78;
      ctx.beginPath(); ctx.moveTo(ex, exitY - 4 + i * 1); ctx.lineTo(endX, y1 - thick / 2); ctx.lineTo(endX, y1 + thick / 2); ctx.lineTo(ex, exitY - 3 + i * 1); ctx.closePath();
      ctx.fillStyle = p.c; ctx.globalAlpha = dark ? .9 : .82; ctx.fill(); ctx.globalAlpha = 1;
      const el = bandEls[i]; if (wide) { el.style.left = (endX - 180) + "px"; el.style.top = (y1 - 12) + "px"; el.style.right = "auto"; }
      const near = mouse.x > ex && Math.abs(mouse.y - y1) < spread / 16;
      el.classList.toggle("on", near);
    });
    // a faint caption under the prism
    ctx.fillStyle = mute; ctx.font = "500 10px " + css().getPropertyValue("--f-label"); ctx.textAlign = "center";
    ctx.fillText("E I G H T   T O O L S", cx, cy + h * .36 + 26);
    if (!reduce) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  if (reduce) { new MutationObserver(() => requestAnimationFrame(draw)).observe(root, { attributes: true }); }
})();
