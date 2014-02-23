//beforeEach(function() {
//  this.addMatchers({
//    toBePlaying: function(expectedSong) {
//      var player = this.actual;
//      return player.currentlyPlayingSong === expectedSong &&
//             player.isPlaying;
//    }
//  });
//});
var specHelpers = new (function () {
    'use strict';
    var self = this;

    self.clickBtn = function (target) {
        $(target + ' button').click();
    };

    self.deleteCookie = function (name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

})();
