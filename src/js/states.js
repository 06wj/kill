KISSY.add("kill/states", function(){
    var arr = [
        //----------------------- stage 1 ----------------------------
        {
            bangs:[{
                    x:200,
                    y:300,
                    length:200,
                    rotation:0
                },{
                    x:400,
                    y:0,
                    rotation:90,
                    length:300
                },{
                    x:300,
                    y:400,
                    length:200,
                    rotation:0
                },{
                    x:600,
                    y:70,
                    rotation:90,
                    length:300
                }
            ],
            monsters:[{
                    x: 250,
                    y: 100,
                    type:"boss"
                }
            ],
            players:[{
                    x:50,
                    y:300,
                    playerNum:0
                },{
                    x:750,
                    y:300,
                    playerNum:1
                }
            ]
        },
        //----------------------- stage 2 ----------------------------
        {
            bangs:[{
                    x:400,
                    y:300,
                    length:300,
                    rotation:0
                },{
                    x:700,
                    y:100,
                    rotation:90,
                    length:300
                },{
                    x:200,
                    y:400,
                    length:200,
                    rotation:0
                },{
                    x:100,
                    y:100,
                    rotation:90,
                    length:300
                }
            ],
            monsters:[{
                    x: 500,
                    y: 100,
                    type:"boss"
                },{
                    x: 500,
                    y: 300,
                    type:"boss"
                }
            ],
            players:[{
                    x:50,
                    y:300,
                    playerNum:0
                },{
                    x:750,
                    y:300,
                    playerNum:1
                }
            ]
        },

    ];

    var states = {
        index:0,
        getState:function(index){
            this.index = index;
            return arr[index];
        }
    };

 return states;
});