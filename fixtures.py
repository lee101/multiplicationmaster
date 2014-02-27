import json

EASY = 1
MEDIUM = 2
HARD = 3
EXPERT = 4
DIFFICULTIES = {EASY, MEDIUM, HARD, EXPERT}

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
                 width=5, starrating=[300, 350, 400, 450]):
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

        # TODO generate starrating
        self.starrating = starrating

        self.formula = formula



EASY_LEVELS = [
    # 1+1
    Level(EASY, 1, 10, 1, 5, 0, starrating=[15, 20, 25, 30]),
    Level(EASY, 1, 15, 1, 10, 0, starrating=[48, 65, 80, 90]),
    Level(EASY, 1, 15, 1, 0, 60 * 3, starrating=[192, 232, 272, 312]),
    Level(EASY, 0, 20, 1, 0, 60 * 3, starrating=[192, 232, 272, 312]),
    Level(EASY, 0, 25, 1, 15, 0, starrating=[110, 140, 160, 190]),

    # 1-1
    Level(EASY, 1, 10, 1, 5, 0, MINUS_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EASY, 1, 15, 1, 10, 0, MINUS_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EASY, 1, 15, 1, 0, 60 * 3, MINUS_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EASY, 0, 20, 1, 0, 60 * 3, MINUS_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EASY, 0, 25, 1, 15, 0, MINUS_FORMULA, starrating=[110, 140, 160, 190]),

    # 0.1 + 0.1
    Level(EASY, 0, 1.1, 0.1, 5, 0, starrating=[15, 20, 25, 30]),
    Level(EASY, 0, 1.6, 0.1, 10, 0, starrating=[48, 65, 80, 90]),
    Level(EASY, 0, 1.6, 0.1, 0, 60 * 3, starrating=[192, 232, 272, 312]),
    Level(EASY, 0, 2.1, 0.1, 0, 60 * 3, starrating=[192, 232, 272, 312]),
    Level(EASY, 0, 2.6, 0.1, 15, 0, starrating=[110, 140, 160, 190]),

    # -1 + -1
    Level(EASY, -5, 6, 1, 5, 0, starrating=[15, 20, 25, 30]),
    Level(EASY, -5, 10, 1, 10, 0, starrating=[48, 65, 80, 90]),
    Level(EASY, -5, 15, 1, 0, 60 * 3, starrating=[192, 232, 272, 312]),
    Level(EASY, -10, 15, 1, 0, 60 * 3, starrating=[192, 232, 272, 312]),
    Level(EASY, -10, 20, 1, 15, 0, starrating=[110, 140, 160, 190]),

    # recap
    Level(EASY, 0, 30, 1, 15, 0, starrating=[110, 140, 160, 190]),
    Level(EASY, 0, 30, 1, 15, 0, MINUS_FORMULA, starrating=[110, 140, 160, 190]),
    Level(EASY, 0, 3, 0.1, 15, 0, starrating=[110, 140, 160, 190]),
    Level(EASY, -15, 20, 1, 15, 0, starrating=[110, 140, 160, 190]),
    Level(EASY, -15, 20, 1, 0, 60 * 3, starrating=[110, 140, 160, 190]),
]
MEDIUM_LEVELS = [

    # .1 - .1
    Level(MEDIUM, 0, 1.1, 0.1, 5, 0, MINUS_FORMULA, starrating=[15, 20, 25, 30]),
    Level(MEDIUM, 0, 1.6, 0.1, 10, 0, MINUS_FORMULA, starrating=[48, 65, 80, 90]),
    Level(MEDIUM, 0, 1.6, 0.1, 0, 60 * 3, MINUS_FORMULA, starrating=[192, 232, 272, 312]),
    Level(MEDIUM, 0, 2.1, 0.1, 0, 60 * 3, MINUS_FORMULA, starrating=[192, 232, 272, 312]),
    Level(MEDIUM, 0, 2.6, 0.1, 15, 0, MINUS_FORMULA, starrating=[120, 160, 180, 210]),

    # 1*1
    Level(MEDIUM, 1, 10, 1, 5, 0, TIMES_FORMULA, starrating=[15, 20, 25, 30]),
    Level(MEDIUM, 1, 20, 1, 10, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),
    Level(MEDIUM, 1, 20, 1, 0, 60 * 3, TIMES_FORMULA, starrating=[192, 232, 272, 312]),
    Level(MEDIUM, 0, 30, 1, 0, 60 * 3, TIMES_FORMULA, starrating=[192, 232, 272, 312]),
    Level(MEDIUM, 0, 45, 1, 15, 0, TIMES_FORMULA, starrating=[120, 160, 180, 210]),

    # -0.1 + -0.1
    Level(MEDIUM, -1, 1.1, 0.1, 5, 0, starrating=[15, 20, 25, 30]),
    Level(MEDIUM, -1, 1.6, 0.1, 10, 0, starrating=[48, 65, 80, 90]),
    Level(MEDIUM, -1, 1.6, 0.1, 0, 60 * 3, starrating=[192, 232, 272, 312]),
    Level(MEDIUM, -1.5, 2.1, 0.1, 0, 60 * 3, starrating=[192, 232, 272, 312]),
    Level(MEDIUM, -2, 2.1, 0.1, 15, 0, starrating=[120, 160, 180, 210]),

    # -0.1 - -0.1
    Level(MEDIUM, -1, 1.1, 0.1, 5, 0, MINUS_FORMULA, starrating=[15, 20, 25, 30]),
    Level(MEDIUM, -1, 1.6, 0.1, 10, 0, MINUS_FORMULA, starrating=[48, 65, 80, 90]),
    Level(MEDIUM, -1, 1.6, 0.1, 0, 60 * 3, MINUS_FORMULA, starrating=[192, 232, 272, 312]),
    Level(MEDIUM, -1.5, 2.1, 0.1, 0, 60 * 3, MINUS_FORMULA, starrating=[192, 232, 272, 312]),
    Level(MEDIUM, -2, 2.1, 0.1, 15, 0, MINUS_FORMULA, starrating=[120, 160, 180, 210]),

    # recap
    Level(MEDIUM, 0, 35, 1, 15, 0, starrating=[120, 160, 180, 210]),

    Level(MEDIUM, 0, 2.6, 0.1, 15, 0, MINUS_FORMULA, starrating=[120, 160, 180, 210]),
    Level(MEDIUM, 0, 50, 1, 15, 0, TIMES_FORMULA, starrating=[120, 160, 180, 210]),
    Level(MEDIUM, -2, 2.6, 0.1, 15, 0, starrating=[120, 160, 180, 210]),
    Level(MEDIUM, -2, 2.6, 0.1, 0, 60 * 3, MINUS_FORMULA, starrating=[120, 160, 180, 210]),
]

HARD_LEVELS = [
    # 0.1*0.1
    Level(HARD, 0, 1.1, 0.1, 5, 0, TIMES_FORMULA, starrating=[15, 20, 25, 30]),
    Level(HARD, 0, 2.6, 0.1, 10, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),
    Level(HARD, 0, 2.6, 0.1, 0, 60 * 3, TIMES_FORMULA, starrating=[192, 232, 272, 312]),
    Level(HARD, 0, 3.1, 0.1, 0, 60 * 3, TIMES_FORMULA, starrating=[192, 232, 272, 312]),
    Level(HARD, 0, 3.6, 0.1, 15, 0, TIMES_FORMULA, starrating=[170, 200, 240, 260]),

    # 1/1
    Level(HARD, 1, 10, 1, 5, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(HARD, 1, 20, 1, 10, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),
    Level(HARD, 1, 20, 1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(HARD, 0, 30, 1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(HARD, 0, 45, 1, 15, 0, DIVIDE_FORMULA, starrating=[170, 200, 240, 260]),

    # -1*-1
    Level(HARD, -1, 1.1, 0.1, 5, 0, TIMES_FORMULA, starrating=[15, 20, 25, 30]),
    Level(HARD, -1, 1.6, 0.1, 10, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),
    Level(HARD, -1, 1.6, 0.1, 0, 60 * 3, TIMES_FORMULA, starrating=[192, 232, 272, 312]),
    Level(HARD, -1.5, 2.1, 0.1, 0, 60 * 3, TIMES_FORMULA, starrating=[192, 232, 272, 312]),
    Level(HARD, -2, 2.1, 0.1, 15, 0, TIMES_FORMULA, starrating=[170, 200, 240, 260]),

    # 0.1/0.1
    Level(HARD, 0, 1.1, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(HARD, 0, 1.6, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),
    Level(HARD, 0, 1.6, 0.1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(HARD, 0, 2.1, 0.1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(HARD, 0, 2.6, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[170, 200, 240, 260]),

    #recap
    Level(HARD, 0, 45, 1, 15, 0, MINUS_FORMULA, starrating=[170, 200, 240, 260]),

    Level(HARD, 0, 3.1, 0.1, 15, 0, TIMES_FORMULA, starrating=[170, 200, 240, 260]),
    Level(HARD, 0, 50, 1, 15, 0, DIVIDE_FORMULA, starrating=[170, 200, 240, 260]),
    Level(HARD, 0, 3.1, 0.1, 15, 0, TIMES_FORMULA, starrating=[170, 200, 240, 260]),
    Level(HARD, 0, 3.1, 0.1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[170, 200, 240, 260]),

]

EXPERT_LEVELS=[

    Level(EXPERT, 2, 99, 1, 0, 60 * 3),
    # -0.1*-0.1
    # Level(EXPERT, -1, 1.1, 0.1,   5, 0, TIMES_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EXPERT, -1, 2.6, 0.1,   10, 0, TIMES_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EXPERT, -1, 3.6, 0.1,   0, 60 * 3, TIMES_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EXPERT, -1.5, 4.1, 0.1, 0, 60 * 3, TIMES_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EXPERT, -2, 4.6, 0.1,   15, 0, TIMES_FORMULA, starrating=[190, 220, 260, 280]),


    Level(EXPERT, 2, 99, 1, 0, 60 * 3, MINUS_FORMULA),

    # -1/-1
    # Level(EXPERT, -10, 10, 1, 5, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EXPERT, -20, 20, 1, 10, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EXPERT, -30, 30, 1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EXPERT, -40, 40, 1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EXPERT, -50, 50, 1, 15, 0, DIVIDE_FORMULA, starrating=[190, 220, 260, 280]),


    Level(EXPERT, 2, 99, 1, 0, 60 * 3, TIMES_FORMULA),

    # -0.1/-0.1
    # Level(EXPERT, -1, 1.1, 0.1,  5, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EXPERT, -1, 1.6, 0.1,  10, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EXPERT, -1, 1.6, 0.1,  0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EXPERT, -1.5, 2.1, 0.1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EXPERT, -2, 2.1, 0.1,  15, 0, DIVIDE_FORMULA, starrating=[190, 220, 260, 280]),


    Level(EXPERT, 2, 99, 1, 0, 60 * 3, DIVIDE_FORMULA),

    # Level(EXPERT, 0, 1.1, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[15, 20, 25, 30]),
    Level(EXPERT, 0, 1.6, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[48, 65, 80, 90]),
    Level(EXPERT, 0, 1.6, 0.1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EXPERT, 0, 2.1, 0.1, 0, 60 * 3, DIVIDE_FORMULA, starrating=[192, 232, 272, 312]),
    Level(EXPERT, 0, 2.6, 0.1, 15, 0, DIVIDE_FORMULA, starrating=[190, 220, 260, 280]),

    #recap
    Level(EXPERT, -99, 99, 1, 0, 60 * 3),
    Level(EXPERT, -99, 99, 1, 0, 60 * 3, MINUS_FORMULA),
    Level(EXPERT, -99, 99, 1, 0, 60 * 3, TIMES_FORMULA),
    Level(EXPERT, -99, 99, 1, 0, 60 * 3, DIVIDE_FORMULA),
    Level(EXPERT, 11, 999, 1, 99, 0, TIMES_FORMULA, starrating=[10000, 10200, 10600, 11000]),
]
LEVELS = EASY_LEVELS + MEDIUM_LEVELS + HARD_LEVELS + EXPERT_LEVELS

for i in range(len(LEVELS)):
    LEVELS[i].id = i+1
