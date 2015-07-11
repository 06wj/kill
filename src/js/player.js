KISSY.add("kill/player", function(S, resource, input){
    var Class = Hilo.Class;
    var Container = Hilo.Container;
    var Sprite = Hilo.Sprite;
    var Bitmap = Hilo.Bitmap;


    var Player = window._Player = Class.create({
        Extends:Container,
        constructor:function(properties){
            Player.superclass.constructor.call(this, properties);
            var textures = Hilo.TextureAtlas.createSpriteFrames([
                ["run", "24-29", resource.get("player"), 22, 22, true, 100],
                ["run2", "24-29", resource.get("player"), 22, 22, true, 10]
            ]);
            this.display = new Sprite({
                frames:textures,
                loop:true,
                timeBased:true,
                pivotX:11,
                scaleX:2,
                scaleY:2
            });
            this.addChild(this.display);
            this.display.play("run");
        },
        onUpdate:function(){
            var v = 3;
            if(input.up0){
                this.y -= v;
            }
            else if(input.down0){
                this.y += v;
            }

            if(input.left0){
                this.x -= v;
                this.scaleX = -1;
            }
            else if(input.right0){
                this.x += v;
                this.scaleX = 1;
            }
        }
    })
    return Player;
},{
    requires:["kill/resource", "kill/input"]
});