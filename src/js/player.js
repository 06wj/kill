KISSY.add("kill/player", function(S, resource, input){
    var Class = Hilo.Class;
    var Container = Hilo.Container;
    var Sprite = Hilo.Sprite;
    var Bitmap = Hilo.Bitmap;


    var Player = window._Player = Class.create({
        Extends:Container,
        constructor:function(properties){
            Player.superclass.constructor.call(this, properties);
            this.playerNum = properties.playerNum;
            this.width = this.height = 44;
            this.pivotX = 22;
            var textures = Hilo.TextureAtlas.createSpriteFrames([
                ["run", "24-29", resource.get("player"), 22, 22, true, 100],
                ["run2", "24-29", resource.get("player"), 22, 22, true, 10]
            ]);
            this.display = new Sprite({
                frames:textures,
                loop:true,
                timeBased:true,
                scaleX:2,
                scaleY:2
            });
            this.addChild(this.display);
            this.display.play("run");

            this.bangArr = _game.bangArr;

            this.width = 44;
            this.height = 44;
            this.halfWidth = this.width * .5;
            this.halfHeight = this.height * .5;
        },
        getInput:function(data){
            return input[data + this.playerNum];
        },
        onUpdate:function(){
            var that = this;
            var v = 5;
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
                this.scaleX = 1;
            }
            else if(this.vx < 0){
                this.scaleX = -1;
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
                    if(top != bangBottom && bottom != bangTop){
                        if(right > bangLeft && left < bangLeft){

                            if(that.vx > 0 || bang.lastVx < 0){
                                that.x = bangLeft - that.halfWidth;
                            }
                            if(isHold && that.vx > 0){
                                bang.vx += right - bangLeft;
                            }
                        }
                        else if(left < bangRight && right > bangRight){
                            if(that.vx < 0  || bang.lastVx > 0){
                                that.x = bangRight + that.halfWidth;
                            }
                            if(isHold && that.vx < 0){
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
                                bang.vy += bottom - bangTop;
                            }
                        }
                        else if(top < bangBottom && bottom > bangBottom){
                            if(that.vy < 0  || bang.lastVy > 0){
                                that.y = bangBottom;
                            }

                            if(isHold && that.vy < 0){
                                bang.vy += top - bangBottom;
                            }
                        }
                    }




                }
            });
        }
    })
    return Player;
},{
    requires:["kill/resource", "kill/input"]
});