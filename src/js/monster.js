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

//			this.vx = 0;
//			this.vy = 0;

			this.onGoingPoints = [];

			this.r = 10;
			this.collisionArea = {
				minX: this.x - this.r,
				maxX: this.x + this.r,
				minY: this.y - this.r,
				maxY: this.y + this.r
			}

			this.background = "rgba(0,255,0,.4)"

			var textures = Hilo.TextureAtlas.createSpriteFrames([
//				["run", "80-87", resource.get("player"), 22, 22, true, 100],
				["monster1", "0-1", resource.get("monster1"), 36, 40, true, 300]
			]);
			this.display = new Hilo.Sprite({
				frames:textures,
				loop:true,
				timeBased:true
			});

			this.width = 36;
			this.height = 40;
			this.pivotX = 18;
			this.pivotY = 20;
			this.scaleX =  1;
			this.scaleY = 1;

			this.addChild(this.display);
			this.display.play("monster1");
		},
		Extends:Hilo.Container,
		onUpdate: function () {
			var that = this;

			var left = that.x - that.width/2;
			var top = that.y - that.height/2;
			var right = that.x + that.width/2;
			var bottom = that.y + that.height/2;

			var b = null;
			_game.bangArr.forEach(function(bang){

				if(bang.hitTestObject(that)){
					b = bang;

					var bangLeft = bang.x;
					var bangRight = bang.x + bang.width;
					var bangTop = bang.y;
					var bangBottom = bang.y + bang.height;

					var A = (right < bangLeft && bottom < bangTop);
					var B = ( left > bangRight && bottom < bangTop);
					var C = (left > bangRight && top > bangBottom);
					var D = (right < bangLeft && top > bangBottom);

					if(!A && !B && !C && !D){
						if(left < bangLeft){
							that.x = bangLeft - that.width/2;
							that.vx = -that.vx;
							that.scaleX = -that.scaleX;
						}

						if(top < bangTop){
							that.y = bangTop - that.height/2;
							that.vy = -that.vy;
						}

						if(right > bangRight){
							that.y = bangRight + that.width/2;
							that.vx = -that.vx;
							that.scaleX = -that.scaleX;
						}

						if(bottom > bangBottom){
							that.y = bangBottom + that.height/2;
							that.vy = -that.vy;
						}
					}
					else{

						if(A){
							that.x = bangLeft - that.width/2;
							that.y = bangTop - that.height/2;
						}

						if(B){
							that.x = bangRight + that.width/2;
							that.y = bangTop - that.height/2;
						}

						if(C){
							that.y = bangBottom + that.height/2;
							that.x = bangRight + that.width/2;
						}

						if(D){
							that.x = bangLeft - that.width/2;
							that.y = bangBottom + that.height/2;
						}

						that.vx = -that.vx;
						that.vy = -that.vy;

						that.scaleX = -that.scaleX;
					}

					if(left < _game.left){
						this.x = _game.left + this.width/2;
						that.vx = - that.vx;

						if(b != null){
							b.x = _game.left + this.width + b.width/2;
						}
					}

					if(top < _game.top){
						this.y = _game.top + this.height/2;
						that.vy = - that.vy;

						if(b != null){
							b.y = _game.top + this.height + b.height/2;
						}
					}

					if(right > _game.right){
						this.x = _game.right - this.width/2;
						that.vx = - that.vx;

						if(b != null){
							b.x = _game.right - this.width - b.width/2;
						}
					}

					if(bottom > _game.bottom){
						this.y = _game.bottom - this.height/2;
						that.vy = - that.vy;

						if(b != null){
							b.y = _game.bottom - this.height - b.height/2;
						}
					}
				}


			});


			if(left < _game.left){
				this.x = _game.left + this.width/2;
				that.vx = - that.vx;

				if(b != null){
					b.x = _game.left + this.width + b.width/2;
				}
			}

			if(top < _game.top){
				this.y = _game.top + this.height/2;
				that.vy = - that.vy;

				if(b != null){
					b.y = _game.top + this.height + b.height/2;
				}
			}

			if(right > _game.right){
				this.x = _game.right - this.width/2;
				that.vx = - that.vx;

				if(b != null){
					b.x = _game.right - this.width - b.width/2;
				}
			}

			if(bottom > _game.bottom){
				this.y = _game.bottom - this.height/2;
				that.vy = - that.vy;

				if(b != null){
					b.y = _game.bottom - this.height - b.height/2;
				}
			}



			this.x += this.vx;
			this.y += this.vy;
		}
	});

	return Monster;

},{
	requires:["kill/resource"]
});