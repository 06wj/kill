KISSY.add("kill/bang", function(S, resource){
    var Class = Hilo.Class;
    var Sprite = Hilo.Sprite;
    var Container = Hilo.Container;
    var View = Hilo.View;
    var Tween = Hilo.Tween;
    var Bitmap = Hilo.Bitmap;

    var Bang = Class.create({
        Extends:Container,
        constructor:function(properties){
            Bang.superclass.constructor.call(this, properties);

            var width = properties.length;
            this.rotation = 0;
            var rotation = properties.rotation;

            this.width = rotation == 90?20:width + 34;
            this.height = rotation == 0?20:width + 34;
            // this.background = "rgba(0,255,0,.4)"
            this.vx = this.vy = 0;
            this.display = new Container({
                x:rotation == 90?43:0,
                y:rotation == 0?-25:0,
                rotation:rotation
            });
            this.topContainer = new Container();
            this.bottomContainer = new Container();

            this.addChild(this.display);
            this.display.addChild(this.bottomContainer);
            this.display.addChild(this.topContainer);

            var middle = new Bitmap({
                x:17,
                y:20,
                scaleX:width*.1,
                image:resource.get("stick_middle")
            });
            this.topContainer.addChild(middle);

            var light = new Bitmap({
                x:20,
                y:18,
                image:resource.get("stick_light")
            });
            this.topContainer.addChild(light);

            var delay = Math.random() * 1000;
            var loopTween = function(){
                light.y = 18;
                Tween.to(light, {
                    x:width
                },{
                    duration:1000,
                    delay:delay,
                    onComplete:function(){
                        light.y = 38;
                        Tween.to(light, {
                            x:0
                        },{
                            duration:1000,
                            onComplete:function(){
                                loopTween();
                            }
                        });
                    }
                });
            };
            loopTween();

            Tween.to(this.topContainer, {
                y:5
            },{
                duration:1000,
                loop:true,
                reverse:true,
                delay:delay
            });

            var shadow = new Bitmap({
                x:9,
                y:52,
                image:resource.get("stick_shadow"),
                pivotX:6.5
            });
            this.bottomContainer.addChild(shadow);

            var shadow = new Bitmap({
                x:25 + width,
                y:52,
                scaleX:-1,
                pivotX:6.5,
                image:resource.get("stick_shadow")
            });
            this.bottomContainer.addChild(shadow);

            var start = new Bitmap({
                x:0,
                image:resource.get("stick_start")
            });
            this.topContainer.addChild(start);

            var start = new Bitmap({
                x:width + 34,
                scaleX:-1,
                image:resource.get("stick_start")
            });
            this.topContainer.addChild(start);
        },
        onUpdate:function(){
            this.x += this.vx;
            this.y += this.vy;

            this.lastVx = this.vx;
            this.lastVy = this.vy;
            this.vx = this.vy = 0;

            if(this.x + this.width > _game.right){
                this.x = _game.right - this.width;
            }
            else if(this.x < _game.left){
                this.x = _game.left;
            }

            if(this.y + this.height > _game.bottom){
                this.y = _game.bottom - this.height;
            }
            else if(this.y < _game.top){
                this.y = _game.top;
            }
        }
    });
    return Bang;
},{
    requires:["kill/resource"]
});