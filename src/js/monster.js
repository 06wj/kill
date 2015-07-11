/**
 * Created by admin on 15/7/10.
 */

KISSY.add("kill/monster", function (S,resource) {

	var Manager = {
		pepole: {
			x: 500,
			y: 500
		},
		sticks: []
	}

	window.MonsterState = {
		IDLE: "IDLE",
		WAKE: "WAKE",
		COLLIDEWITHSTICK: "COLLIDEWITHSTICK",
		WALKINGONSTICK: "WALKINGONSTICK",
		WAKINGONSTICKEND: "WAKINGONSTICKEND",
		LEAVESTICK: "LEAVESTICK",
		WALKING: "WALKING",
		NIL: "NIL"
	}

	var IDLEDIR = {
		P: "P",
		B: "B"
	}

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

				points.push(p);
			}
		}

		return points;
	};

	var aabbContainsSegment = function (rect, line) {
		var x1 = line.start.x;
		var y1 = line.start.y;

		var x2 = line.end.x;
		var y2 = line.end.y;

		var minX = rect.minX;
		var maxX = rect.maxX;

		var minY = rect.minY;
		var maxY = rect.maxY;

		if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
			return false;

		var m = (y2 - y1) / (x2 - x1);

		var y = m * (minX - x1) + y1;
		if (y > minY && y < maxY) return true;

		y = m * (maxX - x1) + y1;
		if (y > minY && y < maxY) return true;

		var x = (minY - y1) / m + x1;
		if (x > minX && x < maxX) return true;

		x = (maxY - y1) / m + x1;
		if (x > minX && x < maxX) return true;

		return false;
	}

	var Monster = Hilo.Class.create({
		constructor: function(properties){
			Hilo.Container.call(this, properties);

			this.state = MonsterState.IDLE;

			this.idleDir = IDLEDIR.P;

			this.vx = 2 + Math.random();
			this.vy = 2 + Math.random();

			this.onGoingPoints = [];

			this.r = 10;
			this.collisionArea = {
				minX: this.x - this.r,
				maxX: this.x + this.r,
				minY: this.y - this.r,
				maxY: this.y + this.r
			}

			var textures = Hilo.TextureAtlas.createSpriteFrames([
//				["run", "80-87", resource.get("player"), 22, 22, true, 100],
				["monster1", "0-1", resource.get("monster1"), 36, 40, true, 300]
			]);
			this.display = new Hilo.Sprite({
				frames:textures,
				loop:true,
				timeBased:true,
				scaleX: -1,
				scaleY:1
			});

			this.width = 36;
			this.height = 40;
			this.pivotX = 18;
			this.pivotY = 20;

			this.addChild(this.display);
			this.display.play("monster1");
		},
		Extends:Hilo.Container,
		onUpdate: function () {
			var that = this;

			_game.bangArr.forEach(function(bang){
				var left = that.x - that.width/2;
				var right = that.x + that.width/2;
				var top = that.y;
				var bottom = that.y + that.height;

				var bangLeft = bang.x;
				var bangRight = bang.x + bang.width;
				var bangTop = bang.y;
				var bangBottom = bang.y + bang.height;

				if(bang.hitTestObject(that)){

					if((that.x < bangLeft && that.y < bangTop) || (that.x > bangRight && that.y < bangTop) || (that.x > bangRight && that.y > bangBottom) || (that.x > bangRight && that.y < bangTop)){
						that.vx = -that.vx;
						that.vy = -that.vy;

						that.display.scaleX = -that.display.scaleX;
					}
					else{
						if(that.x < bangLeft){
							that.vx = -that.vx;
							that.display.scaleX = -that.display.scaleX;
						}

						if(that.y < bangTop){
							that.vy = -that.vy;
						}

						if(that.x > bangRight){
							that.vx = -that.vx;
							that.display.scaleX = -that.display.scaleX;
						}

						if(that.y > bangBottom){
							that.vy = -that.vy;
						}
					}
				}
			});


			if(that.x < _game.left + that.width || that.x > _game.right - that.width){
				that.vx = - that.vx;
			}

			if(that.y > _game.bottom - that.height || that.y < _game.top + that.height){
				that.vy = - that.vy;
			}


			this.x += this.vx;
			this.y += this.vy;
		}
	});

	return Monster;

},{
	requires:["kill/resource"]
});