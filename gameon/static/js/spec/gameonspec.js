describe("gameon", function () {

    var gameOn = [];
    beforeEach(function () {
        gameOn = new GameOn();
    });

    it("should be able to get a user", function (done) {
        gameOn.getUser(function (user) {
            expect(user.volume).toBeDefined();
            done();
        })
    });

    describe("when highscores have been added", function () {
        beforeEach(function (done) {
            gameOn.getUser(function (user) {
                user.saveHighScore(1, 123, function (data) {
                    done();

                })
            })
        });

        it("should be able to get a user with a score and highscore", function (done) {
            gameOn.getUser(function (user) {
                expect(user.scores[0].score).toEqual(123)
                expect(user.scores[0].game_mode).toEqual(1)
                done();
            })
        });
        it("should be able to get a fresh user with a score and highscore", function (done) {
            delete gameOn.user
            gameOn.getUser(function (user) {
                expect(user.scores[0].score).toEqual(123)
                expect(user.scores[0].game_mode).toEqual(1)
                done();
            })
        });
    });

    describe("when achievements have been added", function () {
        var achievementType = 1
        beforeEach(function (done) {
            gameOn.getUser(function (user) {
                user.saveAchievement(achievementType, function (data) {
                    done();
                })
            })
        });

        it("should be able to get a user with an achievement", function (done) {
            gameOn.getUser(function (user) {
                expect(user.achievements[0].type).toEqual(achievementType)
                done();
            })
        });
        it("should be able to get a fresh user with an achievement", function (done) {
            delete gameOn.user
            gameOn.getUser(function (user) {
                expect(user.achievements[0].type).toEqual(achievementType)
                done();
            })
        });
    });

    describe("when a user has had data edited", function () {
        var achievementType = 1
        var volume = 0.2
        var mute = 1
        var levels_unlocked = 10
        var difficulties_unlocked = 3
        beforeEach(function (done) {
            gameOn.getUser(function (user) {
                var numCallsRequired = 4
                var numCallsCompleted = 0

                function doneFunc(data) {
                    numCallsCompleted++
                    if (numCallsCompleted >= numCallsRequired) {
                        done()
                    }
                }

                user.saveVolume(volume, doneFunc)
                user.saveMute(mute, doneFunc)
                user.saveLevelsUnlocked(levels_unlocked, doneFunc)
                user.saveDifficultiesUnlocked(difficulties_unlocked, doneFunc)
            })
        });

        it("should have correct volume", function (done) {
            gameOn.getUser(function (user) {
                expect(user.volume).toEqual(volume)
                done();
            })
        });
        it("should have correct mute", function (done) {
            gameOn.getUser(function (user) {
                expect(user.mute).toEqual(mute)
                done();
            })
        });
        it("should have correct levels_unlocked", function (done) {
            gameOn.getUser(function (user) {
                expect(user.levels_unlocked).toEqual(levels_unlocked)
                done();
            })
        });
        it("should have correct difficulties_unlocked", function (done) {
            gameOn.getUser(function (user) {
                expect(user.difficulties_unlocked).toEqual(difficulties_unlocked)
                done();
            })
        });

        it("should have persisted volume", function (done) {
        	delete gameOn.user
            gameOn.getUser(function (user) {
                expect(user.volume).toEqual(volume)
                done();
            })
        });
        it("should have persisted mute", function (done) {
        	delete gameOn.user
            gameOn.getUser(function (user) {
                expect(user.mute).toEqual(mute)
                done();
            })
        });
        it("should have persisted levels_unlocked", function (done) {
        	delete gameOn.user
            gameOn.getUser(function (user) {
                expect(user.levels_unlocked).toEqual(levels_unlocked)
                done();
            })
        });
        it("should have persisted difficulties_unlocked", function (done) {
        	delete gameOn.user
            gameOn.getUser(function (user) {
                expect(user.difficulties_unlocked).toEqual(difficulties_unlocked)
                done();
            })
        });
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