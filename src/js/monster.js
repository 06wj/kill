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

			this.vx = 1;
			this.vy = 1;

			this.onGoingPoints = [];

			this.r = 10;
			this.collisionArea = {
				minX: this.x - this.r,
				maxX: this.x + this.r,
				minY: this.y - this.r,
				maxY: this.y + this.r
			}

			var textures = Hilo.TextureAtlas.createSpriteFrames([
				["run", "80-87", resource.get("player"), 22, 22, true, 100],
				["run2", "24-29", resource.get("player"), 22, 22, true, 10]
			]);
			this.display = new Hilo.Sprite({
				frames:textures,
				loop:true,
				timeBased:true,
				scaleX:2,
				scaleY:2
			});

			this.width = 44;
			this.height = 44;
			this.pivotX = 22;
			this.pivotY = 22;

			this.addChild(this.display);
			this.display.play("run");
		},
		Extends:Hilo.Container,
		idle: function () {

			if (this.idleDir == IDLEDIR.P) {
				this.x += 1;
			}

			if (this.idleDir == IDLEDIR.B) {
				this.x -= 1;
			}

			if (this.x > 700) {
				this.idleDir = IDLEDIR.B;
			}

			if (this.x < 100) {
				this.idleDir = IDLEDIR.P;
			}
		},
		onUpdate: function () {
			var that = this;

			this.x += this.vx;
			this.y += this.vy;

			var isCollision = false;
			_game.bangArr.forEach(function(bang){
				var left = that.x - 22;
				var right = that.x + 22;
				var top = that.y;
				var bottom = that.y + 44;

				var bangLeft = bang.x;
				var bangRight = bang.x + bang.width;
				var bangTop = bang.y;
				var bangBottom = bang.y + bang.height;

				if(bang.hitTestObject(that)){
					isCollision = true;
					if(top != bangBottom && bottom != bangTop){
						if(right > bangLeft && left < bangLeft){

							if(that.vx > 0 || bang.lastVx < 0){
								that.vx = -that.vx;

								that.x = bangLeft - 22;
							}
						}
						else if(left < bangRight && right > bangRight){
							if(that.vx < 0  || bang.lastVx > 0){
								that.x = bangRight + 22;
							}
						}
					}

					if(left != bangRight && right != bangLeft){
						if(bottom > bangTop && top < bangTop){

							if(that.vy > 0 || bang.lastVy < 0){
								that.y = bangTop - 22;
							}
						}
						else if(top < bangBottom && bottom > bangBottom){
							if(that.vy < 0  || bang.lastVy > 0){
								that.y = bangBottom;
							}
						}
					}
				}
			});

			if(that.x < _game.left - that.width){
				that.vx = - that.vx;
			}

			if(that.y > _game.bottom - that.height){
				that.vy = - that.vy;
			}

//			if(!isCollision){
//				that.idle();
//			}

		}
	});

	return Monster;

},{
	requires:["kill/resource"]
});