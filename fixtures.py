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

    def __init__(self, difficulty, low, high, width, height, formula='x0+x1==x2'):
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

        self.formula = formula
        if formula == 'x0+x1=x2':
            self.formulas = [
                'x2-x1',
                'x2-x0',
                'x1+x2',
                ]


EASY_LEVELS = [
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 15, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),

    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),

    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
    Level(EASY, 0, 9, 5, 5),
]
MEDIUM_LEVELS = [

    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),
    Level(MEDIUM, 0, 9, 5, 5),


]

HARD_LEVELS =[

    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
    Level(HARD, 0, 9, 5, 5),
]

EXPERT_LEVELS=[

]
LEVELS = EASY_LEVELS + MEDIUM_LEVELS + HARD_LEVELS + EXPERT_LEVELS

for i in range(len(LEVELS)):
    LEVELS[i].id = i+1