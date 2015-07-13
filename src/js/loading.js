KISSY.add("kill/loading", function(S, mediator){
    var loading = {
        init:function(){
            var that = this;
            this.elem = document.getElementById("loading");
            mediator.on("gameLoadComplete", function(e){
                that.hide();
            });

            mediator.on("gameLoadStart", function(e){
                that.show(0);
            });

            mediator.on("gameLoaded", function(e){
                that.show(e.num);
            });
        },
        show:function(num){
            this.elem.style.display = "block";
            this.elem.innerHTML = "loading... " + (num * 100).toFixed(2) + "%";
        },
        hide:function(){
            this.elem.style.display = "none";
        }
    };
    return loading;
},{
    requires:["kill/mediator"]
});