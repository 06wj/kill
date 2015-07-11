KISSY.add("kill/game", function(S, resource, mediator, config, input, Player, Bang, Monster, Background){
    var Stage = Hilo.Stage;
    var Ticker = Hilo.Ticker;
    var Container = Hilo.Container;
    var Bitmap = Hilo.Bitmap;
    var View = Hilo.View;
    var Tween = Hilo.Tween;

    var game = window._game = {
        _isInit:false,
        init:function(gameContainer){
            this.gameContainer = gameContainer;
            this._bindEvent();
            input.init();
            resource.load();

            this.top = 65;
            this.left = 20;
            this.bottom = 552;
            this.right = 982;
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
                ticker.addTick(Tween);
                ticker.start();
            }

            var bg = this.bg = new Background();
            this.stage.addChild(bg);

            var bangArr = this.bangArr = [];
            var bang = window._bang = new Bang({
                x:200,
                y:300,
                length:200,
                rotation:0
            });
            this.stage.addChild(bang);
            bangArr.push(bang);

            var bang = window._bang = new Bang({
                x:700,
                y:100,
                rotation:90,
                length:300
            });
            this.stage.addChild(bang);
            bangArr.push(bang);

            var bang = window._bang = new Bang({
                x:200,
                y:400,
                length:200,
                rotation:0
            });
            this.stage.addChild(bang);
            bangArr.push(bang);

            var bang = window._bang = new Bang({
                x:100,
                y:100,
                rotation:90,
                length:300
            });
            this.stage.addChild(bang);
            bangArr.push(bang);

            var playerArr = this.playerArr = [];
            var player = window._player = new Player({
                x:150,
                y:200,
                playerNum:0
            });
            this.stage.addChild(player);
            playerArr.push(player);

            var player = window._player = new Player({
                x:150,
                y:200,
                playerNum:1
            });
            this.stage.addChild(player);
            playerArr.push(player);


	        var monsterArr = this.monsterArr = [];
	        var m = new Monster({
		        x: 100, y: 100
	        });
	        this.stage.addChild(m);
	        monsterArr.push(m);


            var bgTop = new Bitmap({
                image:resource.get("roadTop"),
                y:600,
                pivotY:resource.get("roadTop").height
            }).addTo(this.stage);

        },
    };

    return game;
}, {
    requires:["kill/resource", "kill/mediator", "kill/config", "kill/input", "kill/player", "kill/bang","kill/monster", "kill/background"]
});