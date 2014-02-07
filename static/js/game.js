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

        gameon.getUser(function (user) {
            var difficultiesUnlocked = user.difficulties_unlocked;
            if (difficultiesUnlocked >= 1) {
                gameon.unlock('.mm-difficulty--' + MEDIUM);
            }
            if (difficultiesUnlocked >= 2) {
                gameon.unlock('.mm-difficulty--' + HARD);
            }
            if (difficultiesUnlocked >= 3) {
                gameon.unlock('.mm-difficulty--' + EXPERT);
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
        };
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
        var gameState = {};

        function construct() {
            gameState.numSelected = 0;

            var tiles = [];
            for (var i = 0; i < level.width * level.height; i++) {
                var locked = true;
                if (level.difficulty == EASY && i == 0) {
                    var locked = false;
                }
                var tile = new MainTile();
                tiles.push(tile);

            }
            gameState.board = new gameon.board(level.width, level.height, tiles);
            $('.mm-background').html($('#level').html());

            gameState.board.render('.mm-level');
            $('.back-btn').click(function () {
                $('.mm-volume .gameon-volume').detach().appendTo('.mm-volume-template');
                $('.mm-starbar .gameon-starbar').detach().appendTo('.mm-starbar-template');
                views.levels(level.difficulty);

                gameon.pauseSound(mainTheme);
            });
            gameState.starBar = new gameon.StarBar(level.starrating);
            gameState.starBar.setScore(0);

            $('.mm-volume-template .gameon-volume').detach().appendTo('.mm-volume');
            $('.mm-starbar-template .gameon-starbar').detach().appendTo('.mm-starbar');

            gameState.equation = new gameState.Equation();
            gameState.endHandler = new self.EndHandler();
            gameState.endHandler.render();

        }

        self.EndHandler = function() {
            var endSelf = this;
            endSelf.moves = level.numMoves;
            endSelf.render = function () {
                if (level.numMoves) {
                    $('.mm-end-condition').html('<p>Moves: ' + endSelf.moves + '</p>');
                }
                else {
                    $('.mm-end-condition').html('<p>Time: <span class="gameon-clock"></span></p>');
                }
            };
            endSelf.setMoves = function (moves) {
                endSelf.moves = moves;
                if (moves <= 0) {
                    endSelf.gameOver();
                    return;
                }
                endSelf.render();
            };
            endSelf.gameOver = function () {

            };
            if (level.numMoves) {
                gameState.clock = gameon.clock(endSelf.gameOver, level.clock);
            }
        };

        gameState.setTileDeleted = function (y, x) {
            var tile = gameState.board.getTile(y, x);
            tile.deleted = true;
        };


        var MainTile = function () {
            var self = this;
            self.number = gameon.math.numberBetween(1, 9);
            self.selected = false;

            self.click = function () {
                self.selected = !self.selected;
                if (self.selected) {
                    gameState.numSelected++;
                    if (gameState.numSelected > 3) {
                        gameState.numSelected--;
                        self.selected = false;
                        return;
                    }
                    var hasWorked = gameState.equation.addTile(self.yPos, self.xPos, self);
                    if(!hasWorked) {
                        self.reRender();
                    }
                }
                else {
                    gameState.numSelected--;
                    gameState.equation.removeTile(self.yPos, self.xPos, self);
                    self.reRender();

                }
            };

            self.unselect = function () {

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
        };

        gameState.Equation = function () {
            var self = this;
            self.numOperatorTiles = 0;
            var tiles = [];
            var OperatorTile = function (op) {
                var self = this;
                self.operator = op;
                self.render = function () {
                    return '<p class="mm-equation__operator">' + self.operator + '</button>';
                };

                self.getOperator = function () {
                    if (self.operator === '=') {
                        return '==';
                    }
                    return self.operator;
                };
            };
            for (var i = 0; i < level.formula.length; i++) {
                if (level.formula[i][0] === 'x') {
                    tiles.push({});
                }
                else {
                    tiles.push(new OperatorTile(level.formula[i]));
                    self.numOperatorTiles++;
                }
            }

            self.board = new gameon.board(5, 1, tiles);

            self.board.render('.mm-equation');


            self.addTile = function (y, x, tile) {
                var success = false;
                //find new tile pos
                var newTilePos = 0;
                var tiles = self.board.tiles;
                for (var i = 0; i < tiles.length; i++) {
                    if (typeof tiles[i]['render'] === 'undefined') {
                        newTilePos = i;
                        break;
                    }
                }
                // Deep copy
                var tileCopy = jQuery.extend(true, {}, tile);

                tileCopy.oldY = y;
                tileCopy.oldX = x;
                self.board.newTile(0, newTilePos, tileCopy);
                self.board.setTile(0, newTilePos, tileCopy);
                tileCopy.reRender();
//                var boardTile = self.board.getTile(0, newTilePos)
                if (newTilePos == tiles.length - 1) {
//                    if(level.solutions[])
                    success = eval(self.getFormula());
                    if (success) {

                        var totalScore = gameState.starBar.getScore();
                        var totalNumTilesDeleted = 0;
                        for (var i = 0; i < tiles.length; i++) {
                            var tile = tiles[i];
                            if (typeof tile['getOperator'] === 'undefined') {
                                totalScore += tile.number;
                                gameState.numSelected = 0;
                                gameState.setTileDeleted(tile.oldY, tile.oldX);
                                totalNumTilesDeleted++;
                            }
                            else {

                            }
                        }
                        var newTiles = [];
                        for(var i=0;i< totalNumTilesDeleted;i++) {
                            newTiles.push(new MainTile())
                        }
                        self.board.removeWhere(function (tile) {
                            return typeof tile['getOperator'] === 'undefined';
                        });

                        gameState.starBar.setScore(totalScore);
                        gameState.board.render();
                        gameState.board.falldown(newTiles);
                        gameState.endHandler.setMoves(gameState.endHandler.moves-1);
                    }
                }
                return success;
            };


            self.getFormula = function () {
                var formula = '';
                var tiles = self.board.tiles;
                var terms = level.formula;
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles[i];
                    if (typeof tile['getOperator'] !== 'undefined') {
                        formula += tile.getOperator();
                    }
                    else {
                        formula += tile.number;
                    }
                }
                return  formula;
            };

            self.removeTile = function (oldY, oldX) {
                self.board.removeWhere(function (tile) {
                    return tile.oldX === oldX && tile.oldY === oldY;
                });
            };
        };
        construct();
        return gameState;
    }


})();
