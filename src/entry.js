require('./lib/hilo');
var config = require('./js/config');
var game = require('./js/game');

var gameContainer = document.getElementById("game");
var startBgStyle = document.getElementById("startBg").style;
if(config.noStart){
    startBgStyle.display = "none";
    game.init(gameContainer);
}
else{
    document.body.onclick = function(){
        startBgStyle.background = "url(../build/img/infoBg.jpg)";
        document.body.onclick = function(){
            document.body.onclick = null;
            startBgStyle.display = "none";
            game.init(gameContainer);
        }
    }
}