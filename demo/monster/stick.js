/**
 * Created by admin on 15/7/11.
 */


var Stick = function(start,end){
	this.start = start || {
		x: 400, y : 400
	}

	this.end = end || {
		x: 300, y: 200
	}

	this.w = 10;
}

Stick.prototype = {
	constructor: Stick,
	update: function(){},
	draw: function(){
		ctx.strokeStyle = "red";
		ctx.lineWidth = this.w;

		ctx.beginPath();
		ctx.moveTo(this.start.x , this.start.y);
		ctx.lineTo(this.end.x , this.end.y);
		ctx.stroke();
		ctx.fill();
	}
}