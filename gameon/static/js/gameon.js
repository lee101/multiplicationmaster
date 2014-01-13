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
    }

    userJSON.saveAchievement = function (achievementNumber, callback) {
        if (typeof callback == 'undefined') {
            callback = function (data) {
            }
        }
        $.ajax({
            "url": "/gameon/saveachievement",
            "data": {achievement: achievementNumber},
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
    }

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
    }

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
    }

    userJSON.saveLevelsUnlocked = function (levelsUnlocked, callback) {
        if (typeof callback == 'undefined') {
            callback = function (data) {
            }
        }
        $.ajax({
            "url": "/gameon/savelevelsunlocked",
            "data": {levelsunlocked: levelsUnlocked},
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
    }

    userJSON.saveDifficultiesUnlocked = function (difficultiesUnlocked, callback) {
        if (typeof callback == 'undefined') {
            callback = function (data) {
            }
        }
        $.ajax({
            "url": "/gameon/savedifficultiesunlocked",
            "data": {difficultiesunlocked: difficultiesUnlocked},
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
    }


    return userJSON;
}
var GameOn = function () {
    var self = this;
    (function InitUser() {

    })();

    this.getUser = function (callback) {
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
    }

    self.clock = function (gameOver, newGame, startTime) {
        var self = this;
        if (!startTime) {
            self.startTime = 5 * 60;
        }
        else {
            self.startTime = startTime;
        }

        var started = false;

        self.reset = function () {
            self.time = self.startTime;
            started = false;
        }

        self.start = function () {
            started = true;
        }

        self.pause = function () {
            started = false;
        }

        self.tick = function () {

        }

        self.getTime = function () {
            return self._formattedTime;
        }
        self.setTime = function (seconds) {
            self.time = seconds;
            self._updateFormattedTime();
        }
        self.time = self.setTime(self.startTime);

        self._updateFormattedTime = function () {
            var separator = ':';
            if (self.time % 60 <= 9) {
                separator = ':0'
            }
            self._formattedTime = Math.floor(self.time / 60) + separator + self.time % 60;
        }

        setInterval(function () {
            if (started) {
                self.setTime(self.time - 1);
                self._updateFormattedTime();
                self.tick();
            }
        }, 1000);

        //override functions
        var parent = gameOver;
        gameover = function () {
            parent();
            self.reset();
        }
        var parent2 = newGame;
        newGame = function () {
            parent2();
            self.reset();
            self.started();
        }

        return self;
    };

    return this;
}