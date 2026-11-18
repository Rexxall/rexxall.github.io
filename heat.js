/* One year of GitHub activity as a grid: a column per week, darker = busier. Used on / and /research/. */
window.drawHeat = (heat, hcap, url) => {
  if (!heat) return;
  fetch(url).then(r => r.json()).then(a => {
    let days = a.days;
    const weeksShown = matchMedia("(max-width: 600px)").matches ? 26 : 53;
    const pad = new Date(days[0][0] + "T00:00:00Z").getUTCDay();          // Sunday-first columns
    let cells = Array(pad).fill(null).concat(days);
    cells = cells.slice(Math.max(0, cells.length - weeksShown * 7 - (cells.length % 7 ? 7 - cells.length % 7 : 0)));
    const nz = days.map(d => d[1]).filter(Boolean).sort((x, y) => x - y);
    const q = k => nz[Math.floor((nz.length - 1) * k)] || 1, cuts = [q(.25), q(.5), q(.75)];
    let html = "", lastMonth = "";
    for (let i = 0; i < cells.length; i += 7) {
      const first = cells.slice(i, i + 7).find(Boolean);
      const m = first ? new Date(first[0] + "T00:00:00Z").toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }) : "";
      html += `<em style="grid-column:${i / 7 + 1}">${m && m !== lastMonth && new Date(first[0]).getUTCDate() <= 7 ? m : ""}</em>`;
      if (first) lastMonth = m;
      for (let k = 0; k < 7; k++) {
        const c = cells[i + k];
        if (!c) { html += `<i class="f" style="grid-column:${i / 7 + 1}"></i>`; continue; }
        const n = c[1], lvl = n ? (n <= cuts[0] ? .3 : n <= cuts[1] ? .5 : n <= cuts[2] ? .72 : 1) : 0;
        html += `<i class="${n ? "" : "z"}" style="grid-column:${i / 7 + 1};--o:${lvl}" title="${c[0]}: ${n}"></i>`;
      }
    }
    heat.style.gridTemplateColumns = `repeat(${Math.ceil(cells.length / 7)},minmax(0,1fr))`;
    heat.innerHTML = html;
    const fmt = d => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    heat.setAttribute("aria-label", `GitHub activity on ${a.active} of ${days.length} days, ${fmt(a.from)} to ${fmt(a.to)}`);
    const shown = cells.filter(Boolean), act = shown.filter(c => c[1]).length, tot = shown.reduce((t, c) => t + c[1], 0);
    hcap.textContent = `Work on GitHub on ${act} of the last ${shown.length} days, public and private repositories together: ${tot.toLocaleString("en")} contributions. The stronger the square, the busier the day.`;
  }).catch(() => { (heat.closest("[data-heat]") || heat).hidden = true; });

};
