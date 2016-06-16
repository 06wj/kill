
var config = {
    game:{
        width:1000,
        height:600
    },
    imgPath:__killPath + 'img/',
    fps:60,
    showHit:false,
    god:false,
    state:0,
    noStart:false,
    reset:function(){
        var keys = this.getUrlKey();
        var props = [
            'fps',
            'showHit',
            'god',
            'state',
            'noStart'
        ];
        props.forEach(function(key){
             if(keys[key] !== undefined){
                config[key] = keys[key];
            }
        });
    },
    getUrlKey:function(key){
        var keys = this.keys;
        if(!keys){
            keys = this.keys = {};
            var search = location.search.substring(1);
            if(search){
                var arr = search.split('&');
                if(arr && arr.length){
                    arr.forEach(function(objStr){
                        var objArr = objStr.split('=');
                        if(objArr && objArr.length > 1){
                            keys[objArr[0]] = objArr[1];
                        }
                    });
                }
            }
        }
        return key?keys[key]:keys;
    },
    window:function(name, module){
        window['_' + name] = module;
    }
};

config.reset();

config.window('config', config);
module.exports = config;