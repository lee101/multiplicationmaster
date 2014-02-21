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
        currLevel.endHandler.setMoves(0);
        done();
    });
    it('THEN you can try again and get better', function (done) {
        currLevel = views.level(1);
        var one = currLevel.starBar.one;
        currLevel.starBar.setScore(one);
        currLevel.endHandler.setMoves(0);

        currLevel = views.level(1);
        var two = currLevel.starBar.two;
        currLevel.starBar.setScore(two);
        currLevel.endHandler.setMoves(0);

        currLevel = views.level(1);

        expect(currLevel.solve(0,[1,2])).toBe(-1);

        var threestar = currLevel.starBar.end;
        currLevel.starBar.setScore(threestar);
        currLevel.endHandler.setMoves(0);
        done();
    });
    it('THEN you can try level 2 and replay', function (done) {
        currLevel = views.level(2);
        expect(currLevel.starBar.numStars).toBe(0);
        var one = currLevel.starBar.one;
        currLevel.starBar.setScore(one);
        currLevel.endHandler.setMoves(0);

//        $('.mm-replay').click();
        currLevel = views.level(2);

        expect(currLevel.starBar.numStars).toBe(0);
        currLevel.endHandler.setMoves(0);

//
//        currLevel = views.level(1);
//        var two = currLevel.starBar.two;
//        currLevel.starBar.setScore(two);
//        currLevel.endHandler.setMoves(0);
//
//        currLevel = views.level(1);
//
//        expect(currLevel.solve(0, [1, 2])).toBe(-1);
//
//        var threestar = currLevel.starBar.end;
//        currLevel.starBar.setScore(threestar);
//        currLevel.endHandler.setMoves(0);
        done();
    });
    it('THEN you get to unlock everything!', function (done) {
        gameon.getUser(function (user) {
            user.saveDifficultiesUnlocked(999);
            user.saveLevelsUnlocked(999);
        });
        done();
    });
    it('THEN you clock the game!', function (done) {
        views.difficulties();
        views.levels(EXPERT);
        currLevel = views.level(LEVELS[LEVELS.length - 1].id);
        currLevel.starBar.setScore(9999999999999);
        currLevel.endHandler.setMoves(0);

        var isNextButtonVisible = $('#mm-next-level').is(':visible');
        expect(isNextButtonVisible).toBe(false);
        done();
    });
});
