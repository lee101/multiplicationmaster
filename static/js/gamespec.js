describe("game", function () {

    it('should let you navigate around', function(){
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
    it('should let you unlock difficulties', function(done){
        expect(views.name).toBe('start');
        views.difficulties();
        gameon.getUser(function(user){
            user.saveDifficultiesUnlocked(2);
            views.start();
            views.difficulties();
            var disabled = $('.mm-difficulty--2 .mm-difficulty__btn').attr('disabled');
            expect(disabled).toBeFalsy();
            done();
        })
    });

});
