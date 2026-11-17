#!/usr/bin/env python3
"""Daily download counts for the site.

Reads Obsidian's public stats file and each repository's latest release,
writes data/stats.json (small, same-origin) and bakes the numbers into
index.html so the first paint never waits on the network.
If a source fails or a plugin is missing from it, the last good value is kept
together with the date it was last seen.
"""
import datetime as dt
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "stats.json")
HIST = os.path.join(ROOT, "data", "history.json")
INDEX = os.path.join(ROOT, "index.html")
STATS_URL = "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json"

PLUGINS = [  # id in the Obsidian directory, GitHub repository
    ("video-summary", "obsidian-video-summary"),
    ("ai-assistant-suite", "obsidian-ai-assistant-suite"),
    ("git-note-history", "obsidian-git-history-view"),
    ("ai-accounting", "obsidian-ai-accounting"),
    ("polyglot-helper", "obsidian-polyglot-helper"),
    ("japan-work-secretary", "japan-work-secretary"),
    ("pass-countdown", "obsidian-pass-countdown"),
    ("tasknotes-countdown", "tasknotes-countdown"),
]


def get(url, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": "rexxall-site-stats"})
    tok = os.environ.get("GITHUB_TOKEN")
    if tok and url.startswith("https://api.github.com/"):
        req.add_header("Authorization", "Bearer " + tok)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def vkey(v):
    return [int(p) if p.isdigit() else -1 for p in re.split(r"[.\-+]", v)]


def main():
    now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
    today = now.date().isoformat()
    prev = {}
    if os.path.exists(OUT):
        with open(OUT) as f:
            prev = {p["id"]: p for p in json.load(f).get("plugins", [])}

    try:
        stats = json.loads(get(STATS_URL))
        src_ok = True
    except Exception as e:  # keep yesterday's numbers
        print("stats file unavailable:", e, file=sys.stderr)
        stats, src_ok = {}, False

    plugins = []
    for pid, repo in PLUGINS:
        old = prev.get(pid, {})
        entry = {"id": pid, "repo": repo}
        s = stats.get(pid)
        if s and isinstance(s.get("downloads"), int):
            vers = sorted((k for k in s if k[:1].isdigit()), key=vkey)
            entry.update(downloads=s["downloads"], versions=[[v, s[v]] for v in vers], seen=today)
        elif old.get("downloads") is not None:
            entry.update(downloads=old["downloads"], versions=old.get("versions", []), seen=old.get("seen"))
        else:
            entry.update(downloads=None, versions=[], seen=None)
        try:
            rel = json.loads(get(f"https://api.github.com/repos/Rexxall/{repo}/releases/latest", 30))
            entry["latest"] = {"tag": rel.get("tag_name"), "date": (rel.get("published_at") or "")[:10]}
        except Exception:
            if old.get("latest"):
                entry["latest"] = old["latest"]
        plugins.append(entry)

    total = sum(p["downloads"] or 0 for p in plugins)
    data = {
        "fetchedAt": now.isoformat().replace("+00:00", "Z"),
        "source": STATS_URL,
        "sourceOk": src_ok,
        "unit": "downloads (every install and update, not people)",
        "total": total,
        "plugins": plugins,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(data, f, separators=(",", ":"))

    hist = []
    if os.path.exists(HIST):
        with open(HIST) as f:
            hist = json.load(f)
    hist = [h for h in hist if h.get("date") != today]
    hist.append({"date": today, "total": total, **{p["id"]: p["downloads"] for p in plugins}})
    with open(HIST, "w") as f:
        json.dump(hist, f, separators=(",", ":"))

    # bake into index.html: <!--dl:id-->123<!--/dl--> and <!--dl:total-->…, <!--fetched-->…
    with open(INDEX) as f:
        html = f.read()
    for p in plugins:
        if p["downloads"] is not None:
            html = re.sub(rf"(<!--dl:{p['id']}-->)[^<]*(<!--/dl-->)", rf"\g<1>{p['downloads']:,}\g<2>", html)
            html = re.sub(rf'(data-id="{p["id"]}"[^>]*data-d=")\d+(")', rf"\g<1>{p['downloads']}\g<2>", html)
    tnc = next((p for p in plugins if p["id"] == "tasknotes-countdown"), None)
    if tnc and tnc["downloads"] is not None:
        digits = "".join(f"<i>{c}</i>" for c in str(tnc["downloads"]))
        html = re.sub(r'(<span class="flap" aria-hidden="true">).*?(</span>)', rf"\g<1>{digits}\g<2>", html)
    html = re.sub(r"(<!--dl:total-->)[^<]*(<!--/dl-->)", rf"\g<1>{total:,}\g<2>", html)
    stamp = now.strftime("%-d %b %Y, %H:%M UTC")
    html = re.sub(r"(<!--fetched-->)[^<]*(<!--/fetched-->)", rf"\g<1>{stamp}\g<2>", html)
    html = re.sub(r'(<time datetime=")[^"]*(" id="fetched")', rf"\g<1>{data['fetchedAt']}\g<2>", html)
    with open(INDEX, "w") as f:
        f.write(html)
    print("total", total, "source ok" if src_ok else "source failed, kept last values")


if __name__ == "__main__":
    main()
