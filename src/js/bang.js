KISSY.add("kill/bang", function(S, resource, config){
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

            var len = properties.length;
            this.rotation = 0;
            var rotation = properties.rotation;
            if(rotation === 90){
                this._initShu(len)
            }
            else{
                this._initHeng(len);
            }
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
        },
        _initHeng:function(len){
            this.width = len + 40;
            this.height = 30;
            if(config.showHit){
                this.background = "rgba(255,0,0,.3)";
            }
            this.vx = this.vy = 0;
            this.display = new Container({
                x:4,
                y:-20
            });
            this.topContainer = new Container();
            this.bottomContainer = new Container();

            this.addChild(this.display);
            this.display.addChild(this.bottomContainer);
            this.display.addChild(this.topContainer);

            var middle = new Bitmap({
                x:17,
                y:20,
                scaleX:len*.1,
                image:resource.get("hmiddle")
            });
            this.topContainer.addChild(middle);

            var light = new Bitmap({
                x:20,
                y:18,
                image:resource.get("hlight")
            });
            this.topContainer.addChild(light);

            var delay = Math.random() * 1000;
            var loopTween = function(){
                light.y = 18;
                Tween.to(light, {
                    x:len
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
                image:resource.get("hshadow"),
                pivotX:6.5
            });
            this.bottomContainer.addChild(shadow);

            var shadow = new Bitmap({
                x:25 + len,
                y:52,
                scaleX:-1,
                pivotX:6.5,
                image:resource.get("hshadow")
            });
            this.bottomContainer.addChild(shadow);

            var start = new Bitmap({
                x:0,
                image:resource.get("hstart")
            });
            this.topContainer.addChild(start);

            var start = new Bitmap({
                x:len + 34,
                scaleX:-1,
                image:resource.get("hstart")
            });
            this.topContainer.addChild(start);
        },
        _initShu:function(len){
            this.width = 20;
            this.height = len + 40;
            if(config.showHit){
                this.background = "rgba(255,0,0,.3)";
            }
            this.vx = this.vy = 0;
            this.display = new Container({
                x:3,
                y:3
            });
            this.topContainer = new Container();
            this.bottomContainer = new Container();

            this.addChild(this.display);
            this.display.addChild(this.bottomContainer);
            this.display.addChild(this.topContainer);

            var middle = new Bitmap({
                x:5,
                y:20,
                scaleY:len*.1,
                image:resource.get("smiddle")
            });
            this.topContainer.addChild(middle);

            var light = new Bitmap({
                x:3,
                y:33,
                image:resource.get("slight")
            });
            this.topContainer.addChild(light);

            var delay = Math.random() * 1000;
            var loopTween = function(){
                light.y = 18;
                Tween.to(light, {
                    y:len
                },{
                    duration:1000,
                    delay:delay,
                    loop:true,
                    reverse:true
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
                image:resource.get("sshadow"),
                pivotX:6.5
            });
            this.bottomContainer.addChild(shadow);

            var shadow = new Bitmap({
                x:9,
                y:38 + len,
                scaleX:-1,
                pivotX:6.5,
                image:resource.get("sshadow")
            });
            this.bottomContainer.addChild(shadow);

            var start = new Bitmap({
                x:0,
                image:resource.get("sstartFront")
            });
            this.topContainer.addChild(start);

            var start = new Bitmap({
                x:0,
                y:len - 15,
                image:resource.get("sstartBack")
            });
            this.topContainer.addChild(start);
        }
    });
    return Bang;
},{
    requires:["kill/resource", "kill/config"]
});