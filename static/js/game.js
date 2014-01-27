var views = new (function () {
    'use strict';
    var self = this;
    self.start = function () {
        $('.mm-background').html($('#start').html());
    };

    self.options = function () {
        $('.mm-background').html($('#options').html());
    };

    self.difficulties = function () {
        $('.mm-background').html($('#difficulties').html());
    };

    self.levels = function (difficulty) {
        var LevelLink = function (id, locked) {
            var self = this;

            self.locked = locked;
            self.id = id;

            self.click = function() {
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
    };

    self.level = function (id) {
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
                if(self.selected) {
                    btnStyle = 'btn btn-warning btn-lg';
                }
                if (self.locked) {
                    return '<button type="button" class="'+btnStyle+'" disabled="disabled"><span class="glyphicon glyphicon-lock"></span></button>';
                }
                return '<button type="button" class="'+btnStyle+'" onclick="views.level.tileClick()">' + self.number + '</button>';
            };
        }
        for (var i = 0; i < level.width* level.height; i++) {
            var locked = true;
            if (level.difficulty == EASY && i == 0) {
                var locked = false;
            }
            var tile = new MainTile();
            tiles.push(tile);

        }
        var board = new gameon.board(level.width, level.height, tiles);
        $('.mm-background').html($('#levels').html());
        board.render('.mm-levels');
    }


})();
