import json
from datetime import date
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates

import blogcontent

router = APIRouter()
tpl = Jinja2Templates(directory="templates")


def ctx(request, **kw):
    return {"request": request, "base": blogcontent.BASE, "json": json, **kw}


@router.get("/blog", response_class=HTMLResponse)
async def blog_index(request: Request):
    posts = blogcontent.load()
    ld = json.dumps({"@context": "https://schema.org", "@type": "Blog", "name": "Multiplication Master Blog", "url": blogcontent.BASE + "/blog", "blogPost": [{"@type": "BlogPosting", "headline": p["title"], "url": blogcontent.BASE + "/blog/" + p["slug"], "datePublished": p["date"]} for p in posts]})
    return tpl.TemplateResponse(request, "blog_index.jinja2", ctx(request, posts=posts, ld=ld))


@router.get("/blog/{slug}", response_class=HTMLResponse)
async def blog_post(request: Request, slug: str):
    post = blogcontent.by_slug(slug)
    if not post:
        return Response("Not found", status_code=404)
    others = [p for p in blogcontent.load() if p["slug"] != slug]
    return tpl.TemplateResponse(request, "blog_post.jinja2", ctx(request, post=post, others=others))
