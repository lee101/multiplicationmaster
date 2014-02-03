describe("game", function () {

    it('should let you navigate around', function(){
        expect(views.name).toBe('start');
        views.difficulties()
        expect(views.name).toBe('difficulties');
        views.levels(EASY)
        expect(views.name).toBe('levels');
        views.level(1)
        expect(views.name).toBe('level');


        views.levels(EASY)
        expect(views.name).toBe('levels');
        views.difficulties()
        expect(views.name).toBe('difficulties');
        views.start()
        expect(views.name).toBe('start');
    });

});
