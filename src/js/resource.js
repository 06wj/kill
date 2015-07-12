KISSY.add("kill/resource", function(S, mediator, config){
    var LoadQueue = Hilo.LoadQueue;
    var res = [
        {id:"player1", src:"player1.png"},
        {id:"player2", src:"player2.png"},
        {id:"road", src:"road.jpg"},
        {id:"roadTop", src:"roadTop.png"},
        {id:"stick_light", src:"stick_light.png"},
        {id:"stick_middle", src:"stick_middle.png"},
        {id:"stick_shadow", src:"stick_shadow.png"},
        {id:"stick_start", src:"stick_start.png"},
        {id:"monster1", src:"monster1.png"},
        {id:"monsterDie", src:"monsterDie.png"}
    ];

    S.each(res, function(r){
        r.src = config.imgPath + r.src;
    });

    var loadedRes = {};

    /**
     * 加载器
     */
    var resource = {
        res:res,
        load:function(){
            var queue = this.queue = new LoadQueue;
            queue.add(res);

            queue.on("complete", function(){
                var imgs = [];
                for(var i = 0;i < res.length;i ++){
                    var id = res[i].id;
                    loadedRes[id] = queue.getContent(id);
                }
                mediator.fire("gameLoadComplete");
            });

            queue.on("load", function(d){
                mediator.fire("gameLoaded", {
                    num:queue._loaded/(queue._source.length + 1)
                });
            });

            queue.start();
        },
        get:function(id){
            return loadedRes[id];
        }
    };
    return resource;
},{
    requires:["kill/mediator", "kill/config"]
})