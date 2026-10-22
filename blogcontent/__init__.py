import json
from pathlib import Path

DIR = Path(__file__).parent
BASE = "https://multiplicationmaster.v5games.com"


def load():
    posts = json.loads((DIR / "posts.json").read_text())
    return sorted(posts, key=lambda p: p["date"], reverse=True)


def by_slug(slug):
    for p in load():
        if p["slug"] == slug:
            return p
    return None
