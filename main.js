/* Rex — rexxall.github.io. Vanilla, no build step. */
(function () {
  const RAW = "https://raw.githubusercontent.com/Rexxall/";
  // notes: three labels around the lens; red: the one that gets the red circle
  const PLUGINS = [
    { slug: "git-note-history", name: "Git Note History", line: "Find a sentence you deleted. Take back only that part.", roman: "II", dir: "git-note-history", repo: "obsidian-git-history-view", red: 2,
      notes: [["every save", "is a commit"], ["search", "any sentence you ever wrote"], ["take back", "one line, not the file"]] },
    { slug: "ai-assistant-suite", name: "AI Assistant Suite", line: "AI suggests title, tags and folder. You tick what to apply.", roman: "III", dir: "ai-assistant-suite", repo: "obsidian-ai-assistant-suite", red: 2,
      notes: [["proposed", "title · tags · folder"], ["your model", "pick one, or none"], ["applied", "only when you tick"]] },
    { slug: "polyglot-helper", name: "Polyglot Helper", line: "Look up Japanese and English words, keep them for review.", roman: "IV", dir: "polyglot-helper", repo: "obsidian-polyglot-helper", red: 0,
      notes: [["select a word", "reading in place"], ["two languages", "same gesture"], ["kept", "a review list in your vault"]] },
    { slug: "video-summary", name: "Video Summary", line: "A video link in, a finished note out.", roman: "V", dir: "video-summary", repo: "obsidian-video-summary", red: 2,
      notes: [["paste", "a YouTube or Bilibili link"], ["key points", "with timestamps"], ["a note", "not a transcript"]] },
    { slug: "japan-work-secretary", name: "Japan Work Secretary", line: "Part-time shifts in Japan, warned before 28 hours.", roman: "VI", dir: "japan-work-secretary", repo: "japan-work-secretary", red: 2,
      notes: [["one line", "log a shift"], ["the week", "against the 28-hour limit"], ["warned", "before you cross it"]] },
    { slug: "ai-accounting", name: "AI Accounting", line: "A receipt in, a checked ledger entry out.", roman: "VII", dir: "ai-accounting", repo: "obsidian-ai-accounting", red: 2,
      notes: [["photograph", "a receipt"], ["read", "and totalled"], ["checked", "before it lands"]] },
    { slug: "pass-countdown", name: "Pass Countdown", line: "Uses left, time left, and the pace to finish.", roman: "VIII", dir: "pass-countdown", repo: "obsidian-pass-countdown", red: 2,
      notes: [["uses left", "how many rides remain"], ["time left", "until the pass runs out"], ["the pace", "to use them all"]] },
    { slug: "tasknotes-countdown", name: "TaskNotes Countdown", line: "Deadlines from TaskNotes, and whether you will make it.", roman: "IX", dir: "tasknotes-countdown", repo: "tasknotes-countdown", red: 2,
      notes: [["reads", "your TaskNotes deadlines"], ["counts down", "one for each"], ["will you", "make it?"]] },
  ];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reel = document.getElementById("reel");
  const CIRC = `<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M8 22 C 6 8, 40 2, 60 4 C 86 6, 98 14, 94 24 C 90 36, 50 40, 26 36 C 10 33, 4 28, 8 22"/></svg>`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  /* ---------- mood ---------- */
  const moodBtns = [...document.querySelectorAll(".moods button")];
  const dark = () => root.dataset.mood === "tense" || root.dataset.mood === "night";
  function setMood(m, save) {
    root.dataset.mood = m;
    if (save) try { localStorage.setItem("mood", m); } catch (e) {}
    moodBtns.forEach(b => b.setAttribute("aria-checked", String(b.dataset.m === m)));
    loadShots();
  }
  moodBtns.forEach(b => b.addEventListener("click", () => setMood(b.dataset.m, true)));

  /* ---------- plugin stages ---------- */
  const anchor = document.getElementById("x");
  const sides = ["a", "b", "c"];
  PLUGINS.forEach(p => {
    const sec = document.createElement("section");
    sec.className = "scene plate-scene"; sec.id = p.slug;
    sec.innerHTML = `
      <div class="stage">
        <p class="fig">FIG. ${p.roman} · OBSIDIAN PLUGIN</p>
        <h2 class="big">${esc(p.name)}</h2>
        <p class="en">${esc(p.line)}</p>
        <span class="file">REX_PLATE_${p.roman}</span>
        <div class="lens">
          <span class="halo" aria-hidden="true"></span>
          <span class="orbit" aria-hidden="true"></span>
          <div class="glass"><img data-src="${RAW}${p.repo}/main/assets/readme/demo-{m}.gif" data-still="assets/${p.slug}-{m}.jpg" alt="${esc(p.name)} in use" decoding="async"></div>
          <span class="ink" aria-hidden="true"></span>
        </div>
        ${p.notes.map(([k, v], j) => `<div class="an ${sides[j]}"><b>${String.fromCharCode(65 + j)} · ${esc(k)}</b><p>${j === p.red ? `<em class="circled">${esc(v)}${CIRC}</em>` : esc(v)}</p></div>`).join("")}
        <div class="acts"><a class="go" href="https://obsidian.md/plugins?id=${p.dir}">install in Obsidian →</a><a class="go quiet" href="https://github.com/Rexxall/${p.repo}">code</a></div>
      </div>
      <span class="tab" aria-hidden="true">${p.roman}</span>
      <span class="sign" aria-hidden="true">R.</span>`;
    anchor.before(sec);
  });
  // the first plugin is #ii for the nav
  const firstPlate = document.getElementById(PLUGINS[0].slug); firstPlate.insertAdjacentHTML("afterbegin", '<span id="ii" style="position:absolute;top:0"></span>');

  // hero: one card per plugin
  const ticks = document.getElementById("ticks");
  PLUGINS.forEach(p => { const li = document.createElement("li"); li.innerHTML = `<a href="#${p.slug}"><b>${p.roman}</b><small>${esc(p.name)}</small></a>`; ticks.appendChild(li); });

  // the red English line sits under however tall the name came out
  function placeEn() {
    document.querySelectorAll(".stage").forEach(st => { const b = st.querySelector(".big"); if (b) st.style.setProperty("--bigh", b.offsetHeight + "px"); });
  }
  addEventListener("resize", placeEn); placeEn(); document.fonts && document.fonts.ready.then(placeEn);

  /* ---------- the picture in each lens follows the mood: dark reel for tense and night ---------- */
  function loadShots() {
    const m = dark() ? "dark" : "light";
    document.querySelectorAll(".plate-scene .glass img").forEach(img => {
      img.src = img.dataset.still.replace("{m}", m);
      const gif = img.dataset.src.replace("{m}", m); img.dataset.gif = gif;
      const pre = new Image(); pre.onload = () => { if (img.dataset.gif === gif) img.src = gif; }; pre.src = gif;
    });
    document.querySelectorAll("#webglass img").forEach(img => { img.src = img.dataset.still; });
  }
  setMood(root.dataset.mood, false);

  /* ---------- web: the lens turns through the three apps, the label of the one in view lights up ---------- */
  const wimgs = [...document.querySelectorAll("#webglass img")], wans = [...document.querySelectorAll(".web-an")];
  let wk = 0; const showWeb = k => { wk = k; wimgs.forEach((im, i) => im.classList.toggle("cur", i === k)); wans.forEach((a, i) => a.classList.toggle("cur", i === k)); };
  showWeb(0);
  let wtimer = null;
  wans.forEach((a, i) => { a.addEventListener("mouseenter", () => { clearInterval(wtimer); wtimer = null; showWeb(i); }); a.addEventListener("focus", () => showWeb(i)); });

  /* ---------- scenes ---------- */
  const scenes = [...document.querySelectorAll(".scene")];
  let active = 0;
  function activate(i) {
    active = i; scenes[i].classList.add("on");
    const web = scenes[i].id === "x";
    if (web && !wtimer && !reduce) wtimer = setInterval(() => showWeb((wk + 1) % 3), 3600);
    if (!web && wtimer) { clearInterval(wtimer); wtimer = null; }
  }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { activate(scenes.indexOf(en.target)); history.replaceState(null, "", "#" + en.target.id); } }), { root: reel, threshold: .55 });
  scenes.forEach(s => io.observe(s));
  function markActive() { if (innerWidth <= 860) { scenes.forEach(s => s.classList.add("on")); return; } activate(Math.max(0, Math.min(scenes.length - 1, Math.round(reel.scrollTop / Math.max(1, reel.clientHeight))))); }
  let settle; reel.addEventListener("scroll", () => { clearTimeout(settle); settle = setTimeout(markActive, 90); }, { passive: true });
  setTimeout(markActive, 120); setTimeout(markActive, 600);
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const t = document.getElementById(a.getAttribute("href").slice(1)); if (!t) return;
    e.preventDefault(); (t.closest(".scene") || t).scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });
  addEventListener("keydown", e => {
    if (e.target.matches("input, textarea, button")) return;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); scenes[Math.min(scenes.length - 1, active + 1)].scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
    if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); scenes[Math.max(0, active - 1)].scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
  });
  if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) { reel.style.scrollBehavior = "auto"; (t.closest(".scene") || t).scrollIntoView({ behavior: "instant" }); setTimeout(() => { reel.style.scrollBehavior = ""; }, 80); } }

  /* ---------- lab notes: live from GitHub ---------- */
  (async () => {
    const feed = document.getElementById("feed");
    try {
      const r = await fetch("https://api.github.com/users/Rexxall/events/public?per_page=60", { headers: { Accept: "application/vnd.github+json" } });
      const ev = (await r.json()).filter(e => e.type === "PushEvent" && e.repo.name.startsWith("Rexxall/"));
      const seen = new Map();
      ev.forEach(e => { const k = e.repo.name; if (!seen.has(k)) seen.set(k, { repo: k.split("/")[1], at: new Date(e.created_at) }); });
      const rows = [...seen.values()].slice(0, 6);
      const rel = d => { const h = Math.round((Date.now() - d) / 36e5); return h < 1 ? "just now" : h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago`; };
      const fmt = d => `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
      feed.innerHTML = rows.length ? rows.map((x, i) => `<li class="w"><span class="lab${i === 0 ? " new" : ""}">${rel(x.at)}</span><i class="d">${fmt(x.at)}</i><a href="https://github.com/Rexxall/${esc(x.repo)}">${esc(x.repo)}</a></li>`).join("")
        : `<li class="w"><span class="lab">a quiet week</span><a href="https://github.com/Rexxall">github.com/Rexxall</a></li>`;
    } catch (e) {
      feed.innerHTML = `<li class="w"><span class="lab">GitHub did not answer</span><a href="https://github.com/Rexxall">the log is at github.com/Rexxall</a></li>`;
    }
  })();

  // the plate carries today's number, the way the diary does
  (() => { const d = new Date(), day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    const w = Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 864e5 + new Date(d.getFullYear(), 0, 1).getDay() + 1) / 7);
    document.getElementById("day").textContent = `DAY ${day} · W${w} · `;
    document.getElementById("stamp").textContent = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`; })();

  /* ---------- today's line on the verse slip, a different one each visit ---------- */
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
  ];
  (() => { const v = VERSES[Math.floor(Math.random() * VERSES.length)];
    document.querySelector(".slip-en").textContent = v[0]; document.querySelector(".slip-zh").textContent = v[1]; document.querySelector(".slip-by").textContent = "— " + v[2]; })();

  /* ---------- hero lens: a monitor trace, beating faster the further you scroll ---------- */
  const cv = document.getElementById("pulse"), ctx = cv.getContext("2d");
  let W = 0, H = 0, t0 = performance.now(), scrollK = 0;
  function size() { const dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  addEventListener("resize", size); size();
  reel.addEventListener("scroll", () => { scrollK = Math.min(1, reel.scrollTop / Math.max(1, reel.clientHeight)); }, { passive: true });
  const css = n => getComputedStyle(root).getPropertyValue(n).trim();
  function ecgY(u) {
    if (u < .28) return 0; if (u < .33) return -(u - .28) / .05 * 10; if (u < .38) return -10 + (u - .33) / .05 * 10; if (u < .44) return 0;
    if (u < .48) return -(u - .44) / .04 * 70; if (u < .54) return -70 + (u - .48) / .06 * 120; if (u < .59) return 50 - (u - .54) / .05 * 68; if (u < .63) return -18 + (u - .59) / .04 * 18;
    if (u < .72) return 0; if (u < .84) return -Math.sin((u - .72) / .12 * Math.PI) * 20; return 0;
  }
  function draw(now) {
    if (!W) size();
    const ink = css("--ink"), acc = css("--acc");
    ctx.clearRect(0, 0, W, H);
    // a faint grid, like monitor paper
    ctx.strokeStyle = ink; ctx.globalAlpha = .07; ctx.lineWidth = 1; ctx.beginPath();
    for (let g = 0; g <= W; g += W / 12) { ctx.moveTo(g, 0); ctx.lineTo(g, H); ctx.moveTo(0, g); ctx.lineTo(W, g); }
    ctx.stroke(); ctx.globalAlpha = 1;
    const y0 = H * .54, amp = H * .0042, sp = reduce ? 0 : (now - t0) / 1000, period = W * .62;
    const head = reduce ? W * .82 : ((sp * (W * .28) * (1 + scrollK * .8)) % (W * 1.1)) - W * .05;
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
    // trace fades behind the sweeping head, like a phosphor monitor
    for (let x = 0; x < W; x += 2) {
      const age = ((head - x) % W + W) % W / W;
      const u = ((x / period) % 1 + 1) % 1, y = y0 + ecgY(u) * amp * 1.4;
      const u2 = (((x + 2) / period) % 1 + 1) % 1, y2 = y0 + ecgY(u2) * amp * 1.4;
      ctx.strokeStyle = ink; ctx.globalAlpha = Math.max(0, 1 - age * 1.15);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2, y2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (head > 0 && head < W) { const u = ((head / period) % 1 + 1) % 1; ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(head, y0 + ecgY(u) * amp * 1.4, 3.5, 0, Math.PI * 2); ctx.fill(); }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
