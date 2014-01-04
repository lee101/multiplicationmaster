import os
import datetime
import logging
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import ndb
from google.appengine.api import users
from operator import attrgetter


class Score(ndb.Model):
    time = ndb.DateTimeProperty(auto_now_add=True)
    score = ndb.IntegerProperty(default=0)
    game_mode = ndb.IntegerProperty(default=0)


class HighScore(ndb.Model):
    game_mode = ndb.IntegerProperty(default=0)
    score = ndb.IntegerProperty(default=0)

    @classmethod
    def updateHighScoreFor(cls, user, score, difficulty, timedMode):
        '''
        updates users highscore returns true if it is there high score false otherwise
        '''
        hs = cls.query(cls.user == user.key,
                       cls.difficulty == difficulty,
                       cls.timedMode == timedMode).order(-cls.score).fetch(1)
        if len(hs) > 0 and hs[0].score < score:
            hs = HighScore()
            hs.user = user.key
            hs.score = score
            hs.difficulty = difficulty
            hs.timedMode = timedMode
            hs.put()
            return True
        if len(hs) == 0:
            hs = HighScore()
            hs.user = user.key
            hs.score = score
            hs.difficulty = difficulty
            hs.timedMode = timedMode
            hs.put()
            return True
        return False


class Achievement(ndb.Model):
    time = ndb.DateTimeProperty(auto_now_add=True)
    type = ndb.IntegerProperty()


class User(ndb.Model):
    id = ndb.StringProperty(required=True)
    cookie_user = ndb.IntegerProperty()
    name = ndb.StringProperty()
    email = ndb.StringProperty()

    gold = ndb.IntegerProperty()

    muted = ndb.IntegerProperty()
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

    def updateHighScore(self, game_mode, score):
        scores = filter(lambda hs: hs.game_mode == game_mode, self.high_scores)
        if len(scores) == 0:
            hs = HighScore(game_mode=game_mode, score=score)
            self.high_scores.append(hs)
            self.put()
            return True
        scores = sorted(scores, key= lambda s: -s.score)
        if scores[0].score < score:
            hs = HighScore(game_mode=game_mode, score=score)
            self.high_scores.append(hs)
            self.put()
            return True
        return False


class Postback(ndb.Model):
    jwtPostback = ndb.TextProperty()
    orderId = ndb.StringProperty()
    price = ndb.StringProperty()
    currencyCode = ndb.StringProperty()
    time = ndb.DateTimeProperty(auto_now_add=True)
