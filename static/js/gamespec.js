describe("game", function () {

    it('should let you navigate around', function () {
        expect(views.name).toBe('start');
        views.difficulties()
        expect(views.name).toBe('difficulties');
        views.levels(EASY)
        expect(views.name).toBe('levels');
        views.level(1)
        expect(views.name).toBe('level');

        $('.back-btn').click();
        expect(views.name).toBe('levels');
        $('.back-btn').click();
        expect(views.name).toBe('difficulties');
        $('.back-btn').click();
        expect(views.name).toBe('start');
    });

    it('should let you unlock difficulties', function (done) {
        expect(views.name).toBe('start');
        views.difficulties();
        gameon.getUser(function (user) {
            user.saveDifficultiesUnlocked(2);
            $('.back-btn').click();
            views.difficulties();
            var disabled = $('.mm-difficulty--2 .mm-difficulty__btn').attr('disabled');
            expect(disabled).toBeFalsy();
            $('.back-btn').click();
            done();
        });
    });

    it('should let you unlock levels', function (done) {
        expect(views.name).toBe('start');
        views.difficulties();
        gameon.getUser(function (user) {
            user.saveLevelsUnlocked(5);
            views.start();
            views.difficulties();
            var levelsView = views.levels(EASY);
            expect(levelsView.board.tiles[4].locked).toBe(false);
            $('.back-btn').click();
            $('.back-btn').click();
            done();
        });
    });

    var currLevel;
    it('should let you click on tiles', function (done) {
        expect(views.name).toBe('start');
        views.difficulties();
        views.levels(EASY);
        currLevel = views.level(1);
        var board = currLevel.board;
        board.tiles[0].click();
        board.tiles[0].click();
        board.tiles[0].click();
        board.tiles[1].click();
        board.tiles[2].click();
        board.tiles[0].click();
        board.tiles[0].click();
        board.tiles[1].click();
        board.tiles[2].click();
        board.tiles[2].click();
        board.tiles[0].click();
        board.tiles[0].click();
        board.tiles[1].click();
        board.tiles[2].click();
        done();
    });

    it('THEN it should let you loose', function (done) {

        var board = currLevel.board;
        currLevel.
        done();
    });

});
