KISSY.add("kill/resource", function(S, mediator, config){
    var LoadQueue = Hilo.LoadQueue;
    var res = [
        {id:"player", src:"mario.png"},
        {id:"road0", src:"road0.png"},
        {id:"road1", src:"road1.png"},
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