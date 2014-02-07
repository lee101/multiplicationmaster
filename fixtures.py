import json

EASY = 1
MEDIUM = 2
HARD = 3
EXPERT = 4
DIFFICULTIES = set([EASY, MEDIUM, HARD, EXPERT])

class Fixture(object):
    """docstring for Fixture"""
    def __init__(self):
        super(Fixture, self).__init__()

    def to_JSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

class Level(Fixture):
    NUM_LEVELS = 0
    difficulty = []
    formula = []
    number = []

    def __init__(self, difficulty, low, high, width, height, numMoves, time,
                 formula=['x0','+','x1','=','x2'],
                 starrating = [60,70,90,100]):
        '''
        difficulty array of (x,y) pairs
        '''
        self.id = Level.NUM_LEVELS
        Level.NUM_LEVELS+=1
        self.difficulty = difficulty
        self.low = low
        self.high = high
        self.width = width
        self.height = height
        self.numMoves = numMoves
        self.time = time
        self.starrating = starrating

        self.formula = formula



EASY_LEVELS = [
    Level(EASY, 0, 9, 5, 5, 5, 0, starrating=[15,20,25,30]),
    Level(EASY, 0, 15, 5, 5, 10, 0, starrating=[32,40,50,60]),
    Level(EASY, 0, 9, 5, 5, 0, 60*5, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),

    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),

    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
    Level(EASY, 0, 9, 5, 5, 0, 60*5),
]
MEDIUM_LEVELS = [

    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),
    Level(MEDIUM, 0, 9, 5, 5, 0, 60*5),


]

HARD_LEVELS = [

    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
    Level(HARD, 0, 9, 5, 5, 0, 60*5),
]

EXPERT_LEVELS=[

]
LEVELS = EASY_LEVELS + MEDIUM_LEVELS + HARD_LEVELS + EXPERT_LEVELS

for i in range(len(LEVELS)):
    LEVELS[i].id = i+1
