var mainTheme = 'mm-theme';
gameon.loadSound(mainTheme, '/gameon/static/music/multiplication-master-theme1.mp3');
gameon.loadSound('score', '/gameon/static/music/star.mp3');
gameon.loadSound('win', '/gameon/static/music/winning-level.mp3');

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

if (!inIframe()) {
    window.showPaywall = function () {
        var $modal = $('#modal');
        $modal.find('.modal-body').html("<h4 class=\"mdl-dialog__title lead\">Please support us! Play on <a href=\"https://www.addictingwordgames.com\">AddictingWordGames.com</a></h4>" +
            "        <div class=\"mdl-dialog__content lead\">" +
            "            <p>" +
            "                $7 to buy this game and all 694 Addicting Word Games forever + any future" +
            "                releases!" +
            "            </p>" +
            "        </div>" +
            "        <div class=\"mdl-dialog__actions\">" +
            "            <a type=\"button\" class=\"btn btn-danger mdl-button mdl-button--colored mdl-button--accent mdl-js-button mdl-js-ripple-effect closes-modal\" href=\"https://www.addictingwordgames.com/sign-up\" target=\"_blank\">Buy Now</a>" +
            "        </div>");
        $modal.modal('show');
        window.setTimeout(window.showPaywall, 60 * 1000);
    };
    window.setTimeout(window.showPaywall, 60 * 1000);
}

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
        var levelsSelf = this;

        var LevelLink = function (id, locked) {
            var self = this;

            self.locked = locked;
            self.id = id;
            self.stars = {
                render: function () {
                    return '';
                }
            };

            self.click = function () {
                views.level(self.id);
            };

            self.render = function () {
                if (self.locked) {
                    return '<button type="button" class="btn btn-danger btn-lg" disabled="disabled"><span class="glyphicon glyphicon-lock"></span></button>';
                }
                var output = ['<button type="button" class="btn btn-danger btn-lg">' + self.id];
                if (typeof self.stars !== 'undefined') {
                    output.push(' ' + self.stars.render());
                }
                output.push('</button>');
                return output.join('');
            }
        };
        var tiles = [];
        var levels = DIFFICULTY_TO_LEVELS_MAP[difficulty];
        gameon.getUser(function (user) {
            var highScores = user.getHighScores();

            for (var i = 0; i < levels.length; i++) {
                var locked = true;
                if (user.levels_unlocked + 1 >= levels[i].id) {
                    locked = false;
                }

                var tile = new LevelLink(levels[i].id, locked);
                if (i < highScores.length) {
                    tile.stars = new gameon.Stars(levels[i].starrating, highScores[i].score);
                }
                tiles.push(tile);
            }
        });
        levelsSelf.levelsList = levels;
        levelsSelf.board = new gameon.Board(5, 5, tiles);
        $('.mm-background').html($('#levels').html());
        levelsSelf.board.render('.mm-levels');
        $('.back-btn').click(function () {
            views.difficulties();
        });
        return levelsSelf;
    };


    self.level = function (id) {
        self.name = 'level';
        gameon.pauseAll();
        gameon.loopSound(mainTheme);

        var level = LEVELS[id - 1];
        var gameState = {};

        function construct() {

            var tiles = gameState.initialBoardTiles();
            gameState.board = new gameon.Board(level.width, level.height, tiles);
            $('.mm-background').html($('#level').html());

            gameState.board.render('.mm-level');
            gameState.destruct = function () {
                if (gameState.clock) {
                    gameState.clock.reset();
                }
                gameon.cleanBoards();
                gameon.pauseSound(mainTheme);
                gameState.destructed = true;
            };
            $('.back-btn').click(function () {
                gameState.destruct();
                views.levels(level.difficulty);
            });
            gameState.starBar = new gameon.StarBar(level.starrating);

            gameon.renderVolumeTo('.mm-volume');
            gameState.starBar.render('.mm-starbar');

            gameState.equation = new gameState.Equation();
            gameState.endHandler = new gameState.EndHandler();
            gameState.endHandler.render();

        }

        gameState.solve = function (i, params) {
            var pIdx = 0;
            var equation = level.solutions[i];
            var pluggedEquation = '';
            for (var j = 0; j < equation.length; j++) {
                var term = equation[j];
                if (term[0] === 'x') {
                    pluggedEquation += '(' + params[pIdx++] + ')';
                }
                else {
                    pluggedEquation += term;
                }
            }
            return eval(pluggedEquation);
        };

        gameState.initialBoardTiles = function () {

            var numTilesNeeded = level.width * level.height;

            gameState.numberLine = new gameon.math.NumberLine(level.low, level.high, level.precision);

            //search number line for matches.
            //TODO make this support arbitrarily long formula

            var generatedNumbers = [];

            var numPossibleNumbers = gameState.numberLine.length();
            numberFinder:
                for (var i = 0; i < numPossibleNumbers; i++) {
                    var x = gameState.numberLine.shuffledGet(i);
                    for (var j = 0; j < numPossibleNumbers; j++) {
                        var y = gameState.numberLine.shuffledGet2(j);

                        var foundMatch = false;
                        var z = 0;
                        for (var formulaNum = 0; formulaNum < level.solutions.length; formulaNum++) {
                            //try find z
                            z = gameState.solve(formulaNum, [x, y]);
                            if (gameState.numberLine.contains(z)) {
                                foundMatch = true;
                                break;
                            }
                            z = gameState.solve(formulaNum, [y, x]);
                            if (gameState.numberLine.contains(z)) {
                                foundMatch = true;
                                break;
                            }
                        }

                        if (foundMatch) {
                            generatedNumbers.push(x);
                            generatedNumbers.push(y);
                            generatedNumbers.push(z);
                            if (generatedNumbers.length >= numTilesNeeded) {
                                break numberFinder;
                            }
                            else {
                                gameState.numberLine.shuffle();
                                i = 0;
                                j = 0;
                                continue numberFinder;
                            }
                        }
                    }
                }

            var tiles = [];
            for (var i = 0; i < numTilesNeeded; i++) {

                var tile = new MainTile(generatedNumbers[i]);
                tiles.push(tile);
            }
            return gameon.shuffle(tiles);
        };

        gameState.newBoardTiles = function (numTilesNeeded) {

            gameState.numberLine = new gameon.math.NumberLine(level.low, level.high, level.precision);

            //search number line for matches.
            //TODO make this support arbitrarily long formula

            var currentNumbers = gameState.board.viewOfWhere(function (tile) {
                return tile.number;
            }, function (tile) {
                return tile.isTile();
            });

            var numTiles = currentNumbers.length();

            var generatedNumbers = [];
            numberFinder:
                for (var i = 0; i < numTiles; i++) {

                    var x = currentNumbers.shuffledGet(i);
                    for (var j = 0; j < numTiles; j++) {
                        var y = currentNumbers.shuffledGet2(j);

                        var foundMatch = false;
                        var z = 0;
                        for (var formulaNum = 0; formulaNum < level.solutions.length; formulaNum++) {
                            //try find z
                            z = gameState.solve(formulaNum, [x, y]);
                            if (gameState.numberLine.contains(z)) {
                                foundMatch = true;
                                break;
                            }
                            z = gameState.solve(formulaNum, [y, x]);
                            if (gameState.numberLine.contains(z)) {
                                foundMatch = true;
                                break;
                            }
                        }

                        if (foundMatch) {
                            generatedNumbers.push(z);
                            if (generatedNumbers.length >= numTilesNeeded) {
                                break numberFinder;
                            }
                            else {
                                currentNumbers.shuffle();
                                i = 0;
                                j = 0;
                                continue numberFinder;
                            }
                        }
                    }
                }

            var tiles = [];
            for (var i = 0; i < numTilesNeeded; i++) {

                var tile = new MainTile(generatedNumbers[i]);
                tiles.push(tile);
            }
            return gameon.shuffle(tiles);
        };

        gameState.EndHandler = function () {
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
                    //todo settimeout so they can watch successanimation
                    endSelf.gameOver();
                    return;
                }
                endSelf.render();
            };
            endSelf.gameOver = function () {
                var score = gameState.starBar.getScore();
                gameon.getUser(function (user) {
                    user.saveScore(level.id, score);
                    if (gameState.starBar.hasWon()) {
                        if (user.levels_unlocked < level.id) {
                            user.saveLevelsUnlocked(level.id);
                            var numLevels = DIFFICULTY_TO_LEVELS_MAP[level.difficulty].length;
                            if (user.levels_unlocked % numLevels === 0) {
                                user.saveDifficultiesUnlocked(user.difficulties_unlocked + 1);
                            }
                        }
                    }
                });
                gameState.destruct();
                views.donelevel(gameState.starBar, level);
            };
            if (!level.numMoves) {
                gameState.clock = gameon.clock(endSelf.gameOver, level.time);
                gameState.clock.start();
            }
        };

        gameState.setTileDeleted = function (y, x) {
            var tile = gameState.board.getTile(y, x);
            tile.deleted = true;
        };


        var MainTile = function (n) {
            var self = this;

            self.number = gameon.math.precisionRound(n, level.precision);//gameon.math.numberBetween(1, 9);
            self.selected = false;

            self.click = function () {
                self.selected = !self.selected;
                if (self.selected) {
                    if (gameState.equation.isFull()) {
                        self.selected = false;
                        return;
                    }
                    var hasWorked = gameState.equation.addTile(self.yPos, self.xPos, self);
                    if (!hasWorked) {
                        self.reRender();
                    }
                }
                else {
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

            var OperatorTile = function (op) {
                var self = this;
                self.operator = op;

                self.formatOperator = function () {
                    if (self.operator === '*') {
                        return '<span class="mm-equation__operator-icon glyphicon glyphicon-remove"></span>';
                    }
                    if (self.operator === '/') {
                        return '÷';
                    }
                    return self.operator;
                };
                self.render = function () {
                    return '<p class="mm-equation__operator">' + self.formatOperator() + '</button>';
                };

                self.getOperator = function () {
                    if (self.operator === '=') {
                        // floating point equality hack,
                        // will need to do something to support > and <= operators instead of just ==
                        return '-';
                    }
                    return self.operator;
                };
            };

            self.construct = function () {
                self.numOperatorTiles = 0;
                var tiles = [];

                for (var i = 0; i < level.formula.length; i++) {
                    if (level.formula[i][0] === 'x') {
                        tiles.push({});
                    }
                    else {
                        tiles.push(new OperatorTile(level.formula[i]));
                        self.numOperatorTiles++;
                    }
                }

                self.board = new gameon.Board(5, 1, tiles);

                self.board.render('.mm-equation');
            };

            self.getScore = function (num) {
                var str = '' + num;
                var number = +str.replace('.', '');
                if (!number) {
                    return 1;
                }
                return Math.abs(number);
            };

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
                self.board.setTile(0, newTilePos, tileCopy);
                tileCopy.reRender();
                var tolerance = 0.00001;
                success = Math.abs(eval(self.getFormula())) < tolerance;
                if (success) {

                    var currentMovesScore = 0;
                    var totalNumTilesDeleted = 0;
                    for (var i = 0; i < tiles.length; i++) {
                        var tile = tiles[i];
                        if (typeof tile['getOperator'] === 'undefined') {
                            currentMovesScore += self.getScore(tile.number);
                            gameState.setTileDeleted(tile.oldY, tile.oldX);
                            totalNumTilesDeleted++;
                        }
                    }
                    var newTiles = gameState.newBoardTiles(totalNumTilesDeleted);

                    self.board.removeWhere(function (tile) {
                        return typeof tile['getOperator'] === 'undefined';
                    });

                    gameState.starBar.addMoveScoring(currentMovesScore);
                    gameState.board.render();
                    gameState.board.falldown(newTiles);
                    if (!level.time) {
                        gameState.endHandler.setMoves(gameState.endHandler.moves - 1);
                    }
                    var oldMainThemePos = gameon.getSoundPosition(mainTheme);
                    gameon.playSound('score', function () {
                        // some mobiles can only play one sound at once
                        if (!gameState.destructed && !gameon.isPlaying(mainTheme)) {
                            gameon.loopSoundAtPosition(mainTheme, oldMainThemePos);
                        }
                    });

                    if (gameState.starBar.hasFullScore()) {
                        if (!level.time) {
                            gameState.starBar.addMovesBonus(gameState.endHandler.moves);
                        }
                        else {
                            gameState.starBar.addTimeBonus(level.time, gameState.clock.seconds);
                        }
                        gameState.endHandler.gameOver();
                    }
                }
                return success;
            };

            self.isFull = function () {
                return self.board.isFull();
            };

            /**
             * Gets the formula on the board as a string eg '1+1==2'
             * @returns {string}
             */
            self.getFormula = function () {
                var formula = '';
                var tiles = self.board.tiles;
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles[i];
                    if (typeof tile['getOperator'] !== 'undefined') {
                        formula += tile.getOperator();
                    }
                    else {
                        formula += '(' + tile.number + ')';
                    }
                }
                return formula;
            };

            self.removeTile = function (oldY, oldX) {
                self.board.removeWhere(function (tile) {
                    return tile.oldX === oldX && tile.oldY === oldY;
                });
            };
            self.construct();
            return self;
        };
        construct();
        return gameState;
    };
    self.donelevel = function (starBar, level) {

        $('.mm-background').html($('#donelevel').html());
        starBar.render('.mm-starbar');

        var $button = $('#mm-next-level');
        if (starBar.hasWon()) {
            $button.removeAttr('disabled');
            $button.find('.glyphicon-lock').remove();
            $button.click(function () {
                self.nextLevel(level);
            });
        }
        if (self.isLastLevel(level)) {
            $button.hide();
        }
        $('#mm-replay').click(function () {
            self.level(level.id);
        });
        if (starBar.numStars == 0) {
            $('.mm-end-message p').html('Play Again!');
        }
        else if (starBar.numStars == 1) {
            $('.mm-end-message p').html('Good!');
        }
        else if (starBar.numStars == 2) {
            $('.mm-end-message p').html('Great!');
        }
        if (starBar.movesBonus) {
            $('.mm-bonus-message').append(
                    starBar.movesBonus.moves + ' Moves left! <br /> ' +
                    starBar.movesBonus.averageScorePerMove + ' Points per move! <br />' +
                    'Moves Bonus: ' + starBar.movesBonus.moves + ' <i class="fa fa-times"></i> ' +
                    starBar.movesBonus.averageScorePerMove + ' <i class="fa fa-times"></i> 2 = ' + starBar.movesBonus.bonus +
                    ' Points!'
            );

        }
        else if (starBar.timeBonus) {
            $('.mm-bonus-message').append(
                    starBar.timeBonus.averageScorePerMove + ' Points per move! <br/>' +
                    starBar.timeBonus.averageNumMovesPerSecond + ' Moves per second! <br />' +
                    starBar.timeBonus.timeLeft + ' Seconds left! <br />' +
                    'Time Bonus: ' +
                    starBar.timeBonus.averageScorePerMove + ' <i class="fa fa-times"></i> ' +
                    starBar.timeBonus.averageNumMovesPerSecond + ' <i class="fa fa-times"></i> ' +
                    starBar.timeBonus.timeLeft + ' <i class="fa fa-times"></i> 2 = ' + starBar.timeBonus.bonus +
                    ' Points!'
            );
        }
        if (starBar.numStars >= 1 && self.isLastLevel(level)) {
            $('.mm-end-message p').append(' <br /> Congratulations You have Won The Game!!!');
        }
        if (starBar.numStars >= 1) {
            gameon.loopSound('win');
        }
        $('.mm-responsivead-bottom').show();
    };

    self.isLastLevel = function (lvl) {
        return lvl.id === LEVELS[LEVELS.length - 1].id;
    };
    self.nextLevel = function (level) {
        self.level(level.id + 1);
    };

    return self;
})();

$(document).ready(function () {
    $('.mm-hide-btn').click(function () {
        $(this).parent().hide();
    });
});
