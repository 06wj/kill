KISSY.add("kill/background", function(S, resource){
    var Background = Hilo.Class.create({
        Extends:Hilo.Container,
        constructor:function(props){
            Hilo.Container.call(this, props);

            this.display = new Hilo.Bitmap({
                image:resource.get("road")
            });
            this.addChild(this.display);
        }
    });
    return Background;
},{
    requires:["kill/resource"]
});