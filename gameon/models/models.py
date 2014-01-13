import os
import datetime
import logging
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import ndb
from google.appengine.api import users
from operator import attrgetter

class BaseModel(ndb.Model):
    def default(self, o): return o.to_dict()
    # def to_dict(self):
    #    return dict([(p, unicode(getattr(self, p))) for p in self._properties])

class Score(BaseModel):
    time = ndb.DateTimeProperty(auto_now_add=True)
    score = ndb.IntegerProperty(default=0)
    game_mode = ndb.IntegerProperty(default=0)


class HighScore(BaseModel):
    game_mode = ndb.IntegerProperty(default=0)
    score = ndb.IntegerProperty(default=0)


class Achievement(BaseModel):
    time = ndb.DateTimeProperty(auto_now_add=True)
    type = ndb.IntegerProperty()


class User(BaseModel):
    id = ndb.StringProperty(required=True)
    cookie_user = ndb.IntegerProperty()
    name = ndb.StringProperty()
    email = ndb.StringProperty()

    gold = ndb.IntegerProperty()

    mute = ndb.IntegerProperty()
    volume = ndb.FloatProperty()

    levels_unlocked = ndb.IntegerProperty(default=0)
    difficulties_unlocked = ndb.IntegerProperty(default=0)

    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    profile_url = ndb.StringProperty()
    access_token = ndb.StringProperty()

    scores = ndb.StructuredProperty(Score, repeated=True)
    high_scores = ndb.StructuredProperty(HighScore, repeated=True)
    achievements = ndb.StructuredProperty(Achievement, repeated=True)

    @classmethod
    def byId(self, id):
        return self.query(self.id == id).get()

    @classmethod
    def buyFor(self, userid):
        dbuser = User.byId(userid)
        dbuser.gold = 1
        dbuser.put()

    @classmethod
    def byToken(self, token):
        return self.query(self.access_token == token).get()

    def getHighScores(self):
        return sorted(self.high_scores, key=attrgetter('game_mode', 'score'))

    def updateScores(self, score):
        self.scores.append(score)
        scores = filter(lambda hs: hs.game_mode == score.game_mode, self.high_scores)
        if len(scores) == 0:
            hs = HighScore(game_mode=score.game_mode, score=score.score)
            self.high_scores.append(hs)
            self.put()
            return
        scores = sorted(scores, key= lambda s: -s.score)
        if scores[0].score < score:
            hs = HighScore(game_mode=score.game_mode, score=score.score)
            self.high_scores.append(hs)
        self.put()


class Postback(BaseModel):
    jwtPostback = ndb.TextProperty()
    orderId = ndb.StringProperty()
    price = ndb.StringProperty()
    currencyCode = ndb.StringProperty()
    time = ndb.DateTimeProperty(auto_now_add=True)
