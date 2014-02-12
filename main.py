#!/usr/bin/env python
import json

from Models import *
from gameon import gameon
from ws import ws
import os
import webapp2
import jinja2
import fixtures
from gameon.gameon_utils import GameOnUtils

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])

config = {'webapp2_extras.sessions': dict(secret_key='93986c9cdd240540f70efaea56a9e3f2')}


class BaseHandler(webapp2.RequestHandler):
    def render(self, view_name, extraParams={}):
        template_values = {
            'fixtures': fixtures,
            'ws': ws,
            'json': json,
            'GameOnUtils': GameOnUtils,
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
        noads = self.request.get('noads', False)
        self.render('templates/index.jinja2', {'noads': noads})


class TestHandler(BaseHandler):
    def get(self):
        self.render('templates/tests.jinja2')


class PrivacyHandler(BaseHandler):
    def get(self):
        self.render('templates/privacy.jinja2')


class TermsHandler(BaseHandler):
    def get(self):
        self.render('templates/terms.jinja2')


class SitemapHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/xml'
        template_values = {
        }
        template = JINJA_ENVIRONMENT.get_template('templates/sitemap.xml')
        self.response.write(template.render(template_values))


app = ndb.toplevel(webapp2.WSGIApplication([
                                               ('/', MainHandler),
                                               ('/tests', TestHandler),
                                               ('/privacy', PrivacyHandler),
                                               ('/terms', TermsHandler),
                                               # ('/about', AboutHandler),
                                               # ('/contact', ContactHandler),
                                               ('/sitemap', SitemapHandler),

                                           ] + gameon.routes, debug=ws.debug, config=config))
