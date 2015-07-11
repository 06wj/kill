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

	var MonsterState = {
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

		stickCollisionCheck: function () {
			if (this.state == MonsterState.WALKING || this.state == MonsterState.IDLE) {

				for (var i = 0, len = Manager.sticks.length; i < len; i++) {

					if (aabbContainsSegment(this.collisionArea, {
						start: Manager.sticks[i].start,
						end: Manager.sticks[i].end
					})) {

						this.state = MonsterState.WALKINGONSTICK;

						//判断人兽方向向量，确定选择棍子的哪一侧
						var MP = {
							x: Manager.pepole.x - this.x,
							y: Manager.pepole.y - this.y
						}

						var SSM = {
							x: Manager.sticks[i].start.x - this.x,
							y: Manager.sticks[i].start.y - this.y
						}


						if (MP.x * SSM.x + MP.y * SSM.y > 0) {
							this.initPoints(Manager.sticks[i].start);
						}
						else {
							this.initPoints(Manager.sticks[i].end);
						}

						return;
					}
				}
			}

		},
		initPoints: function (target) {
			var line = {};
			line.start = {
				x: this.x,
				y: this.y
			}

			line.end = {
				x: target.x,
				y: target.y
			}

			this.onGoingPoints = getLinePointsByLen(line, 5);
		},
		bloodthirsty: function (target) {
		},
		onUpdate: function () {

			if ((this.state == MonsterState.WAKE || this.state == MonsterState.WAKINGONSTICKEND) && this.onGoingPoints.length == 0) {
				this.initPoints(Manager.pepole);

				if (this.state == MonsterState.WAKE) {
					this.state = MonsterState.WALKING;
				}

				if (this.state == MonsterState.WAKINGONSTICKEND) {
					this.state = MonsterState.LEAVESTICK;
				}
			}


			if (this.state == MonsterState.IDLE) {
				this.idle();
			}
			else {
				if (this.onGoingPoints.length > 0) {
					this.x = this.onGoingPoints[0].x;
					this.y = this.onGoingPoints[0].y;

					this.onGoingPoints.shift();
				}
				else {
					//前一个状态是walking  stick.
					if (this.state == MonsterState.WALKINGONSTICK) {
						this.state = MonsterState.WAKINGONSTICKEND;
					}
					else {
//					this.state = MonsterState.IDLE;
					}

				}
			}


			this.collisionArea = {
				minX: this.x - this.r,
				maxX: this.x + this.r,
				minY: this.y - this.r,
				maxY: this.y + this.r
			}

			this.stickCollisionCheck();
		}
	});

	return Monster;

},{
	requires:["kill/resource"]
});