(() => {
  const NAMES = {
    "video-summary": "Video Summary", "ai-assistant-suite": "AI Assistant Suite", "git-note-history": "Git Note History",
    "ai-accounting": "AI Accounting", "polyglot-helper": "Polyglot Helper", "japan-work-secretary": "Japan Work Secretary",
    "pass-countdown": "Pass Countdown", "tasknotes-countdown": "TaskNotes Countdown",
  };
  const box = document.getElementById("dl"), cap = document.getElementById("dl-cap");
  fetch("../data/stats.json").then(r => r.json()).then(d => {
    const rows = (Array.isArray(d.plugins) ? d.plugins : Object.entries(d.plugins).map(([id, v]) => ({ id, ...v })))
      .filter(p => NAMES[p.id] && p.downloads != null).sort((a, b) => b.downloads - a.downloads);
    const max = Math.max(...rows.map(p => p.downloads), 1);
    box.innerHTML = rows.map(p => `<div><span>${NAMES[p.id]}</span><i style="--v:${(p.downloads / max).toFixed(3)}"></i><b>${p.downloads}</b></div>`).join("");
    box.setAttribute("aria-label", rows.map(p => `${NAMES[p.id]} ${p.downloads}`).join(", "));
    const when = new Date(d.fetchedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    cap.textContent = `${d.total} downloads in all, from Obsidian’s stats file, last read ${when}.`;
  }).catch(() => { box.hidden = true; });

  window.drawHeat && drawHeat(document.getElementById("heat"), document.getElementById("heat-cap"), "../data/activity.json");

  const v = document.querySelector(".shot video");
  if (v && matchMedia("(max-width: 600px)").matches) {
    v.poster = "../assets/noesis/poster-narrow.jpg"; v.src = "../assets/noesis/demo-narrow.mp4";
    v.width = 960; v.height = 1200; v.parentElement.classList.add("narrow");
  }
  if (v && matchMedia("(prefers-reduced-motion: reduce)").matches) { v.removeAttribute("autoplay"); v.controls = true; }
  document.getElementById("print").addEventListener("click", () => window.print());
})();
