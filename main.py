#!/usr/bin/env python

from Models import *
from google.appengine.api import users
from ws import ws
import os
import webapp2
import facebook
from webapp2_extras import sessions
import utils
import jinja2

from paypal import IPNHandler

import json
import time
import jwt

# application-specific imports
from sellerinfo import SELLER_ID
from sellerinfo import SELLER_SECRET

FACEBOOK_APP_ID = "138831849632195"
FACEBOOK_APP_SECRET = "93986c9cdd240540f70efaea56a9e3f2"

config = {}
config['webapp2_extras.sessions'] = dict(secret_key='93986c9cdd240540f70efaea56a9e3f2')

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


class BaseHandler(webapp2.RequestHandler):
    def render(self, view_name, extraParams = {}):

        template_values = {
            'ws': ws,
            'facebook_app_id': FACEBOOK_APP_ID,
            'MEDIUM':MEDIUM,
            'EASY':EASY,
            'HARD':HARD,
            'glogin_url': users.create_login_url(self.request.uri),
            'glogout_url': users.create_logout_url(self.request.uri),
            'url':self.request.uri,
            'num_levels': len(LEVELS)
        }
        template_values.update(extraParams)

        template = JINJA_ENVIRONMENT.get_template(view_name)
        self.response.write(template.render(template_values))

class ScoresHandler(BaseHandler):
    def get(self):
        userscore = Score()
        userscore.score = int(self.request.get('score'))
        userscore.difficulty = int(self.request.get('difficulty'))
        userscore.timedMode = int(self.request.get('timedMode'))

        if userscore.difficulty not in DIFFICULTIES:
            raise Exception("unknown difficulty: " + userscore.difficulty)

        currentUser = self.current_user
        if currentUser:
            userscore.user = currentUser.key
        userscore.put()
        HighScore.updateHighScoreFor(currentUser, userscore.score, userscore.difficulty, userscore.timedMode)

        self.response.out.write('success')
class AchievementsHandler(BaseHandler):
    def get(self):
        acheive = Achievement()
        acheive.type = int(self.request.get('achievement'))
        if acheive.type not in ACHEIVEMENTS:
            raise Exception("unknown achievement: " + acheive.type)
        currentUser = self.current_user
        if currentUser:

            acheive.user = currentUser.key
        acheive.put()
        #graph = facebook.GraphAPI(self.current_user['access_token'])
        self.response.out.write('success')

class IsGoldHandler(BaseHandler):
    def get(self):
        currentUser = self.current_user
        if currentUser.gold:
            self.response.out.write('success')

class BuyHandler(BaseHandler):
    def get(self):

        # paymentAmount = "3.99"
        # CURRENCYCODE = "USD"
        # RETURNURL = "https://wordsmashing.appspot.com/buy"
        # CANCELURL = "https://wordsmashing.appspot.com/buy"

        self.render('buy.html')

    def post(self):
        self.render('buy.html')

class LevelHandler(BaseHandler):
    def get(self, level):
        level_num = int(level)
        self.render('level.html', {'level_num': level_num, 'level': LEVELS[level_num - 1]})

    def post(self, level):
        level_num = int(level)
        self.render('level.html', {'level_num': level_num, 'level': LEVELS[level_num - 1]})


class LogoutHandler(BaseHandler):
    def get(self):
        if self.current_user is not None:
            self.session['user'] = None

        self.redirect('/')

class makeGoldHandler(BaseHandler):
    def get(self):
        if self.request.get('reverse', None):
            user = self.current_user
            user.gold=0
            user.put()
            self.response.out.write('success')
        else:
            User.buyFor(self.current_user.id)
            ##TODOFIX
            self.redirect("/campaign")


class SaveVolumeHandler(BaseHandler):
    def get(self):
        user = self.current_user
        user.volume = float(self.request.get('volume', None))
        user.put()
        self.response.out.write('success')
class SaveMuteHandler(BaseHandler):
    def get(self):
        user = self.current_user
        user.muted = int(self.request.get('muted', None))
        user.put()
        self.response.out.write('success')

class SaveLevelsUnlockedHandler(BaseHandler):
    def get(self):
        user = self.current_user
        user.levels_unlocked = int(self.request.get('levels_unlocked', None))
        user.put()
        self.response.out.write('success')

class SaveDifficultyHandler(BaseHandler):
    def get(self):
        user = self.current_user
        user.difficulty = int(self.request.get('difficulty', None))
        user.put()
        self.response.out.write('success')

class SitemapHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/xml'
        template_values = {
            'learnenglishlevels': LEARN_ENGLISH_LEVELS,
        }
        template = JINJA_ENVIRONMENT.get_template('sitemap.xml')
        self.response.write(template.render(template_values))

app = ndb.toplevel(webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/privacy-policy', PrivacyHandler),
    ('/terms', TermsHandler),
    ('/facebook', FbHandler),
    ('/about', AboutHandler),
    ('/contact', ContactHandler),
    ('/timed', TimedHandler),
    ('/multiplayer', FriendsHandler),
    ('/games-multiplayer', GameMultiplayerHandler),
    ('/games', GamesHandler),
    ('/learn-english', LearnEnglishHandler),
    ('/learn-english/(.*)', EnglishLevelHandler),
    ('/campaign', CampaignHandler),
    (r'/campaign/level(\d+)', LevelHandler),
    ('/sitemap', SitemapHandler),

], debug=ws.debug, config=config))
