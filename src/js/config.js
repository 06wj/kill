KISSY.add("kill/config", function(S, utils){
    var keys = utils.getUrlKey();
    var config = {
        game:{
            width:1000,
            height:600
        },
        imgPath:__killPath + "img/",
        fps:60,
        showHit:false
    };

    //reset config
    S.each([
        "fps",
        "showHit"
    ], function(key){
        if(keys[key] !== undefined){
            config[key] = keys[key];
        }
    });
    return config;
},{
    requires:["kill/utils"]
});