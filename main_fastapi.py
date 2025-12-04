#!/usr/bin/env python

import os
import json
import urllib.parse
import uuid

from fastapi import FastAPI, Request, Depends, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse, Response, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import logging

import fixtures
from ws import ws
from database import init_db, get_db
from gameon.models.models import User, Score, Achievement
from gameon.gameon_utils import GameOnUtils

app = FastAPI()
templates = Jinja2Templates(directory=".")
templates.env.loader.searchpath.append("templates")

@app.on_event("startup")
async def startup_event():
    init_db()

def get_or_create_user(request: Request, response: Response, db: Session) -> User:
    wsuser = request.cookies.get('wsuser')
    if not wsuser:
        wsuser = str(uuid.uuid4())
        response.set_cookie('wsuser', wsuser, max_age=15724800)

    user = User.byExternalId(db, wsuser)
    if not user:
        user = User(external_id=wsuser, cookie_user=1)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

app.mount("/gameon/static", StaticFiles(directory="gameon/static"), name="gameon_static")
app.mount("/static", StaticFiles(directory="static"), name="static")

def get_template_values(request: Request, **kwargs):
    return {
        'request': request,
        'fixtures': fixtures,
        'ws': ws,
        'json': json,
        'GameOnUtils': GameOnUtils,
        'url': str(request.url),
        'host': request.url.hostname,
        'host_url': f"{request.url.scheme}://{request.url.netloc}",
        'path': request.url.path,
        'urlencode': urllib.parse.quote_plus,
        **kwargs
    }

@app.get('/', response_class=HTMLResponse)
async def index(request: Request, noads: bool = False):
    return templates.TemplateResponse('index.jinja2', get_template_values(request, noads=noads))

@app.get('/tests', response_class=HTMLResponse)
async def tests(request: Request):
    return templates.TemplateResponse('tests.jinja2', get_template_values(request))

@app.get('/privacy', response_class=HTMLResponse)
async def privacy(request: Request):
    return templates.TemplateResponse('privacy.jinja2', get_template_values(request))

@app.get('/terms', response_class=HTMLResponse)
async def terms(request: Request):
    return templates.TemplateResponse('terms.jinja2', get_template_values(request))

@app.get('/contact', response_class=HTMLResponse)
async def contact(request: Request):
    return templates.TemplateResponse('contact.jinja2', get_template_values(request))

@app.get('/sitemap')
async def sitemap(request: Request):
    content = templates.get_template('sitemap.xml').render(get_template_values(request))
    return Response(content=content, media_type='text/xml')

@app.get('/favicon.ico')
async def favicon():
    return RedirectResponse(url='/static/favicon.ico')

@app.get('/manifest.webapp')
async def manifest():
    return JSONResponse({
        "name": "Multiplication Master",
        "short_name": "Math Master",
        "start_url": "/",
        "display": "standalone",
        "icons": [{"src": "/static/img/multiplication-master-icon-bg128.png", "sizes": "128x128", "type": "image/png"}]
    })

@app.get('/{url:path}/')
async def remove_trailing_slash(url: str):
    return RedirectResponse(url=f'/{url}')

# Gameon API routes
@app.get('/gameon/getuser')
async def get_user(request: Request, response: Response, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    return JSONResponse({
        'id': user.id,
        'gold': user.gold,
        'mute': user.mute,
        'volume': user.volume,
        'levels_unlocked': user.levels_unlocked,
        'difficulties_unlocked': user.difficulties_unlocked,
        'scores': [{'score': s.score, 'game_mode': s.game_mode} for s in user.scores],
        'achievements': [{'type': a.type} for a in user.achievements]
    })

@app.get('/gameon/savescore')
async def save_score(request: Request, response: Response, score: int, game_mode: int, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    s = Score(user_id=user.id, score=score, game_mode=game_mode)
    db.add(s)
    db.commit()
    return 'success'

@app.get('/gameon/deleteallscores')
async def delete_all_scores(request: Request, response: Response, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    for s in user.scores:
        db.delete(s)
    db.commit()
    return 'success'

@app.get('/gameon/saveachievement')
async def save_achievement(request: Request, response: Response, type: int, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    a = Achievement(user_id=user.id, type=type)
    db.add(a)
    db.commit()
    return 'success'

@app.get('/gameon/isgold')
async def is_gold(request: Request, response: Response, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    return 'success' if user.gold else ''

@app.get('/gameon/makegold')
async def make_gold(request: Request, response: Response, reverse: bool = False, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    user.gold = 0 if reverse else 1
    db.commit()
    return 'success' if reverse else RedirectResponse(url='/')

@app.get('/gameon/savevolume')
async def save_volume(request: Request, response: Response, volume: float, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    user.volume = volume
    db.commit()
    return 'success'

@app.get('/gameon/savemute')
async def save_mute(request: Request, response: Response, mute: int, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    user.mute = mute
    db.commit()
    return 'success'

@app.get('/gameon/savelevelsunlocked')
async def save_levels_unlocked(request: Request, response: Response, levels_unlocked: int, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    user.levels_unlocked = levels_unlocked
    db.commit()
    return 'success'

@app.get('/gameon/savedifficultiesunlocked')
async def save_difficulties_unlocked(request: Request, response: Response, difficulties_unlocked: int, db: Session = Depends(get_db)):
    user = get_or_create_user(request, response, db)
    user.difficulties_unlocked = difficulties_unlocked
    db.commit()
    return 'success'

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8338)
