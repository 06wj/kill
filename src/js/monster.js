/**
 * Created by admin on 15/7/10.
 */

KISSY.add("kill/monster", function (S, resource, Event, config) {


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
		constructor: function (properties) {
			Hilo.Container.call(this, properties);


			this.idleDir = IDLEDIR.P;


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

			if (config.showHit) {
				this.background = "rgba(0,255,0,.4)";
			}

			var textures = Hilo.TextureAtlas.createSpriteFrames([
				["state", "0-1", resource.get("monster1"), 54, 64, true, 300],
				["boss1", "0", resource.get("boss1"), 74, 72, true, 300],
				["walk", "2-5", resource.get("monster1"), 54, 64, true, 300],
				["die", "6,1,6,1", resource.get("monster1"), 54, 64, true, 100],
				["bosswalk", "0-3", resource.get("bosswalk"), 85, 85, true, 100]
			]);

			var dims = {
				x: -22,
				y: -10,
				w: 35,
				h: 40
			}

			if (properties.type && properties.type == "boss") {
				this.isboss = true;
				dims.x = 0;
				dims.y = 0;
				dims.w = 60;
				dims.h = 72;
			}

			this.display = new Hilo.Sprite({
				y: dims.x,
				x: dims.y,
				frames: textures,
				loop: true,
				timeBased: true
			});

			this.width = dims.w;
			this.height = dims.h;
			this.pivotX = this.width * .5;
			this.pivotY = this.height * .5;
			this.scaleX = 1;
			this.scaleY = 1;
			this.frame = 0;

			this.addChild(this.display);

			if (this.isboss) {
				this.lastVx = this.vx = 0;
				this.lastVy = this.vy = 0;

				this.display.goto("bosswalk");
			}
			else {

				if(properties.isMove !== undefined && !properties.isMove){
					this.lastVx = this.vx = 0;
					this.lastVy = this.vy = 0;
				}
				else{
					this.lastVx = this.vx = 2 + Math.random();
					this.lastVy = this.vy = 2 + Math.random();
				}

				this.display.goto("walk");
			}

		},
		Extends: Hilo.Container,
		die: function () {
			var that = this;
			if (!this.isDie) {
				this.isDie = true;
				this.display.goto("die");
				this.display.interval = 10;
				this.onUpdate = null;
				setTimeout(function () {
					var textures = Hilo.TextureAtlas.createSpriteFrames([
						["state", "0-5", resource.get("monsterDie"), 38, 40, false, 100]
					]);
					that.display.removeFromParent();
					that.display = new Hilo.Sprite({
						y: 0,
						x: that.width * .5,
						pivotX: 19,
						frames: textures,
						loop: true,
						timeBased: true
					});
					that.addChild(that.display);
					that.display.play();
					setTimeout(function () {
						that.removeFromParent();
					}, 1000);
				}, 300);
			}
		},
		onUpdate: function () {
			var that = this;
			that.frame++;

			if (that.isboss) {
				if (that.vx == 0 && that.vy == 0) {

					for (var i = 0, len = _game.playerArr.length; i < len; i++) {
						if (!_game.playerArr[i].isDie) {
							that.bossPig = _game.playerArr[i];

							that.bossDis = 0;
							break;
						}
					}

					if (len == i) {
						Event.fire("gameover", {});
						return;
					}
				}


				if (that.bossPig && that.bossPig.hitTestObject(that)) {

					that.vx = 0;
					that.vy = 0;

					Event.fire("playerDied", {
						player: that.bossPig
					});
				}
				else {

					var deltaX = that.bossPig.x - that.x;
					var deltaY = that.bossPig.y - that.y;

					var val = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

					var vx = deltaX / val * 1;
					var vy = deltaY / val * 1;

					that.vx = vx;
					that.vy = vy;

					that.x += that.vx;
					that.y += that.vy;

					that.bossDis += Math.sqrt(that.vx * that.vx + that.vy * that.vy);
				}

			}
			else {
				var left = that.x - that.width / 2;
				var top = that.y - that.height / 2;
				var right = that.x + that.width / 2;
				var bottom = that.y + that.height / 2;

				var qiang, sniffer = 20;
				for (var i = 0, len = _game.qiangs.length; i < len; i++) {
					qiang = _game.qiangs[i];
					if (qiang.hitTestObject(that)) {

						that.x += sniffer;

						if (!qiang.hitTestObject(that)) {
							that.vx = Math.abs(that.vx);
							that.scaleX = -that.scaleX

							break;
						}
						else {
							that.x -= sniffer;
						}


						that.x -= sniffer;

						if (!qiang.hitTestObject(that)) {
							that.vx = -Math.abs(that.vx);
							that.scaleX = -that.scaleX

							break;
						}
						else {
							that.x += sniffer;
						}

						that.y += sniffer;

						if (!qiang.hitTestObject(that)) {
							that.vy = Math.abs(that.vy);
							break;
						}
						else {
							that.y -= sniffer;
						}

						that.y -= sniffer;

						if (!qiang.hitTestObject(that)) {
							that.vy = -Math.abs(that.vy);
							break;
						}
						else {
							that.y += sniffer;
						}

						that.vx = 0;
						that.vy = 0;
					}
				}


				left = that.x - that.width / 2;
				top = that.y - that.height / 2;
				right = that.x + that.width / 2;
				bottom = that.y + that.height / 2;

				var bang;
				for (var i = 0, len = _game.bangArr.length; i < len; i++) {

					bang = _game.bangArr[i];

					if (left < _game.left) {
						bang.vx = -bang.lastVx;
					}

					if (top < _game.top) {
						that.y = _game.top + that.height / 2;

						bang.vy = -bang.lastVy;
					}

					if (right > _game.right) {
						that.x = _game.right - that.width / 2;

						bang.vx = -bang.lastVx;
					}

					if (bottom > _game.bottom) {
						that.y = _game.bottom - that.height / 2;

						bang.vy = -bang.lastVy;
					}


					if (bang.hitTestObject(that)) {

						that.x += sniffer;

						if (!bang.hitTestObject(that)) {
							that.vx = Math.abs(that.vx);
							that.scaleX = -that.scaleX
							break;
						}
						else {
							that.x -= sniffer;
						}


						that.x -= sniffer;

						if (!bang.hitTestObject(that)) {
							that.vx = -Math.abs(that.vx);
							that.scaleX = -that.scaleX
							break;
						}
						else {
							that.x += sniffer;
						}

						that.y += sniffer;

						if (!bang.hitTestObject(that)) {
							that.vy = Math.abs(that.vy);
							break;
						}
						else {
							that.y -= sniffer;
						}

						that.y -= sniffer;

						if (!bang.hitTestObject(that)) {
							that.vy = -Math.abs(that.vy);
							break;
						}
						else {
							that.y += sniffer;
						}

						that.vx = 0;
						that.vy = 0;
					}
				}


				for (var i = 0, len = _game.bangArr.length; i < len; i++) {
					bang = _game.bangArr[i];

					if (!bang.hitTestObject(that)) {
						continue;
					}
				}
				for (var j = 0, len = _game.qiangs.length; j < len; j++) {
					qiang = _game.qiangs[j];

					if (!qiang.hitTestObject(that)) {
						continue;
					}
				}

				if (i == len && j == len && that.vx == 0 && that.vy == 0) {
					that.vx = 2 + Math.random();
					that.vy = 2 + Math.random();
				}

				_game.playerArr.forEach(function (player) {
					if (player.hitTestObject(that)) {
						Event.fire("playerDied", {
							player: player
						});
					}
				});


				this.x += this.vx;
				this.y += this.vy;

				that.lastVx = that.vx;
				that.lastVy = that.vy;
			}
		}
	});

	return Monster;

}, {
	requires: ["kill/resource", "kill/mediator", "kill/config"]
});