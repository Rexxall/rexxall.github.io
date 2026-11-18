"""Write data/activity.json: one year of GitHub contributions for Rexxall, day by day.

Uses the GraphQL contribution calendar (needs a token: GITHUB_TOKEN in Actions, `gh auth token` locally).
On any failure the previous file is kept, so the page never goes blank.
"""
import json, os, sys, urllib.request

USER = "Rexxall"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "activity.json")
QUERY = """{user(login:"%s"){contributionsCollection{contributionCalendar{totalContributions
weeks{contributionDays{date contributionCount}}}}}}""" % USER


def main():
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        print("no token, keeping previous activity.json"); return
    req = urllib.request.Request("https://api.github.com/graphql", data=json.dumps({"query": QUERY}).encode(),
                                 headers={"Authorization": f"bearer {token}", "User-Agent": "rexxall-site"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            cal = json.load(r)["data"]["user"]["contributionsCollection"]["contributionCalendar"]
    except Exception as e:  # keep the last good file
        print("activity fetch failed:", e); return
    days = [[d["date"], d["contributionCount"]] for w in cal["weeks"] for d in w["contributionDays"]]
    if not days:
        print("empty calendar, keeping previous"); return
    data = {"user": USER, "from": days[0][0], "to": days[-1][0], "total": cal["totalContributions"],
            "active": sum(1 for _, n in days if n), "days": days}
    with open(OUT, "w") as f:
        json.dump(data, f, separators=(",", ":"))
    print(f"activity: {data['active']} active of {len(days)} days, {data['total']} contributions")


if __name__ == "__main__":
    sys.exit(main())
