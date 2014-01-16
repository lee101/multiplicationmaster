#!/usr/bin/env python

from Models import *
from google.appengine.api import users
from gameon import gameon
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
            # 'ws': ws,
            # 'facebook_app_id': FACEBOOK_APP_ID,
            # 'MEDIUM':MEDIUM,
            # 'EASY':EASY,
            # 'HARD':HARD,
            # 'glogin_url': users.create_login_url(self.request.uri),
            # 'glogout_url': users.create_logout_url(self.request.uri),
            # 'url':self.request.uri,
            # 'num_levels': len(LEVELS)
        }
        template_values.update(extraParams)

        template = JINJA_ENVIRONMENT.get_template(view_name)
        self.response.write(template.render(template_values))

class MainHandler(BaseHandler):
    def get(self):
        self.render('templates/index.jinja2')
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
    # ('/privacy-policy', PrivacyHandler),
    # ('/terms', TermsHandler),
    # ('/about', AboutHandler),
    # ('/contact', ContactHandler),
    ('/sitemap', SitemapHandler),

] + gameon.routes, debug=ws.debug, config=config))
