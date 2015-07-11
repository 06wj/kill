/**
 * Created by admin on 15/7/10.
 */


var MonsterState = {
	IDLE: "IDLE",
	BLOODTHIRSTY: "BLOODTHIRSTY",
	ONGOING: "ONGOING",
	NIL: "NIL"
}

var IDLEDIR = {
	P:"P",
	B:"B"
}

var Monster = function(x,y){
	this.x = x;
	this.y = y;

	this.state = MonsterState.IDLE;

	this.idleDir = IDLEDIR.P;
}

var MAX_X = 1000;
var MIN_X = 0;

var MAX_Y = 600;
var MIN_Y = 0;

var getLinePointsByLen = function (line, step) {
	var start = line.start;
	var end = line.end;
	var points = [];

	var dis = Math.sqrt(Math.pow((end.x - start.x), 2) + Math.pow((end.y - start.y), 2));

	var dVec = {x: end.x - start.x, y: end.y - start.y};

	function pointDisVecThenPoint(tX, tY) {
		var fi = Math.atan2(dVec.y, dVec.x);

		var final_x = tX + step * Math.cos(fi);
		var final_y = tY + step * Math.sin(fi);

		return {
			x: final_x,
			y: final_y
		}
	}

	var p = start;
	points.push(p);
	for (var i = 0, len = Math.floor(dis / step); i < len; i++) {
		p = pointDisVecThenPoint(p.x, p.y);

		if (!isNaN(p.x)) {

			if(i == len - 1) p.e = true;
			else p.e = false;

			points.push(p);
		}
	}

	return points;
};

Monster.prototype = {
	constructor: Monster,
	idle: function(){

		if(this.idleDir == IDLEDIR.P) {
			this.x += 1;
		}

		if(this.idleDir == IDLEDIR.B){
			this.x -= 1;
		}

		if(this.x > MAX_X){
			this.idleDir = IDLEDIR.B;
		}

		if(this.x < MIN_X){
			this.idleDir = IDLEDIR.P;
		}
	},

	bloodthirsty: function(){

		if(MonsterState.BLOODTHIRSTY == this.state){
			var line = {};
			line.start = {
				x: this.x,
				y: this.y
			}

			line.end = {
				x: Manager.pepole.x,
				y: Manager.pepole.y
			}

			this.onGoingPoints = getLinePointsByLen(line,1);

			this.state = MonsterState.ONGOING;
		}

		if(MonsterState.ONGOING == this.state){

			if(this.onGoingPoints.length > 0){
				this.x = this.onGoingPoints[0].x;
				this.y = this.onGoingPoints[0].y;

				this.onGoingPoints.shift();
			}
			else{
				this.state = MonsterState.IDLE;
			}

		}

	},
	update: function(){
		if(MonsterState.BLOODTHIRSTY == this.state || MonsterState.ONGOING == this.state){
			this.bloodthirsty();
		}

		if(MonsterState.IDLE == this.state){
			this.idle();
		}
	},
	draw: function(){

		ctx.strokeStyle = "red";

		ctx.beginPath();
		ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	}
}