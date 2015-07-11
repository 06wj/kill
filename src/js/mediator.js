KISSY.add("kill/mediator", function(S, event){
    var mediator = S.merge({}, event.Target);
    return mediator;
},{
    requires:["event"]
});