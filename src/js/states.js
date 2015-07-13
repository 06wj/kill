KISSY.add("kill/states", function(){
    var arr = [
        //----------------------- stage 1 ----------------------------
        {
            bangs:[{
                   x:300,
                    y:200,
                    length:200,
                    rotation:0,
                },{
                    x:900,
                    y:100,
                    rotation:90,
                    length:300
                },{
                    x:300,
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
                    x: 450,
                    y: 250,
                    type:"normal",
                    isMove:false
                },
                {
                    x: 100,
                    y: 500,
                    type:"normal",
                    isMove:false
                }
            ],
            players:[{
                    x:450,
                    y:0,
                    playerNum:0
                },{
                    x:950,
                    y:300,
                    playerNum:1
                }
            ]
        },
        //----------------------- stage 2 ----------------------------
        {
            bangs:[{
                   x:400,
                    y:350,
                    length:200,
                    rotation:0
                },{
                    x:500,
                    y:150,
                    rotation:90,
                    length:300
                },{
                    x:500,
                    y:500,
                    length:200,
                    rotation:0
                },{
                    x:80,
                    y:100,
                    rotation:90,
                    length:300
                }
            ],
            monsters:[{
                    x: 550,
                    y: 300,
                    type:"normal"
                },{
                    x: 550,
                    y: 400,
                    type:"trap"
                },{
                    x: 400,
                    y: 300,
                    type:"normal"
                },{
                    x: 400,
                    y: 400,
                    type:"trap"
                }
            ],
            players:[{
                    x:50,
                    y:300,
                    playerNum:0
                },{
                    x:600,
                    y:550,
                    playerNum:1
                }
            ]
        },
        //----------------------- stage 3 ----------------------------
        {
            bangs:[{
                    x:400,
                    y:350,
                    length:200,
                    rotation:0
                },{
                    x:500,
                    y:400,
                    rotation:90,
                    length:300
                },{
                    x:500,
                    y:100,
                    length:200,
                    rotation:0
                },{
                    x:900,
                    y:300,
                    rotation:90,
                    length:300
                }
            ],
            monsters:[{
                    x: 550,
                    y: 300,
                    type:"normal"
                },{
                    x: 550,
                    y: 400,
                    type:"normal"
                },{
                    x: 400,
                    y: 300,
                    type:"normal"
                },{
                    x: 400,
                    y: 400,
                    type:"normal"
                }
            ],
            players:[{
                    x:600,
                    y:50,
                    playerNum:0
                },{
                    x:1000,
                    y:300,
                    playerNum:1
                }
            ]
        },
        //----------------------- stage 4 ----------------------------
        {
            bangs:[{
                    x:400,
                    y:300,
                    length:200,
                    rotation:0
                },{
                    x:350,
                    y:200,
                    rotation:90,
                    length:300
                },{
                    x:400,
                    y:500,
                    length:200,
                    rotation:0
                },{
                    x:650,
                    y:200,
                    rotation:90,
                    length:300
                }
            ],
            monsters:[{
                    x: 50,
                    y: 100,
                    type:"normal"
                },{
                    x: 900,
                    y: 500,
                    type:"normal"
                },{
                    x: 500,
                    y: 50,
                    type:"boss"
                }
            ],
            players:[{
                    x:400,
                    y:400,
                    playerNum:0
                },{
                    x:500,
                    y:400,
                    playerNum:1
                }
            ]
        },
        // ----------------------- stage 5 ----------------------------
       {
            bangs:[{
                    x:400,
                    y:300,
                    length:200,
                    rotation:0
                },{
                    x:350,
                    y:200,
                    rotation:90,
                    length:300
                },{
                    x:400,
                    y:500,
                    length:200,
                    rotation:0
                },{
                    x:650,
                    y:200,
                    rotation:90,
                    length:300
                }
            ],
            monsters:[{
                    x: 50,
                    y: 100,
                    type:"trap"
                },{
                    x: 150,
                    y: 100,
                    type:"trap"
                },{
                    x: 250,
                    y: 100,
                    type:"trap"
                },{
                    x: 350,
                    y: 100,
                    type:"trap"
                },{
                    x: 500,
                    y: 100,
                    type:"trap"
                },{
                    x: 800,
                    y: 50,
                    type:"boss"
                }
            ],
            players:[{
                    x:400,
                    y:400,
                    playerNum:0
                },{
                    x:500,
                    y:400,
                    playerNum:1
                }
            ]
        },
        //----------------------- stage 6 ----------------------------
        {
            bangs:[{
                    x:400,
                    y:300,
                    length:200,
                    rotation:0
                },{
                    x:350,
                    y:200,
                    rotation:90,
                    length:300
                },{
                    x:400,
                    y:500,
                    length:200,
                    rotation:0
                },{
                    x:650,
                    y:200,
                    rotation:90,
                    length:300
                }
            ],
            monsters:[{
                    x: 150,
                    y: 100,
                    type:"normal"
                },{
                    x: 350,
                    y: 100,
                    type:"normal"
                },{
                    x: 450,
                    y: 100,
                    type:"normal"
                },{
                    x: 650,
                    y: 100,
                    type:"normal"
                },{
                    x: 900,
                    y: 500,
                    type:"normal"
                },{
                    x: 900,
                    y: 500,
                    type:"trap"
                },{
                    x: 500,
                    y: 50,
                    type:"boss"
                }
            ],
            players:[{
                    x:400,
                    y:400,
                    playerNum:0
                },{
                    x:500,
                    y:400,
                    playerNum:1
                }
            ]
        }
    ];

    var states = {
        index:0,
        getState:function(index){
            this.index = parseInt(index);
            return arr[index];
        }
    };

 return states;
});