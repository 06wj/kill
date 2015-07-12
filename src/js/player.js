KISSY.add("kill/player", function(S, resource, input, mediator, config){
    var Class = Hilo.Class;
    var Container = Hilo.Container;
    var Sprite = Hilo.Sprite;
    var Bitmap = Hilo.Bitmap;


    var Player = window._Player = Class.create({
        Extends:Container,
        constructor:function(properties){
            Player.superclass.constructor.call(this, properties);
            if(config.showHit){
                this.background = "rgba(111,0,255,.3)";
            }

            this.playerNum = properties.playerNum;
            this.width = this.height = 44;
            this.pivotX = 22;
            var img = resource.get("player" + (this.playerNum + 1));
            var textures = Hilo.TextureAtlas.createSpriteFrames([
                ["push", "0,1", img, 51, 49, true, 300],
                ["state", "2", img, 51, 49, true, 300],
                ["walk", "3,4", img, 51, 49, true, 300],
                ["win", "5,6", img, 51, 49, true, 300]
            ]);
            this.display = new Sprite({
                x:-5,
                y:-5,
                frames:textures,
                loop:true,
                timeBased:true
            });
            this.addChild(this.display);
            this.play("walk");

            this.bangArr = _game.bangArr;

            this.width = 41;
            this.height = 39;
            this.halfWidth = this.width * .5;
            this.halfHeight = this.height * .5;
        },
        play:function(animName){
            if(this._currentAnim !== animName){
                this._currentAnim = animName;
                this.display.goto(animName);
            }
        },
        die:function(){
            var that = this;
            if(!this.isDie){
                this.isDie = true;
                this.onUpdate = null;
                this.display.removeFromParent();
                var textures = Hilo.TextureAtlas.createSpriteFrames([
                    ["die", "0-7", resource.get("playerDie" + (this.playerNum + 1)), 79, 49, false, 200]
                ]);
                this.display = new Sprite({
                    frames:textures,
                    loop:true,
                    timeBased:true
                });
                this.addChild(this.display);
                this.display.play();

                setTimeout(function(){
                    that.display.removeFromParent();
                    mediator.fire("playerGameOver", {
                        player:that
                    });
                }, 2000);
            }
        },
        getInput:function(data){
            return input[data + this.playerNum];
        },
        onUpdate:function(){
            var that = this;
            var v = 3;
            if(that.getInput("up")){
                this.vy = -v;
            }
            else if(that.getInput("down")){
                this.vy = v;
            }
            else{
                this.vy = 0;
            }

            if(that.getInput("left")){
                this.vx = -v;
            }
            else if(that.getInput("right")){
                this.vx = v;
            }
            else{
                this.vx = 0;
            }

            if(this.vx > 0){
                this.scaleX = -1;
            }
            else if(this.vx < 0){
                this.scaleX = 1;
            }

            this.x += this.vx;
            this.y += this.vy;

            if(this.x + this.halfWidth > _game.right){
                this.x = _game.right - this.halfWidth;
            }
            else if(this.x - this.halfWidth < _game.left){
                this.x = _game.left + this.halfWidth;
            }

            if(this.y + this.height > _game.bottom){
                this.y = _game.bottom - this.height;
            }
            else if(this.y < _game.top){
                this.y = _game.top;
            }

            var isHold = that.getInput("hold");
            if(isHold){
                this.play("push");
            }
            else if(this.vx || this.vy){
                this.play("walk");
            }
            else{
                this.play("state");
            }

            this.bangArr.forEach(function(bang){
                var left = that.x - that.halfWidth;
                var right = that.x + that.halfWidth;
                var top = that.y;
                var bottom = that.y + that.height;

                var bangLeft = bang.x;
                var bangRight = bang.x + bang.width;
                var bangTop = bang.y;
                var bangBottom = bang.y + bang.height;

                if(bang.hitTestObject(that)){
                    bang["lastHit" + that.playerNum] = that;
                    if(top != bangBottom && bottom != bangTop){
                        if(right > bangLeft && left < bangLeft){
                            if(that.vx > 0 || bang.lastVx < 0){
                                that.x = bangLeft - that.halfWidth;
                            }
                            if(isHold && that.vx > 0){
                                that.x += that.vx;
                                bang.vx += right - bangLeft;
                            }
                        }
                        else if(left < bangRight && right > bangRight){
                            if(that.vx < 0  || bang.lastVx > 0){
                                that.x = bangRight + that.halfWidth;
                            }
                            if(isHold && that.vx < 0){
                                that.x += that.vx;
                                bang.vx += left - bangRight;
                            }
                        }
                    }

                    if(left != bangRight && right != bangLeft){
                        if(bottom > bangTop && top < bangTop){
                            if(that.vy > 0 || bang.lastVy < 0){
                                that.y = bangTop - that.height;
                            }

                            if(isHold && that.vy > 0){
                                that.y += that.vy;
                                bang.vy += bottom - bangTop;
                            }
                        }
                        else if(top < bangBottom && bottom > bangBottom){
                            if(that.vy < 0  || bang.lastVy > 0){
                                that.y = bangBottom;
                            }

                            if(isHold && that.vy < 0){
                                that.y += that.vy;
                                bang.vy += top - bangBottom;
                            }
                        }
                    }
                }
                else{
                    if(bang["lastHit" + that.playerNum] == that){
                        if(isHold){
                            if(top != bangBottom && bottom != bangTop){
                                if(left >= bangRight && that.vx > 0){
                                    bang.vx += that.vx;
                                }
                                else if(right <= bangLeft && that.vx < 0){
                                    bang.vx += that.vx;
                                }
                            }
                            if(left != bangRight && right != bangLeft){
                                if(top >= bangBottom && that.vy > 0){
                                    bang.vy += that.vy;
                                }
                                else if(bottom <= bangTop && that.vy < 0){
                                    bang.vy += that.vy;
                                }
                            }
                        }
                        else{
                            bang["lastHit" + that.playerNum] = false;
                        }
                    }
                }
            });
        }
    });

    mediator.on("playerDied", function(d){
        if(!config.god){
            d.player.die();
        }
    });
    return Player;
},{
    requires:["kill/resource", "kill/input", "kill/mediator", "kill/config"]
});