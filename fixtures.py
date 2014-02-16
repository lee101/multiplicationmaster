import json

EASY = 1
MEDIUM = 2
HARD = 3
EXPERT = 4
DIFFICULTIES = set([EASY, MEDIUM, HARD, EXPERT])

MINUS_FORMULA = ['x0', '-', 'x1', '=', 'x2']
TIMES_FORMULA = ['x0', '*', 'x1', '=', 'x2']
DIVIDE_FORMULA = ['x0', '/', 'x1', '=', 'x2']


class Fixture(object):
    """docstring for Fixture"""
    def __init__(self):
        super(Fixture, self).__init__()

    def to_JSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

class Level(Fixture):
    """
    Note on level difficulty
easier ----------------------------> harder
        1   0.1     -1      -0.1
        +   -       *          /

    """
    NUM_LEVELS = 0
    difficulty = []
    formula = []
    number = []

    def __init__(self, difficulty, low, high, precision, numMoves, time, formula=['x0', '+', 'x1', '=', 'x2'], height=5,
                 width=5, starrating=[60, 70, 90, 100]):
        '''
        difficulty array of (x,y) pairs
                '''
        self.id = Level.NUM_LEVELS
        Level.NUM_LEVELS+=1

        self.difficulty = difficulty

        self.low = low
        self.high = high
        self.precision = precision

        self.width = width
        self.height = height

        self.numMoves = numMoves
        self.time = time

        self.starrating = starrating

        self.formula = formula



EASY_LEVELS = [
    # 1+1
    Level(EASY, 1, 10, 1, 5, 0, starrating=[15, 20, 25, 30]),
    Level(EASY, 1, 15, 1, 10, 0, starrating=[32, 40, 50, 60]),
    Level(EASY, 1, 15, 1, 0, 60 * 5, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 20, 1, 0, 60 * 5, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 25, 1, 15, 0, starrating=[48, 65, 80, 90]),

    # 1-1
    Level(EASY, 1, 10, 1, 5, 0, MINUS_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, 1, 15, 1, 10, 0, MINUS_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 1, 15, 1, 0, 60 * 5, MINUS_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 20, 1, 0, 60 * 5, MINUS_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 25, 1, 15, 0, MINUS_FORMULA, starrating=[48, 65, 80, 90]),

    # 0.1 + 0.1
    Level(EASY, 0, 1.1, 0.1, 5, 0, starrating=[15, 20, 25, 30]),
    Level(EASY, 0, 1.6, 0.1, 10, 0, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 1.6, 0.1, 0, 60 * 5, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 2.1, 0.1, 0, 60 * 5, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 2.6, 0.1, 15, 0, starrating=[48, 65, 80, 90]),

    # -1 + -1
    Level(EASY, -5, 6, 1, 5, 0, starrating=[15, 20, 25, 30]),
    Level(EASY, -5, 10, 1, 10, 0, starrating=[32, 40, 50, 60]),
    Level(EASY, -5, 15, 1, 0, 60 * 5, starrating=[32, 40, 50, 60]),
    Level(EASY, -10, 15, 1, 0, 60 * 5, starrating=[32, 40, 50, 60]),
    Level(EASY, -10, 20, 1, 15, 0, starrating=[48, 65, 80, 90]),

    # recap
    Level(EASY, 0, 30, 1, 15, 0, starrating=[48, 65, 80, 90]),
    Level(EASY, 0, 30, 1, 15, 0, MINUS_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, 0, 3, 0.1, 15, 0, starrating=[48, 65, 80, 90]),
    Level(EASY, -15, 20, 1, 15, 0, starrating=[48, 65, 80, 90]),
    Level(EASY, -15, 20, 1, 0, 60 * 5, starrating=[48, 65, 80, 90]),
]
MEDIUM_LEVELS = [

    # .1 - .1
    Level(MEDIUM, 0, 1.1, 0.1, 5, 0, MINUS_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, 0, 1.6, 0.1, 10, 0, MINUS_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 1.6, 0.1, 0, 60 * 5, MINUS_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 2.1, 0.1, 0, 60 * 5, MINUS_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 2.6, 0.1, 15, 0, MINUS_FORMULA, starrating=[48, 65, 80, 90]),

    # 1*1
    Level(EASY, 1, 10, 1, 5, 0, TIMES_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, 1, 20, 1, 10, 0, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 1, 20, 1, 0, 60 * 5, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 30, 1, 0, 60 * 5, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 45, 1, 15, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),

    # -0.1 + -0.1
    Level(EASY, -1, 1.1, 0.1, 5, 0, starrating=[15, 20, 25, 30]),
    Level(EASY, -1, 1.6, 0.1, 10, 0, starrating=[32, 40, 50, 60]),
    Level(EASY, -1, 1.6, 0.1, 0, 60 * 5, starrating=[32, 40, 50, 60]),
    Level(EASY, -1.5, 2.1, 0.1, 0, 60 * 5, starrating=[32, 40, 50, 60]),
    Level(EASY, -2, 2.1, 0.1, 15, 0, starrating=[48, 65, 80, 90]),

    # -0.1 - -0.1
    Level(EASY, -1, 1.1, 0.1, 5, 0, MINUS_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, -1, 1.6, 0.1, 10, 0, MINUS_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -1, 1.6, 0.1, 0, 60 * 5, MINUS_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -1.5, 2.1, 0.1, 0, 60 * 5, MINUS_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -2, 2.1, 0.1, 15, 0, MINUS_FORMULA, starrating=[48, 65, 80, 90]),

    # recap
    Level(EASY, 0, 35, 1, 15, 0, starrating=[48, 65, 80, 90]),

    Level(EASY, 0, 2.6, 0.1, 15, 0, MINUS_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, 0, 50, 1, 15, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, -2, 2.6, 0.1, 15, 0, starrating=[48, 65, 80, 90]),
    Level(EASY, -2, 2.6, 0.1, 0, 60 * 5, MINUS_FORMULA, starrating=[48, 65, 80, 90]),
]

HARD_LEVELS = [
    # 0.1*0.1
    Level(EASY, 0, 1.1, 0.1, 5, 0, TIMES_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, 0, 2.6, 0.1, 10, 0, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 2.6, 0.1, 0, 60 * 5, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 3.1, 0.1, 0, 60 * 5, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 3.6, 0.1, 15, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),

    # 1/1
    Level(EASY, 1, 10, 1, 5, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, 1, 20, 1, 10, 0, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 1, 20, 1, 0, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 30, 1, 0, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 45, 1, 15, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),

    # -1*-1
    Level(EASY, -1, 1.1, 0.1, 5, 0, TIMES_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, -1, 1.6, 0.1, 10, 0, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -1, 1.6, 0.1, 0, 60 * 5, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -1.5, 2.1, 0.1, 0, 60 * 5, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -2, 2.1, 0.1, 15, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),

    # 0.1/0.1
    Level(EASY, 0, 1.1, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, 0, 1.6, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 1.6, 0.1, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 2.1, 0.1, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 2.6, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),

    #recap
    Level(EASY, 0, 45, 1, 15, 0, MINUS_FORMULA, starrating=[48, 65, 80, 90]),

    Level(EASY, 0, 3.1, 0.1, 15, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, 0, 50, 1, 15, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, 0, 3.1, 0.1, 15, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, 0, 3.1, 0.1, 0, 60 * 5, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),

]

EXPERT_LEVELS=[
    # -0.1*-0.1
    # Level(EASY, -1, 1.1, 0.1,   5, 0, TIMES_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, -1, 2.6, 0.1,   10, 0, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -1, 3.6, 0.1,   0, 60 * 5, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -1.5, 4.1, 0.1, 0, 60 * 5, TIMES_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -2, 4.6, 0.1,   15, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),

    # -1/-1
    # Level(EASY, -10, 10, 1, 5, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, -20, 20, 1, 10, 0, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -30, 30, 1, 0, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -40, 40, 1, 0, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -50, 50, 1, 15, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),

    # -0.1/-0.1
    # Level(EASY, -1, 1.1, 0.1,  5, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, -1, 1.6, 0.1,  10, 0, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -1, 1.6, 0.1,  0, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -1.5, 2.1, 0.1, 0, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, -2, 2.1, 0.1,  15, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),

    # Level(EASY, 0, 1.1, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, 0, 1.6, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 1.6, 0.1, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 2.1, 0.1, 60 * 5, DIVIDE_FORMULA, starrating=[32, 40, 50, 60]),
    Level(EASY, 0, 2.6, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),

    #recap
    Level(EASY, -99, 99, 1, 0, 60 * 5, starrating=[48, 65, 80, 90]),
    Level(EASY, -99, 99, 1, 0, 60 * 5, MINUS_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, -99, 99, 1, 0, 60 * 5, TIMES_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, -99, 99, 1, 0, 60 * 5, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, -99, 99, 0.01, 0, 60 * 5, TIMES_FORMULA, starrating=[48, 65, 80, 90]),
]
LEVELS = EASY_LEVELS + MEDIUM_LEVELS + HARD_LEVELS + EXPERT_LEVELS

for i in range(len(LEVELS)):
    LEVELS[i].id = i+1
