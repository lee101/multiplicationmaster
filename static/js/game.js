var mainTheme = 'mm-theme';
gameon.loadSound(mainTheme, '/gameon/static/music/multiplication-master-theme1.mp3');



var views = new (function () {
    'use strict';
    var self = this;
    self.name = 'start';

    self.start = function () {
        self.name = 'start';
        $('.mm-background').html($('#start').html());
    };

    self.options = function () {
        self.name = 'options';

        $('.mm-background').html($('#options').html());
        $('.back-btn').click(function () {
            self.start();
        });
    };

    self.difficulties = function () {
        self.name = 'difficulties';
        $('.mm-background').html($('#difficulties').html());
        $('.back-btn').click(function () {
            views.start();
        });

        gameon.getUser(function(user){
            var difficultiesUnlocked = user.difficulties_unlocked;
            if (difficultiesUnlocked >= 1) {
                gameon.unlock('.mm-difficulty--'+ MEDIUM);
            }
            if (difficultiesUnlocked >= 2) {
                gameon.unlock('.mm-difficulty--'+ HARD);
            }
            if (difficultiesUnlocked >= 3) {
                gameon.unlock('.mm-difficulty--'+ EXPERT);
            }

        });
    };

    self.levels = function (difficulty) {
        self.name = 'levels';

        var LevelLink = function (id, locked) {
            var self = this;

            self.locked = locked;
            self.id = id;

            self.click = function () {
                views.level(self.id);
            };

            self.render = function () {
                if (self.locked) {
                    return '<button type="button" class="btn btn-danger btn-lg" disabled="disabled"><span class="glyphicon glyphicon-lock"></span></button>';
                }
                return '<button type="button" class="btn btn-danger btn-lg">' + self.id + '</button>';
            }
        }
        var tiles = [];
        var levels = DIFFICULTY_TO_LEVELS_MAP[difficulty];
        for (var i = 0; i < levels.length; i++) {
            var locked = true;
            if (difficulty == EASY && i == 0) {
                var locked = false;
            }
            var tile = new LevelLink(levels[i].id, locked);
            tiles.push(tile);

        }
        var board = new gameon.board(5, 5, tiles);
        $('.mm-background').html($('#levels').html());
        board.render('.mm-levels');
        $('.back-btn').click(function () {
            views.difficulties();
        });
    };


    self.level = function (id) {
        self.name = 'level';
        gameon.loopSound(mainTheme);

        var level = LEVELS[id - 1];
        var tiles = [];


        var MainTile = function (id) {
            var self = this;
            self.number = gameon.math.numberBetween(1, 5);
            self.id = id;
            self.selected = false;

            self.click = function () {
                self.selected = !self.selected;
                self.reRender();
            };

            self.render = function () {
                var btnStyle = 'btn btn-danger btn-lg';
                if (self.selected) {
                    btnStyle = 'btn btn-warning btn-lg';
                }
                if (self.locked) {
                    return '<button type="button" class="' + btnStyle + '" disabled="disabled"><span class="glyphicon glyphicon-lock"></span></button>';
                }
                return '<button type="button" class="' + btnStyle + '">' + self.number + '</button>';
            };
        }
        for (var i = 0; i < level.width * level.height; i++) {
            var locked = true;
            if (level.difficulty == EASY && i == 0) {
                var locked = false;
            }
            var tile = new MainTile();
            tiles.push(tile);

        }
        var board = new gameon.board(level.width, level.height, tiles);
        var equation = new gameon.board(5, 1, []);


        $('.mm-background').html($('#level').html());
        board.render('.mm-level');
        equation.render('.mm-equation');
        $('.back-btn').click(function () {
            views.levels(level.difficulty);
            gameon.pauseSound(mainTheme);

            $('.mm-volume .gameon-volume').detach().appendTo('.mm-volume-template');
            $('.mm-starbar .gameon-starbar').detach().appendTo('.mm-starbar-template');
        });
        var starBar = new gameon.StarBar(level.starrating);
        starBar.setScore(0);
        $('.mm-volume-template .gameon-volume').detach().appendTo('.mm-volume');
        $('.mm-starbar-template .gameon-starbar').detach().appendTo('.mm-starbar');
    }


})();
