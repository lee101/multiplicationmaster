import unittest
from google.appengine.ext import ndb
from google.appengine.ext import testbed
from google.appengine.datastore import datastore_stub_util

##
import sys

from dev_appserver import EXTRA_PATHS
sys.path = EXTRA_PATHS + sys.path

from google.appengine.tools import dev_appserver
from google.appengine.tools.dev_appserver_main import ParseArguments
args, option_dict = ParseArguments(sys.argv) # Otherwise the option_dict isn't populated.
dev_appserver.SetupStubs('local', **option_dict)

from google.appengine.api import memcache
##

from gameon.models.models import User
from gameon.models.models import HighScore


class ModelsTest(unittest.TestCase):

    def setUp(self):
        # First, create an instance of the Testbed class.
        self.testbed = testbed.Testbed()
        # Then activate the testbed, which prepares the service stubs for use.
        self.testbed.setup_env(app_id='multiplicationmaster')
        self.testbed.activate()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        self.testbed.init_taskqueue_stub()
        #
        # # Create a consistency policy that will simulate the High Replication consistency model.
        # self.policy = datastore_stub_util.PseudoRandomHRConsistencyPolicy(probability=0)
        # # Initialize the datastore stub with this policy.
        # self.testbed.init_datastore_v3_stub(consistency_policy=self.policy)

    def tearDown(self):
        self.testbed.deactivate()

    def testGetHighScores(self):
        highscore1 = HighScore(game_mode=0, score=123)
        highscore2 = HighScore(game_mode=0, score=1234)
        highscore3 = HighScore(game_mode=0, score=12345)
        highscore4 = HighScore(game_mode=1, score=123)
        highscore5 = HighScore(game_mode=1, score=12345)
        user = User()
        user.high_scores = [highscore1, highscore4, highscore3, highscore2, highscore5]

        self.assertEqual(user.getHighScores(), [highscore1, highscore2, highscore3, highscore4, highscore5])

    def testUpdateHighScore(self):
        highscore1 = HighScore(game_mode=0, score=123)
        highscore2 = HighScore(game_mode=0, score=1234)
        highscore3 = HighScore(game_mode=0, score=12345)
        highscore4 = HighScore(game_mode=1, score=123)
        highscore5 = HighScore(game_mode=1, score=12345)
        user = User()
        user.id = '1234'
        user.high_scores = [highscore1, highscore4, highscore3, highscore2, highscore5]

        self.assertEqual(user.updateHighScore(1,123456), True)
        self.assertEqual(user.updateHighScore(2,12), True)
        self.assertEqual(user.updateHighScore(1,1234), False)
        self.assertEqual(len(user.high_scores), 7)
        newuser = User.byId(user.id)
        self.assertEqual(len(newuser.high_scores), 7)

    def testInsertEntity(self):
        HighScore(game_mode=0, score=123).put()
        self.assertEqual(1, len(HighScore.query().fetch(2)))


if __name__ == '__main__':
    unittest.main()