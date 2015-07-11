KISSY.add("kill/game", function(S, resource, mediator, config, input, Player, Bang){
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
            input.init();
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

            var bangArr = this.bangArr = [];
            var bang = window._bang = new Bang({
                x:200,
                y:300
            });
            this.stage.addChild(bang);
            bangArr.push(bang);

            var player = window._player = new Player({
                x:150,
                y:200,
                playerNum:0
            });
            this.stage.addChild(player);
            player.bangArr = bangArr;

            var player = window._player = new Player({
                x:150,
                y:200,
                playerNum:1
            });
            this.stage.addChild(player);
            player.bangArr = bangArr;
        },
    };

    return game;
}, {
    requires:["kill/resource", "kill/mediator", "kill/config", "kill/input", "kill/player", "kill/bang"]
});