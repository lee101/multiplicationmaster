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
    """Provides access to the active Facebook user in self.current_user

    The property is lazy-loaded on first access, using the cookie saved
    by the Facebook JavaScript SDK to determine the user ID of the active
    user. See http://developers.facebook.com/docs/authentication/ for
    more information.
    """
    @property
    def current_user(self):
        #===== Google Auth
        user = users.get_current_user()
        if user:
            dbUser = User.byId(user.user_id())
            if dbUser:
                return dbUser
            else:
                
                dbUser = User()
                dbUser.id = user.user_id()
                dbUser.name = user.nickname()
                dbUser.email = user.email().lower()
                dbUser.put()
                return dbUser

        #===== FACEBOOK Auth
        if self.session.get("user"):
            # User is logged in
            return User.byId(self.session.get("user")["id"])
        else:
            # Either used just logged in or just saw the first page
            # We'll see here
            fbcookie = facebook.get_user_from_cookie(self.request.cookies,
                                                   FACEBOOK_APP_ID,
                                                   FACEBOOK_APP_SECRET)
            if fbcookie:
                # Okay so user logged in.
                # Now, check to see if existing user
                user = User.byId(fbcookie["uid"])
                if not user:
                    # Not an existing user so get user info
                    graph = facebook.GraphAPI(fbcookie["access_token"])
                    profile = graph.get_object("me")
                    user = User(
                        key_name=str(profile["id"]),
                        id=str(profile["id"]),
                        name=profile["name"],
                        profile_url=profile["link"],
                        access_token=fbcookie["access_token"]
                    )
                    user.put()
                elif user.access_token != fbcookie["access_token"]:
                    user.access_token = fbcookie["access_token"]
                    user.put()
                # User is now logged in
                self.session["user"] = dict(
                    name=user.name,
                    profile_url=user.profile_url,
                    id=user.id,
                    access_token=user.access_token
                )
                return user
        #======== use session cookie user
        anonymous_cookie = self.request.cookies.get('wsuser', None)
        if anonymous_cookie is None:
            cookie_value = utils.random_string()
            self.response.set_cookie('wsuser', cookie_value, max_age = 15724800)
            anon_user = User()
            anon_user.cookie_user=1
            anon_user.id = cookie_value
            anon_user.put()
            return anon_user
        else:
            anon_user = User.byId(anonymous_cookie)
            if anon_user:
                return anon_user
            cookie_value = utils.random_string()
            self.response.set_cookie('wsuser', cookie_value, max_age = 15724800)
            anon_user = User()
            anon_user.cookie_user=1
            anon_user.id = cookie_value
            anon_user.put()
            return anon_user


    def dispatch(self):
        """
        This snippet of code is taken from the webapp2 framework documentation.
        See more at
        http://webapp-improved.appspot.com/api/webapp2_extras/sessions.html

        """
        self.session_store = sessions.get_store(request=self.request)
        try:
            webapp2.RequestHandler.dispatch(self)
        except:
            pass
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        """
        This snippet of code is taken from the webapp2 framework documentation.
        See more at
        http://webapp-improved.appspot.com/api/webapp2_extras/sessions.html

        """
        return self.session_store.get_session()

    def render(self, view_name, extraParams = {}):

        # achievements = Acheivement.all().filter("user = ?", self.current_user["id"]).fetch(len(ACHEIVEMENTS))
        # if len(achievements) == 0:
        #     achievements = Acheivement.all().filter("cookie_user = ?", self.current_user["id"]).fetch(len(ACHEIVEMENTS))
        currentUser = self.current_user
        achievements = Achievement.getUserAchievements(currentUser)
        highscores = HighScore.getHighScores(currentUser)

        achievements = achievements.get_result()
        highscores = highscores.get_result()

        curr_time = int(time.time())
        exp_time = curr_time + 3600
        request_info = {'currencyCode': 'USD',
                        'sellerData': currentUser.id}
        jwt_info = {'iss': SELLER_ID,
                    'aud': 'Google',
                    'typ': 'google/payments/inapp/item/v1',
                    'iat': curr_time,
                    'exp': exp_time,
                    'request': request_info}

        # create JWT for first item
        request_info.update({'name': 'Word Smashing Gold', 'price': '0.97'})
        token_1 = jwt.encode(jwt_info, SELLER_SECRET)


        template_values = {
            'jwt': token_1,
            'ws': ws,
            'facebook_app_id': FACEBOOK_APP_ID,
            'current_user': currentUser,
            'achievements': currentUser.achievements,
            'highscores': currentUser.highscores,
            'UNLOCKED_MEDIUM':UNLOCKED_MEDIUM,
            'UNLOCKED_HARD':UNLOCKED_HARD,
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

class GetUserHandler(BaseHandler):
    def get(self):
        currentUser = self.current_user
        return json.dumps(currentUser)
        
class ScoresHandler(BaseHandler):
    def get(self):
        userscore = Score()
        userscore.score = int(self.request.get('score'))
        userscore.game_mode = int(self.request.get('game_mode'))

        currentUser = self.current_user
        currentUser.updateScores(userscore)

        self.response.out.write('success')


class AchievementsHandler(BaseHandler):
    def get(self):
        achieve = Achievement()
        achieve.type = int(self.request.get('achievement'))
        currentUser = self.current_user
        currentUser.achievements.append(achieve)
        currentUser.put()
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

class PostbackHandler(BaseHandler):
  """Handles server postback - received at /postback"""

  def post(self):
    """Handles post request."""
    encoded_jwt = self.request.get('jwt', None)
    if encoded_jwt is not None:
      # jwt.decode won't accept unicode, cast to str
      # http://github.com/progrium/pyjwt/issues/4
      decoded_jwt = jwt.decode(str(encoded_jwt), SELLER_SECRET)

      # validate the payment request and respond back to Google
      if decoded_jwt['iss'] == 'Google' and decoded_jwt['aud'] == SELLER_ID:
        if ('response' in decoded_jwt and
            'orderId' in decoded_jwt['response'] and
            'request' in decoded_jwt):
          order_id = decoded_jwt['response']['orderId']
          request_info = decoded_jwt['request']
          if ('currencyCode' in request_info and 'sellerData' in request_info
              and 'name' in request_info and 'price' in request_info):
            # optional - update local database
            # orderId = decoded_jwt['response']['orderId']

            pb = Postback()
            pb.jwtPostback = encoded_jwt
            pb.orderId = order_id
            # pb.itemName = request_info.get('name')
            # pb.saleType = decoded_jwt['typ']

            if (decoded_jwt['typ'] == 'google/payments/inapp/item/v1/postback/buy'):
                pb.price = request_info['price']
                pb.currencyCode = request_info['currencyCode']
            elif (decoded_jwt['typ'] == 'google/payments/inapp/subscription/v1/postback/buy'):
                pb.price = request_info['initialPayment']['price']
                pb.currencyCode = request_info['initialPayment']['currencyCode']
                # pb.recurrencePrice = request_info['recurrence']['price']
                # pb.recurrenceFrequency = request_info['recurrence']['frequency']

            pb.put()
            sellerData = request_info.get('sellerData')
            User.buyFor(sellerData)
            # respond back to complete payment
            self.response.out.write(order_id)

app = ndb.toplevel(webapp2.WSGIApplication([
    ('/getuser', GetUserHandler),
    ('/savescore', ScoresHandler),
    ('/achievements', AchievementsHandler),
    ('/logout', LogoutHandler),
    ('/postback', PostbackHandler),
    ('/buy', BuyHandler),
    ('/makegold', makeGoldHandler),
    ('/isgold', IsGoldHandler),
    ('/savevolume', SaveVolumeHandler),
    ('/savemute', SaveMuteHandler),
    ('/savelevelsunlocked', SaveLevelsUnlockedHandler),
    ('/savedifficulty', SaveDifficultyHandler),

], debug=ws.debug, config=config))