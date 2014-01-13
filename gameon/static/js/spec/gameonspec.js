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
                user.saveHighScore(1, 123, function(data) {
                	done();

                })
            })
        });

        it("should be able to get a user with a score and highscore", function (done) {
            gameOn.getUser(function (user) {
                expect(user.volume).toBeDefined();
                expect(user.scores[0].score).toEqual(123)
                expect(user.scores[0].game_mode).toEqual(1)
                done();
            })
        });
        it("should be able to get a fresh user with a score and highscore", function (done) {
            delete gameOn.user
            gameOn.getUser(function (user) {
                expect(user.volume).toBeDefined();
                expect(user.scores[0].score).toEqual(123)
                expect(user.scores[0].game_mode).toEqual(1)
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