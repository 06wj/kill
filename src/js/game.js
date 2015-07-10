KISSY.add("kill/game", function(S, resource, mediator, config){
    var Stage = Hilo.Stage;
    var Ticker = Hilo.Ticker;
    var Container = Hilo.Container;
    var Bitmap = Hilo.Bitmap;
    var View = Hilo.View;

    var game = window._game = {
        _isInit:false,
        init:function(gameContainer){
            this.gameContainer = gameContainer;
            this._bindEvent();
            resource.load();
        },
        _bindEvent:function(){
            var that = this;
            mediator.on("gameLoadComplete", function(){
                that._initGame();
            });
        },
        _initGame:function(){
            var that = this;
            if(!that._isInit){
                this._isInit = true;
                var stage = this.stage = new Stage({
                    container:this.gameContainer,
                    width:config.game.width,
                    height:config.game.height
                });
                var ticker = this.ticker = new Ticker(config.fps);
                ticker.addTick(stage);
                ticker.start();
            }

            console.log("this._initGame");

            var player = new Bitmap({
                image:resource.get("player")
            });
            this.stage.addChild(player)
        },
    };

    return game;
}, {
    requires:["kill/resource", "kill/mediator", "kill/config"]
});