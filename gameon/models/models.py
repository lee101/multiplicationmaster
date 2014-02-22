from google.appengine.ext import ndb

class BaseModel(ndb.Model):
    def default(self, o): return o.to_dict()
    # def to_dict(self):
    #    return dict([(p, unicode(getattr(self, p))) for p in self._properties])

class Score(BaseModel):
    time = ndb.DateTimeProperty(auto_now_add=True)
    score = ndb.IntegerProperty(default=0)
    game_mode = ndb.IntegerProperty(default=0)


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
    volume = ndb.FloatProperty(default=0.5)

    levels_unlocked = ndb.IntegerProperty(default=0)
    difficulties_unlocked = ndb.IntegerProperty(default=0)

    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    profile_url = ndb.StringProperty()
    access_token = ndb.StringProperty()

    scores = ndb.StructuredProperty(Score, repeated=True)
    achievements = ndb.StructuredProperty(Achievement, repeated=True)

    @classmethod
    def byId(cls, id):
        return cls.query(cls.id == id).get()

    @classmethod
    def buyFor(cls, userid):
        dbuser = User.byId(userid)
        dbuser.gold = 1
        dbuser.put()

    @classmethod
    def byToken(cls, token):
        return cls.query(cls.access_token == token).get()


class Postback(BaseModel):
    jwtPostback = ndb.TextProperty()
    orderId = ndb.StringProperty()
    price = ndb.StringProperty()
    currencyCode = ndb.StringProperty()
    time = ndb.DateTimeProperty(auto_now_add=True)
