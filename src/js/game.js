KISSY.add("kill/game", function(S, resource, mediator, config, input, Player, Bang, Monster, Background, states){
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
                that._initGame(config.state);
            });

            mediator.on("playerGameOver", function(d){
                var index = that.playerArr.indexOf(d.player);
                if(index > -1){
                    that.playerArr.splice(index, 1);
                    if(that.playerArr.length <= 0){
                        that._showGameEnd("gameover");
                    }
                }
            });
        },
        _initGame:function(stateIndex){
            var that = this;
            stateIndex = stateIndex || 0;
            if(!that._isInit){
                this._isInit = true;
                this.stage = new Stage({
                    container:this.gameContainer,
                    width:config.game.width,
                    height:config.game.height
                });
                var ticker = this.ticker = new Ticker(config.fps);
                ticker.addTick(this.stage);
                ticker.addTick(Tween);
                ticker.start();

                this._initBg();

                this.bangArr = [];
                this.playerArr = [];
                this.monsterArr = [];

                this.stateMask = new View({
                    x:0,
                    y:0,
                    width:1000,
                    height:600,
                    background:"#000"
                });
            }

            var stage = this.stage;
            var bangArr = this.bangArr;
            var playerArr = this.playerArr;
            var monsterArr = this.monsterArr;

            var state = states.getState(stateIndex);
            if(!state){
                that._showGameEnd("win");
                return;
            }

            state.bangs.forEach(function(bangCfg){
                var bang = new Bang(bangCfg);
                stage.addChild(bang);
                bangArr.push(bang);
            });

            state.monsters.forEach(function(monsterCfg){
                var m = new Monster(monsterCfg);
                stage.addChild(m);
                monsterArr.push(m);
            });

            state.players.forEach(function(playerCfg){
                var player = new Player(playerCfg);
                stage.addChild(player);
                playerArr.push(player);
            });

            this.hengRects = [
                this.bangArr[0],
                this.bangArr[2],
                this.leftWall,
                this.rightWall
            ];

            this.shuRects = [
                this.bangArr[1],
                this.bangArr[3],
                this.topWall,
                this.bottomWall
            ];
        },
        reset:function(){
            while(this.bangArr.length){
                    var bang = this.bangArr.pop();
                    bang.destroy && bang.destroy();
                    bang.removeFromParent();
                }
            while(this.monsterArr.length){
                var bang = this.monsterArr.pop();
                bang.destroy && bang.destroy();
                bang.removeFromParent();
            }
            while(this.playerArr.length){
                var bang = this.playerArr.pop();
                bang.destroy && bang.destroy();
                bang.removeFromParent();
            }
        },
        _showGameEnd:function(type){
            var that = this;
            this.endBg = this.endBg||document.getElementById("startBg");
            this.endBg.style.display = "block";
            this.endBg.style.background = "url(../src/img/" + type + "Bg.jpg)"
            this.endBg.onclick = function(){
                that.endBg.onclick = null;
                that.endBg.style.display = "none";
                that.reset();
                that._initGame(0);
            }
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


            this.monsterArr.forEach(function(monster, index){
                if(!monster.isDie && monster.x >= left && monster.x + monster.width <= right && monster.y >= top && monster.y + monster.height <= bottom){
                    monster.die && monster.die();
                    that.monsterArr.splice(index, 1);
                    if(that.monsterArr.length <= 0){
                        that._nextState();
                    }
                }
            });
        },
        _nextState:function(){
            var that = this;
            console.log("nextState", states.index + 1);
            this.playerArr.forEach(function(player){
                player.onUpdate = null;
                player.play("win");
            });
            setTimeout(function(){
                that.stateMask.alpha = 0;
                that.stage.addChild(that.stateMask);
                Tween.to(that.stateMask, {
                    alpha:1
                },{
                    duration:500,
                    onComplete:function(){
                        that.reset();
                        Tween.to(that.stateMask, {
                            alpha:0
                        },{
                            duration:800,
                            onComplete:function(){
                                that._initGame(states.index + 1);
                            }
                        })
                    }
                })
            }, 2000);
        },
        _initBg:function(){
            var that = this;
            var bgTop = new Bitmap({
                image:resource.get("roadTop"),
                y:600,
                pivotY:resource.get("roadTop").height
            }).addTo(this.stage);

            this.stage.onUpdate = function(){
                that.checkCollision();
            };

            var bg = this.bg = new Background();
            this.stage.addChild(bg);

            this.leftWall = new View({
                x:0,
                y:0,
                width:1000,
                height:this.top + 10
            });

            this.rightWall = new View({
                x:0,
                y:this.bottom - 10,
                width:1000,
                height:800-this.bottom + 10
            });

            this.topWall = new View({
                x:0,
                y:0,
                width:this.left + 10,
                height:800
            });

            this.bottomWall = new View({
                x:this.right - 10,
                y:0,
                width:1000-this.right + 10,
                height:800
            });

            this.stage.addChild(this.leftWall, this.rightWall, this.topWall, this.bottomWall);
            this.qiangs = [this.leftWall, this.rightWall, this.topWall, this.bottomWall];
            if(config.showHit){
                this.leftWall.background = this.rightWall.background = this.topWall.background = this.bottomWall.background = "rgba(255, 0, 0, .3)";
            }
        }
    };

    return game;
}, {
    requires:["kill/resource", "kill/mediator", "kill/config", "kill/input", "kill/player", "kill/bang","kill/monster", "kill/background", "kill/states"]
});