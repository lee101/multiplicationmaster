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
        userJSON.achievements.push({achievement: achievementNumber})
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
        userJSON.volume = volume
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
        userJSON.mute = mute

    }

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
    }

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
    }


    return userJSON;
}
var gameOn = (function () {
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
    }

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


    self.renderVolumeControlTo = function (selector) {
        $(selector).jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: "http://commondatastorage.googleapis.com/wordsmashing%2Fws-piano-theme2.mp3",
                    oga: "http://commondatastorage.googleapis.com/wordsmashing%2Fws-piano-theme2.ogg"
                });
                $(this).jPlayer("option", "loop", true);
                $(this).jPlayer("play");
            },
            ended: function () { // The $.jPlayer.event.ended event
                $(this).jPlayer("play"); // Repeat the media
            },
            volumechange: function (event) {
                var myVol = event.jPlayer.options.volume;
                // myMuted = event.jPlayer.options.muted;
                $.ajax({
                    "url": "/savevolume",
                    "data": {"volume": myVol},
                    "success": function (text) {
                    },
                    "type": "GET",
                    "cache": false,
                    "error": function (xhr, error, thrown) {
                    }
                });
            },
            volume: self.user.volume,
            muted: self.user.mute,
            globalVolume: true,
            swfPath: "/js",
            supplied: "mp3, oga"
        });
    };

    self.loadSound = function (name, url) {
        soundManager.onready(function () {
            soundManager.createSound({
                id: name,
                url: url
            });
        });
    }

    self.playSound = function (name) {
        soundManager.onready(function () {
            soundManager.play(name);
        });
    }

    self.pauseAll = soundManager.pauseAll;
    self.resumeAll = soundManager.resumeAll;
    self.mute = soundManager.mute;
    self.unmute = soundManager.unmute;

    /**
     * @param volume 0 to 1 global volume
     */
    self.setVolume = function(volume) {
        volume = volume*100
        $.each(soundManager.sounds, function(name, sound) {
            sound.setVolume(volume)
        });
    }

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
    }

    self.mute = function () {
        $.ajax({
            "url": "/savemute",
            "data": {"muted": 1},
            "success": function (text) {
            },
            "type": "GET",
            "cache": false,
            "error": function (xhr, error, thrown) {
            }
        });
    }

    self.unmute = function () {
        $.ajax({
            "url": "/savemute",
            "data": {"muted": 0},
            "success": function (text) {
            },
            "type": "GET",
            "cache": false,
            "error": function (xhr, error, thrown) {
            }
        });
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

    return self;
})()
