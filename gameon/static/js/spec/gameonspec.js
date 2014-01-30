describe("gameon", function () {

    it("should be able to play music (looping)", function (done) {
        gameon.loadSound("music", '/gameon/static/music/ws-theme.mp3');
        gameon.loopSound("music");
        done()

    });

    it("should be able to play sounds", function (done) {
        gameon.loadSound("sound", '/gameon/static/music/doublepoints.m4a');
        gameon.playSound("sound");
        done()
    });

    it("should be able to get a user", function (done) {
        gameon.getUser(function (user) {
            expect(user.volume).toBeDefined();
            done();
        })
    });

    describe("when highscores have been added", function () {
        beforeEach(function (done) {
            gameon.getUser(function (user) {
                user.saveHighScore(1, 123, function (data) {
                    done();
                })
            })
        });

        it("should be able to get a user with a score and highscore", function (done) {
            gameon.getUser(function (user) {
                expect(user.scores[0].score).toEqual(123);
                expect(user.scores[0].game_mode).toEqual(1);
                done();
            })
        });
        it("should be able to get a fresh user with a score and highscore", function (done) {
            delete gameon.user;
            gameon.getUser(function (user) {
                expect(user.scores[0].score).toEqual(123);
                expect(user.scores[0].game_mode).toEqual(1);
                done();
            })
        });
    });

    describe("when achievements have been added", function () {
        var achievementType = 1;
        beforeEach(function (done) {
            gameon.getUser(function (user) {
                user.saveAchievement(achievementType, function (data) {
                    done();
                })
            })
        });

        it("should be able to get a user with an achievement", function (done) {
            gameon.getUser(function (user) {
                expect(user.achievements[0].type).toEqual(achievementType);
                done();
            })
        });
        it("should be able to get a fresh user with an achievement", function (done) {
            delete gameon.user;
            gameon.getUser(function (user) {
                expect(user.achievements[0].type).toEqual(achievementType);
                done();
            })
        });
    });

    describe("when a user has had data edited", function () {
        var achievementType = 1;
        var volume = 0.2;
        var mute = 1;
        var levels_unlocked = 10;
        var difficulties_unlocked = 3;
        beforeEach(function (done) {
            gameon.getUser(function (user) {
                var numCallsRequired = 4;
                var numCallsCompleted = 0;

                function doneFunc(data) {
                    numCallsCompleted++;
                    if (numCallsCompleted >= numCallsRequired) {
                        done()
                    }
                }

                user.saveVolume(volume, doneFunc);
                user.saveMute(mute, doneFunc);
                user.saveLevelsUnlocked(levels_unlocked, doneFunc);
                user.saveDifficultiesUnlocked(difficulties_unlocked, doneFunc)
            })
        });

        it("should have correct volume", function (done) {
            gameon.getUser(function (user) {
                expect(user.volume).toEqual(volume);
                done();
            })
        });
        it("should have correct mute", function (done) {
            gameon.getUser(function (user) {
                expect(user.mute).toEqual(mute);
                done();
            })
        });
        it("should have correct levels_unlocked", function (done) {
            gameon.getUser(function (user) {
                expect(user.levels_unlocked).toEqual(levels_unlocked);
                done();
            })
        });
        it("should have correct difficulties_unlocked", function (done) {
            gameon.getUser(function (user) {
                expect(user.difficulties_unlocked).toEqual(difficulties_unlocked);
                done();
            })
        });

        it("should have persisted volume", function (done) {
            delete gameon.user;
            gameon.getUser(function (user) {
                expect(user.volume).toEqual(volume);
                done();
            })
        });
        it("should have persisted mute", function (done) {
            delete gameon.user;
            gameon.getUser(function (user) {
                expect(user.mute).toEqual(mute);
                done();
            })
        });
        it("should have persisted levels_unlocked", function (done) {
            delete gameon.user;
            gameon.getUser(function (user) {
                expect(user.levels_unlocked).toEqual(levels_unlocked);
                done();
            })
        });
        it("should have persisted difficulties_unlocked", function (done) {
            delete gameon.user;
            gameon.getUser(function (user) {
                expect(user.difficulties_unlocked).toEqual(difficulties_unlocked);
                done();
            })
        });
    });
    describe("the clock is started", function () {
        var seconds = 2;
        var clock = {};
        beforeEach(function () {
            function gameOver() {

            }

            jasmine.clock().install();
            clock = new gameon.clock(gameOver, seconds);
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it("should be able to start pause unpause", function (done) {
            clock.start();
            clock.pause();
            clock.unpause();
            done();
        });
        it("it should go down + gameover should be called when the clock runs out", function (done) {
            function gameOver() {
                done();
            }

            var clock2 = new gameon.clock(gameOver, seconds);

            clock2.start();
            jasmine.clock().tick(1001);
            expect(clock2.seconds).toEqual(seconds - 1);
            jasmine.clock().tick(1001);

        });
    });

    // ========== BOARD STUFF =================
    var board;
    var Tile = function () {
        var self = this;
        self.number = gameon.math.numberBetween(1, 5);
        self.click = function () {
        };
        self.render = function () {
            return '<button type="button" class="btn btn-danger btn-lg">' + self.number + '</button>';
        };
    };
    it("should be able to create & render a board", function (done) {
        var tiles = [];
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                var tile = new Tile();
                tile.click = function () {
                    console.log('click');
                    done();
                }
                tiles.push(tile);

            }
        }
        board = new gameon.board(5, 5, tiles);
        board.render();
        $('[data-yx="' + board.name + '-0-0"]').click();
    });

    it("board should be able to delete tiles and do a falldown animation", function (done) {
        var endPos = board.tiles.length - 1;

        board.tiles[endPos].deleted = true;
        board.tiles[endPos - 1].deleted = true;
        board.tiles[endPos - 2].deleted = true;
        board.tiles[endPos - 3].deleted = true;
        board.tiles[endPos - 4].deleted = true;
        board.tiles[5].deleted = true;

        var newTiles = [];
        for (var j = 0; j < 6; j++) {
            var tile = new Tile();
            tile.click = function () {
                console.log('click');
                done();
            }
            newTiles.push(tile);
        }
        board.falldown(newTiles, function () {
            board.render()
            board.tiles[endPos - 1].deleted = true;

            var newTiles = [];
            for (var j = 0; j < 1; j++) {
                var tile = new Tile();
                tile.click = function () {
                    console.log('click');
                    done();
                }
                newTiles.push(tile);
            }
            board.falldown(newTiles, function(){})
        });
        done();
    });

//
//    // demonstrates use of spies to intercept and test method calls
//    it("tells the current song if the user has made it a favorite", function () {
//        spyOn(song, 'persistFavoriteStatus');
//
//        player.play(song);
//        player.makeFavorite();
//
//        expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
//    });
//
//    //demonstrates use of expected exceptions
//    describe("#resume", function () {
//        it("should throw an exception if song is already playing", function () {
//            player.play(song);
//
//            expect(function () {
//                player.resume();
//            }).toThrow("song is already playing");
//        });
//    });
});
