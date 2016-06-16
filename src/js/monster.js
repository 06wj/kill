var resource = require('./resource');
var mediator = require('./mediator');
var config = require('./config');

var game;
var Monster = Hilo.Class.create({
	Extends: Hilo.Container,
	Statics:{
		init:function(_game){
			game = _game;
		}
	},
	constructor: function (properties) {
		Hilo.Container.call(this, properties);
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

				this.isMove = false;
			}
			else{
				this.lastVx = this.vx = 2 + Math.random();
				this.lastVy = this.vy = 2 + Math.random();

				this.isMove = true;
			}

			this.display.goto("walk");
		}

	},
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

				for (var i = 0, len = game.playerArr.length; i < len; i++) {
					if (!game.playerArr[i].isDie) {
						that.bossPig = game.playerArr[i];

						that.bossDis = 0;
						break;
					}
				}

				if (len == i) {
					mediator.fire("gameover", {});
					return;
				}
			}


			if (that.bossPig && that.bossPig.hitTestObject(that)) {

				that.vx = 0;
				that.vy = 0;

				mediator.fire("playerDied", {
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

			if(!that.isMove) {
				var bang,sniffer = 20;
				var left = that.x - that.width / 2;
				var top = that.y - that.height / 2;
				var right = that.x + that.width / 2;
				var bottom = that.y + that.height / 2;


				for (var i = 0, len = game.bangArr.length; i < len; i++) {

					bang = game.bangArr[i];

					if (left < game.left) {
						bang.vx = -bang.lastVx;
					}

					if (top < game.top) {
						that.y = game.top + that.height / 2;

						bang.vy = -bang.lastVy;
					}

					if (right > game.right) {
						that.x = game.right - that.width / 2;

						bang.vx = -bang.lastVx;
					}

					if (bottom > game.bottom) {
						that.y = game.bottom - that.height / 2;

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

				game.playerArr.forEach(function (player) {
					if (player.hitTestObject(that)) {
						mediator.fire("playerDied", {
							player: player
						});
					}
				});

			}
			else{
				var left = that.x - that.width / 2;
				var top = that.y - that.height / 2;
				var right = that.x + that.width / 2;
				var bottom = that.y + that.height / 2;

				var qiang, sniffer = 20;
				for (var i = 0, len = game.qiangs.length; i < len; i++) {
					qiang = game.qiangs[i];
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
				for (var i = 0, len = game.bangArr.length; i < len; i++) {

					bang = game.bangArr[i];

					if (left < game.left) {
						bang.vx = -bang.lastVx;
					}

					if (top < game.top) {
						that.y = game.top + that.height / 2;

						bang.vy = -bang.lastVy;
					}

					if (right > game.right) {
						that.x = game.right - that.width / 2;

						bang.vx = -bang.lastVx;
					}

					if (bottom > game.bottom) {
						that.y = game.bottom - that.height / 2;

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

				for (var i = 0, len = game.bangArr.length; i < len; i++) {
					bang = game.bangArr[i];

					if (!bang.hitTestObject(that)) {
						continue;
					}
				}
				for (var j = 0, len = game.qiangs.length; j < len; j++) {
					qiang = game.qiangs[j];

					if (!qiang.hitTestObject(that)) {
						continue;
					}
				}
				if (i == len && j == len && that.vx == 0 && that.vy == 0) {
					that.vx = 2 + Math.random();
					that.vy = 2 + Math.random();
				}

				game.playerArr.forEach(function (player) {
					if (player.hitTestObject(that)) {
						mediator.fire("playerDied", {
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
	}
});

module.exports = Monster;