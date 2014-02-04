// Globals: JQuery/$

var GameOnUser = function (userJSON) {

    userJSON.saveHighScore = function (game_mode, score, callback) {
        if (typeof callback == 'undefined') {
            callback = function (data) {
            }
        }
        $.ajax({
            "url": "/gameon/savescore",
            "data": {game_mode: game_mode, score: score},
            "success": function (data) {
                callback(data)
            },
            "type": "GET",
            "cache": false,
            "error": function (xhr, error, thrown) {
                if (error == "parsererror") {
                }
            }
        });
        userJSON.scores.push({game_mode: game_mode, score: score});
    };

    userJSON.saveAchievement = function (achievementNumber, callback) {
        if (typeof callback == 'undefined') {
            callback = function (data) {
            }
        }
        $.ajax({
            "url": "/gameon/saveachievement",
            "data": {type: achievementNumber},
            "success": function (data) {
                callback(data)
            },
            "type": "GET",
            "cache": false,
            "error": function (xhr, error, thrown) {
                if (error == "parsererror") {
                }
            }
        });
        userJSON.achievements.push({type: achievementNumber})
    };

    userJSON.saveVolume = function (volume, callback) {
        if (typeof callback == 'undefined') {
            callback = function (data) {
            }
        }
        $.ajax({
            "url": "/gameon/savevolume",
            "data": {volume: volume},
            "success": function (data) {
                callback(data)
            },
            "type": "GET",
            "cache": false,
            "error": function (xhr, error, thrown) {
                if (error == "parsererror") {
                }
            }
        });
        userJSON.volume = volume
    };

    userJSON.saveMute = function (mute, callback) {
        if (typeof callback == 'undefined') {
            callback = function (data) {
            }
        }
        $.ajax({
            "url": "/gameon/savemute",
            "data": {mute: mute},
            "success": function (data) {
                callback(data)
            },
            "type": "GET",
            "cache": false,
            "error": function (xhr, error, thrown) {
                if (error == "parsererror") {
                }
            }
        });
        userJSON.mute = mute

    };

    userJSON.saveLevelsUnlocked = function (levelsUnlocked, callback) {
        if (typeof callback == 'undefined') {
            callback = function (data) {
            }
        }
        $.ajax({
            "url": "/gameon/savelevelsunlocked",
            "data": {levels_unlocked: levelsUnlocked},
            "success": function (data) {
                callback(data)
            },
            "type": "GET",
            "cache": false,
            "error": function (xhr, error, thrown) {
                if (error == "parsererror") {
                }
            }
        });
        userJSON.levels_unlocked = levelsUnlocked
    };

    userJSON.saveDifficultiesUnlocked = function (difficultiesUnlocked, callback) {
        if (typeof callback == 'undefined') {
            callback = function (data) {
            }
        }
        $.ajax({
            "url": "/gameon/savedifficultiesunlocked",
            "data": {difficulties_unlocked: difficultiesUnlocked},
            "success": function (data) {
                callback(data)
            },
            "type": "GET",
            "cache": false,
            "error": function (xhr, error, thrown) {
                if (error == "parsererror") {
                }
            }
        });
        userJSON.difficulties_unlocked = difficultiesUnlocked
    };


    return userJSON;
};
var gameon = new (function () {
    "use strict";
    var self = this;

    self.getUser = function (callback) {
        if (self.user) {
            callback(self.user);
        }
        else {

            $.ajax({
                "url": "/gameon/getuser",
                "data": {},
                "success": function (user) {
                    self.user = GameOnUser(user);
                    callback(self.user);
                },
                "type": "GET",
                "cache": false,
                "error": function (xhr, error, thrown) {
                    if (error == "parsererror") {
                    }
                }
            });
        }
    };

    // ========== SOUND ================

    soundManager.setup({
        // where to find the SWF files, if needed
        url: '/gameon/js/lib/soundmanager/script',
        onready: function () {
            // SM2 has loaded, API ready to use e.g., createSound() etc.

        },
        ontimeout: function () {
            // Uh-oh. No HTML5 support, SWF missing, Flash blocked or other issue
        }

    });

    self.loadSound = function (name, url) {
        soundManager.onready(function () {
            soundManager.createSound({
                id: name,
                url: url
            });
        });
    };

    self.playSound = function (name) {
        soundManager.onready(function () {
            soundManager.play(name);
        });
    };

    self.pauseSound = function (name) {
        soundManager.onready(function () {
            soundManager.pause(name);
        });
    };

    self.pauseAll = soundManager.pauseAll;
    self.resumeAll = soundManager.resumeAll;

    /**
     * @param volume 0 to 1 global volume
     */
    self.setVolume = function (volume) {
        volume = volume * 100;
        $.each(soundManager.sounds, function (name, sound) {
            sound.setVolume(volume);
        });
    };

    function _loopSound(sound) {
        sound.play({
            onfinish: function () {
                _loopSound(sound);
            }
        });
    }

    self.loopSound = function (name) {
        soundManager.onready(function () {
            var sound = soundManager.getSoundById(name);
            _loopSound(sound)
        });
    };

    self.mute = function () {
        soundManager.mute();
        self.getUser(function (user) {
            user.saveMute(1);
        });
    };

    self.unmute = function () {
        soundManager.unmute();
        self.getUser(function (user) {
            user.saveMute(0);
        });
    };

    //TODO TEST clicks
    self.muteClick = function () {
        $('.gameon-volume__unmute').show();
        $('.gameon-volume__mute').hide();
        self.mute();
    };
    self.unmuteClick = function () {
        $('.gameon-volume__unmute').hide();
        $('.gameon-volume__mute').show();
        self.unmute();
    };


    self.getUser(function (user) {
        //render volume control
        $(document).ready(function () {
            //        $('.gameon-volume').append('<input type="text" data-slider="true" value="0.4" data-slider-highlight="true" data-slider-theme="volume"/>');
            $(".gameon-volume [data-slider]").simpleSlider("setRatio", user.volume);
            if (user.mute) {
                $('.gameon-volume__unmute').show();
                self.mute();
            }
            else {
                $('.gameon-volume__mute').show();
            }

            $(".gameon-volume [data-slider]")
                .bind("slider:ready slider:changed", function (event, data) {
                    self.setVolume(data.ratio);
                    self.getUser(function (user) {
                        user.saveVolume(data.ratio);
                    })

                });
        });
    });


    // ===================       Clock       ===============================

    self.clock = function (gameOver, startSeconds) {
        var self = this;
        if (!startSeconds) {
            self.startSeconds = 5 * 60;
        }
        else {
            self.startSeconds = startSeconds;
        }

        self.started = false;

        self.reset = function () {
            self.seconds = self.startSeconds;
            self.started = false;
        };

        self.start = function () {
            self.started = true;
        };
        self.unpause = self.start;
        self.pause = function () {
            self.started = false;
        };

        self.tick = function () {

        };

        self.getTime = function () {
            return self._formattedTime;
        };
        self.setTime = function (seconds) {
            self.seconds = seconds;
            self._updateFormattedTime();
        };

        self._updateFormattedTime = function () {
            var separator = ':';
            if (self.seconds % 60 <= 9) {
                separator = ':0'
            }
            self._formattedTime = Math.floor(self.seconds / 60) + separator + self.seconds % 60;
        };
        self.setTime(self.startSeconds);

        setInterval(function () {
            if (self.started) {
                self.setTime(self.seconds - 1);
                self._updateFormattedTime();
                self.tick();
                $('.gameon-clock').html(self.getTime());
                if (self.seconds <= 0) {
                    self.reset();
                    gameOver();
                }
            }
        }, 1000);

        return self;
    };

    // =====================       Board            ===========================
    var numBoards = 0;

    /**
     * tiles MUST have the functions click(), reRender() and render()
     * @param width
     * @param height
     */
    self.board = function (width, height, tiles) {
        var boardSelf = this;
        numBoards++;
        boardSelf.id = numBoards;
        boardSelf.name = 'board' + numBoards;
        self[boardSelf.name] = boardSelf;

        boardSelf.width = width;
        boardSelf.height = height;
        boardSelf.tiles = tiles;

        boardSelf.newTile = function (y, x, tile) {
            tile.yPos = y;
            tile.xPos = x;
            tile.tileRender = function () {
                var renderedData;
                if(typeof this['render'] === 'function'){
                    renderedData = $(this.render());
                }
                else {
                    renderedData = $('<div></div>');
                }
                renderedData.attr('onclick', 'gameon.' + boardSelf.name + '.click(this)');
                renderedData.attr('data-yx', boardSelf.name + '-' + this.yPos + '-' + this.xPos);
                renderedData.css({position: 'relative'});
                return renderedData[0].outerHTML;
            };
            tile.reRender = function () {
                var renderedTile = boardSelf.getRenderedTile(this.yPos, this.xPos);
                var container = renderedTile.parent();
                container.html(tile.tileRender());
            };
        };

        boardSelf.getY = function (i) {
            return Math.floor(i / boardSelf.width);
        };
        boardSelf.getX = function (i) {
            return i % boardSelf.width;
        };

        boardSelf.getTile = function (y, x) {
            return boardSelf.tiles[y * boardSelf.width + x];
        };
        boardSelf.setTile = function (y, x, tile) {
            boardSelf.tiles[y * boardSelf.width + x] = tile;
        };

        for (var i = 0; i < boardSelf.tiles.length; i++) {
            var currTile = boardSelf.tiles[i];

            var x = boardSelf.getX(i);
            var y = boardSelf.getY(i);

            boardSelf.newTile(y, x, currTile);
        }


        boardSelf.getRenderedTile = function (y, x) {
            return $('[data-yx="' + boardSelf.name + '-' + y + '-' + x + '"]');
        }

        boardSelf.click = function (elm) {
            var yx = $(elm).attr('data-yx').split('-');
            var y = +yx[1];
            var x = +yx[2];
            var tile = boardSelf.getTile(y, x);
            if(typeof tile['click'] === 'function') {
                tile.click();
            }
        }

        boardSelf.render = function (target) {
            if (typeof target === 'undefined') {
                target = '.gameon-board';
            }
            boardSelf.target = target
            var domtable = ['<table>'];
            for (var h = 0; h < boardSelf.height; h++) {
                domtable.push("<tr>");
                for (var w = 0; w < boardSelf.width; w++) {
                    var even = 'odd';
                    if ((h + w) % 2 === 0) {
                        even = 'even';
                    }
                    domtable.push('<td class="' + even + '">');

                    var tile = boardSelf.getTile(h, w);
                    if (typeof tile !== 'undefined' && typeof tile['tileRender'] === 'function') {
                        domtable.push(tile.tileRender());
                    }

                    domtable.push("</td>");
                }
                domtable.push("</tr>");
            }
            domtable.push('</table>');

            $(target).html(domtable.join(''));
        };

        boardSelf.getContainerAt = function (y, x) {
            return $('.gameon-board tr:nth-child(' + (y + 1) + ') td:nth-child(' + (x + 1) + ')');
        };

        boardSelf.falldown = function (newTiles, callback) {

            //work out the required state column by column and set the internal data to that straight away.
            //animate towards that state
            //refreshui
            //TODO better way of getting tiledist eg 60 if $(window).width()<suu
            var tiledist = $('.gameon-board td').outerHeight();
            var falltime = 0.20;
            var maxNumDeletedPerColumn = 0;
            var newTileNum = 0;
            var numDeletedPerColumn = [];
            for (var w = 0; w < boardSelf.width; w++) {

                var numDeleted = 0;
                for (var h = boardSelf.height - 1; h >= 0; h--) {
                    var currTile = boardSelf.getTile(h, w);

                    var renderedTile = boardSelf.getRenderedTile(currTile.yPos, currTile.xPos);
                    if (currTile.deleted) {
                        numDeleted += 1;
                        if (numDeleted > maxNumDeletedPerColumn) {
                            maxNumDeletedPerColumn = numDeleted;
                        }
                        renderedTile.remove();
                        continue;
                    } else {
                        if (numDeleted == 0) {
                            continue;
                        }
                        var endPos = h + numDeleted;
                        var fallDistance = numDeleted * tiledist;
                        var container = boardSelf.getContainerAt(endPos, w);

                        var renderedTile = boardSelf.getRenderedTile(h, w);
                        renderedTile.attr('data-yx', boardSelf.name + '-' + endPos + '-' + w);
                        container.html(renderedTile);

                        renderedTile = boardSelf.getRenderedTile(endPos, w);
                        renderedTile.css({top: -fallDistance});
                        renderedTile.animate({top: '+=' + fallDistance}, tiledist / (falltime / numDeleted));


                        //update our model
                        currTile.yPos = endPos;
                        currTile.xPos = w;
                        boardSelf.setTile(endPos, w, currTile);
                    }
                }
                for (var h = 0; h < numDeleted; h++) {
                    var currNewTile = newTiles[newTileNum++];
                    boardSelf.newTile(h, w, currNewTile);

                    //update our model
                    currNewTile.yPos = h;
                    currNewTile.xPos = w;
                    boardSelf.setTile(h, w, currNewTile);

                    var container = boardSelf.getContainerAt(h, w);

                    var fallDistance = numDeleted * tiledist;

                    var renderedData = $(currNewTile.render());
                    renderedData.attr('onclick', 'gameon.' + boardSelf.name + '.click(this)');
                    renderedData.attr('data-yx', boardSelf.name + '-' + h + '-' + w);
                    renderedData.css({position: 'relative'});
                    renderedData.css({top: -fallDistance});

                    container.html(renderedData[0].outerHTML)
                    var renderedTile = boardSelf.getRenderedTile(h, w);
                    renderedTile.animate({top: '+=' + fallDistance}, tiledist / (falltime / numDeleted));
                }
//                numDeletedPerColumn.push(numDeleted);

            }

            setTimeout(callback, maxNumDeletedPerColumn * falltime)
        };
        return boardSelf;
    };


    self.math = new (function () {
        var self = this;
        self.numberBetween = function (a, b) {
            return Math.floor(Math.random() * (b - a) + a);
        }
    })();


    self.StarBar = function (starrating) {
        $('.gameon-starbar .track').off('click mousedown mouseup mousemove');
        $('.gameon-starbar .highlight-track').off('click mousedown mouseup mousemove');

        var self = this;
        self.one = starrating[0];
        self.two = starrating[1];
        self.three = starrating[2];
        self.end = starrating[3];
        var sliderWidth = $('.gameon-starbar .slider').outerWidth();

        var staronePos = (self.one / self.end) * sliderWidth;
        var startwoPos = (self.two / self.end) * sliderWidth;
        var starthreePos = (self.three / self.end) * sliderWidth;
        $('.gameon-starbar__star--one').css({left: staronePos});
        $('.gameon-starbar__star--two').css({left: startwoPos});
        $('.gameon-starbar__star--three').css({left: starthreePos});

        self.numStars = 0;

        self._score = 0;
        self.setScore = function (score) {
            self._score = score;
            self.update()
        }
        self.getScore = function () {
            return self.score;
        }

        self.update = function () {
            $('.highlight-track').html(self.score);
            var conpleteRatio = self._score / self.end
            $(".gameon-starbar [data-slider]").simpleSlider("setRatio", conpleteRatio);

            var numStars = 0;
            if (self._score >= self.one) {
                $('.gameon-starbar__star--one').addClass('gameon-star--shiny');
                numStars++;
            }
            if (self._score >= self.two) {
                $('.gameon-starbar__star--two').addClass('gameon-star--shiny');
                numStars++;
            }
            if (self._score >= self.three) {
                $('.gameon-starbar__star--three').addClass('gameon-star--shiny');
                numStars++;
            }
            self.numStars = numStars;

            $('.gameon-starbar .highlight-track').html('<p class="gameon-starbar__score">' + self._score + '</p>')

        }
    };

    self.unlock = function (target) {
        var button = $(target + ' button');
        button.removeAttr('disabled');
        button.find('.glyphicon-lock').remove();
    }
    self.isLocked = function (target) {
        var button = $(target + ' button');
        return button.attr('disabled');
    }

    return self;
})();
