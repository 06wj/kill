KISSY.add("kill/input", function(S){
    var KEYS = {
        87:"up0",//w
        83:"down0",//s
        65:"left0",//a
        68:"right0",//d
        70:"hold0",//f

        73:"up1",//i
        75:"down1",//k
        74:"left1",//j
        76:"right1",//l
        186:"hold1"//;
    };

    var input = window._input = {
        init:function(){
            var that = this;
            document.body.addEventListener("keydown", function(e){
                that[KEYS[e.keyCode]] = true;
            });
            document.body.addEventListener("keyup", function(e){
                that[KEYS[e.keyCode]] = false;
            });
        }
    };

    return input;
});