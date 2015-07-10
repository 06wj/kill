KISSY.add("kill/utils", function(S){
    var utils = {
        /**
         * 获取网址参数
         * @param  {String} key
         */
        getUrlKey:function(key){
            if(!key){
                return S.unparam(location.search.substring(1));
            }
            return S.unparam(location.search.substring(1))[key];
        }
    };
    return utils;
},{
    requires:[]
});