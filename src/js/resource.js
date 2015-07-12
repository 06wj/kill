KISSY.add("kill/resource", function(S, mediator, config){
    var LoadQueue = Hilo.LoadQueue;
    var res = [
        {id:"player1", src:"player1.png"},
        {id:"player2", src:"player2.png"},
        {id:"playerDie1", src:"playerDie1.png"},
        {id:"playerDie2", src:"playerDie2.png"},
        {id:"road", src:"road.jpg"},
        {id:"roadTop", src:"roadTop.png"},
        {id:"slight", src:"stick/slight.png"},
        {id:"smiddle", src:"stick/smiddle.png"},
        {id:"sshadow", src:"stick/sshadow.png"},
        {id:"sstartBack", src:"stick/sstartBack.png"},
        {id:"sstartFront", src:"stick/sstartFront.png"},
        {id:"hlight", src:"stick/hlight.png"},
        {id:"hmiddle", src:"stick/hmiddle.png"},
        {id:"hshadow", src:"stick/hshadow.png"},
        {id:"hstart", src:"stick/hstart.png"},
        {id:"monster1", src:"monster1.png"},
        {id:"monsterDie", src:"monsterDie.png"},
        {id:"boss1", src:"boss1.png"},
        {id:"bosswalk", src:"bosswalk/bosswalk.png"}
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