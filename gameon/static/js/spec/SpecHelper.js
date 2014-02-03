//beforeEach(function() {
//  this.addMatchers({
//    toBePlaying: function(expectedSong) {
//      var player = this.actual;
//      return player.currentlyPlayingSong === expectedSong &&
//             player.isPlaying;
//    }
//  });
//});
var specHelpers = new (function(){
    'use strict';
    var self = this;

    self.clickBtn = function(target){
        $(target + ' button').click();
    };

})();
