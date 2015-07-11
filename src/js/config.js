KISSY.add("kill/config", function(S, utils){
    var keys = utils.getUrlKey();
    var config = {
        game:{
            width:1000,
            height:600
        },
        imgPath:__killPath + "img/",
        fps:60
    };

    //reset config
    S.each([
        "fps"
    ], function(key){
        if(keys[key] !== undefined){
            config[key] = keys[key];
        }
    });
    return config;
},{
    requires:["kill/utils"]
});