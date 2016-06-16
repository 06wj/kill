require('./lib/hilo');
var config = require('./js/config');
var game = require('./js/game');

var gameContainer = document.getElementById("game");
var startBg = document.getElementById("startBg");
if(config.noStart){
    startBg.style.display = "none";
    game.init(gameContainer);
}
else{
    document.body.onclick = function(){
        startBg.style.background = "url(../build/img/infoBg.jpg)";
        document.body.onclick = function(){
            document.body.onclick = null;
            startBg.style.display = "none";
            game.init(gameContainer);
        }
    }
}