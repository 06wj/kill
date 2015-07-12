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

            this.top = 51;
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
                x:650,
                y:200,
                playerNum:1
            });
            this.stage.addChild(player);
            playerArr.push(player);


	        var monsterArr = this.monsterArr = [];
	        var m = new Monster({
		        x: 500, y: 100
	        });
	        m.state = MonsterState.WAKE;
	        this.stage.addChild(m);
	        monsterArr.push(m);

	        var m1 = new Monster({
		        x: 200, y: 110
	        });
	        m1.state = MonsterState.WAKE;
	        this.stage.addChild(m1);
	        monsterArr.push(m1);

	        var m2 = new Monster({
		        x: 200, y: 120
	        });
	        m2.state = MonsterState.WAKE;
	        this.stage.addChild(m2);
	        monsterArr.push(m2);

	        var m3 = new Monster({
		        x: 200, y: 200
	        });
	        m3.state = MonsterState.WAKE;
	        this.stage.addChild(m3);
	        monsterArr.push(m3);


            var bgTop = new Bitmap({
                image:resource.get("roadTop"),
                y:600,
                pivotY:resource.get("roadTop").height
            }).addTo(this.stage);

            this.stage.onUpdate = function(){
                that.checkCollision();
            };

            this.hengRects = [
                this.bangArr[0],
                this.bangArr[2],
                new View({
                    x:0,
                    y:0,
                    width:1000,
                    height:game.top + 10,
                    // background:"rgba(255, 0, 0, .3)"
                }),
                new View({
                    x:0,
                    y:game.bottom - 10,
                    width:1000,
                    height:800-game.bottom + 10,
                    // background:"rgba(255, 0, 0, .3)"
                })
            ];

            this.shuRects = [
                this.bangArr[1],
                this.bangArr[3],
                new View({
                    x:0,
                    y:0,
                    width:game.left + 10,
                    height:800,
                    // background:"rgba(255, 0, 0, .05)"
                }),
                new View({
                    x:game.right - 10,
                    y:0,
                    width:1000-game.right + 10,
                    height:800,
                    // background:"rgba(255, 0, 0, .05)"
                })
            ];

            stage.addChild(this.hengRects[2]);
            stage.addChild(this.hengRects[3]);
            stage.addChild(this.shuRects[2]);
            stage.addChild(this.shuRects[3]);
        },
        checkCollision:function(){
            var that = this;
            var hengRects = this.hengRects;
            var shuRects = this.shuRects;

            for(var hi = 0;hi < hengRects.length;hi++){
                for(var hj = hi+1;hj < hengRects.length;hj++){
                    for(var si = 0;si < shuRects.length;si++){
                        for(var sj = si+1;sj < shuRects.length;sj++){
                            if(hi == 2 && hj == 3 && si == 2 && sj == 3){
                                continue;
                            }
                            if(
                                hengRects[hi].hitTestObject(shuRects[si]) &&
                                shuRects[si].hitTestObject(hengRects[hj]) &&
                                hengRects[hj].hitTestObject(shuRects[sj]) &&
                                shuRects[sj].hitTestObject(hengRects[hi])
                            ){
                                var monsters = that._getMonster(hengRects[hi], hengRects[hj], shuRects[si], shuRects[sj])
                            }
                        }
                    }
                }
            }

        },
        _getMonster:function(h0, h1, s0, s1){
            var that = this;
            var left = Math.min(s0.x, s1.x);
            var right = Math.max(s0.x + s0.width, s1.x + s1.width);
            var top = Math.min(h0.y, h1.y);
            var bottom = Math.max(h0.y + h0.height, h1.y + h1.height);


            this.monsterArr.forEach(function(monster){
                if(!monster.isDie && monster.x >= left && monster.x + monster.width <= right && monster.y >= top && monster.y + monster.height <= bottom){
                    monster.die && monster.die();
                }
            });
        }
    };

    return game;
}, {
    requires:["kill/resource", "kill/mediator", "kill/config", "kill/input", "kill/player", "kill/bang","kill/monster", "kill/background"]
});