KISSY.add("kill/bang", function(){
    var Class = Hilo.Class;
    var Sprite = Hilo.Sprite;
    var Container = Hilo.Container;
    var View = Hilo.View;

    var Bang = Class.create({
        Extends:Container,
        constructor:function(properties){
            Bang.superclass.constructor.call(this, properties);
            this.width = 200;
            this.height = 20;
            this.vx = this.vy = 0;
            this.display = new View({
                width:this.width,
                height:this.height,
                background:"#000"
            });
            this.addChild(this.display);
        },
        onUpdate:function(){
            this.x += this.vx;
            this.y += this.vy;

            this.lastVx = this.vx;
            this.lastVy = this.vy;
            this.vx = this.vy = 0;
        }
    });
    return Bang;
},{
    requires:[]
});