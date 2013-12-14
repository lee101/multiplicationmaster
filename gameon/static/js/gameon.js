// Globals: JQuery/$


var gameon = function() {
	var self = this;
    (function InitUser() {

    })();

    this.getUser = function(callback) {
        if(this.user) {
            callback(user);
        }
        else {
            $.ajax({
                "url":  "/gameon/getuser",
                "data": {},
                "success": function (user) {
                	
                },
                "type": "GET",
                "cache": false,
                "error": function (xhr, error, thrown) {
                    if ( error == "parsererror" ) {
                    }
                }
            });
        }
    }

function changeDifficulty(newDifficulty){
    modal.close();
    newGame();
    difficulty = newDifficulty;
    var difficultyText = "Medium";
    if(difficulty == EASY){
        difficultyText = "Easy";
    }
    else if(difficulty == HARD){
        difficultyText = "Hard";
    }

    $.ajax( {
        "url":  "/savedifficulty",
        "data": {"difficulty": difficulty},
        "success": function (text) {

        },
        "type": "GET",
        "cache": false,
        "error": function (xhr, error, thrown) {
            if ( error == "parsererror" ) {
            }
        }
    } );

    $('#changedifficultybutton').text('Difficulty: ' + difficultyText);
}
	
    self.clock = function(gameOver, newGame, startTime) {
        var self = this;
        if(!startTime) {
        	self.startTime = 5*60;
        }
        else {
        	self.startTime = startTime;
        }

        var started = false;

        self.reset = function() {
            self.time = self.startTime;
            started = false;
        }

        self.start = function() {
            started = true;
        }

        self.pause = function() {
        	started = false;
        }

        self.tick = function() {

        }

        self.getTime() {
        	return self._formattedTime;
        }
        self.setTime(seconds) {
        	self.time = seconds;
        	self._updateFormattedTime();
        }
        self.time = self.setTime(self.startTime);

        self._updateFormattedTime = function() {
            var seperator = ':';
            if (self.time%60 <= 9) {
                seperator = ':0'
            }
            self._formattedTime = Math.floor(self.time/60) + seperator + self.time%60;
        }

        setInterval(function() {
            if(started) {
                self.setTime(self.time - 1);
                self._updateFormattedTime();
                self.tick();
            }
        },1000);

        //override functions
        var parent = gameOver;
        gameover = function(){
            parent();
            self.reset();
        }
        var parent2 = newGame;
        newGame = function(){
            parent2();
            self.reset();
            self.started();
        }

        return self;
    };

    return this;
}