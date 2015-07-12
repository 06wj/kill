/**
 * Created by admin on 15/7/10.
 */

KISSY.add("kill/monster", function (S,resource,Event, config) {



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


			this.idleDir = IDLEDIR.P;

			this.lastVx = this.vx = 2 + Math.random();
			this.lastVy = this.vy = 2 + Math.random();

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

			if(config.showHit){
				this.background = "rgba(0,255,0,.4)";
			}

			var textures = Hilo.TextureAtlas.createSpriteFrames([
				["state", "0-1", resource.get("monster1"), 54, 64, true, 300],
				["walk", "2-5", resource.get("monster1"), 54, 64, true, 300],
				["die", "6,1,6,1", resource.get("monster1"), 54, 64, true, 100]
			]);
			this.display = new Hilo.Sprite({
				y:-22,
				frames:textures,
				loop:true,
				timeBased:true
			});

			this.colliders = _game.shuRects + _game.hengRects;

			this.width = 54;
			this.height = 40;
			this.pivotX = this.width*.5;
			this.pivotY = this.height*.5;
			this.scaleX =  1;
			this.scaleY = 1;

			this.addChild(this.display);
			this.display.goto("walk");
		},
		Extends:Hilo.Container,
		die: function(){
			var that = this;
			if(!this.isDie){
				this.isDie = true;
				this.display.goto("die");
				this.display.interval = 10;
				this.onUpdate = null;
				setTimeout(function(){
					var textures = Hilo.TextureAtlas.createSpriteFrames([
						["state", "0-5", resource.get("monsterDie"), 38, 40, false, 100]
					]);
					that.display.removeFromParent();
					that.display = new Hilo.Sprite({
						y:0,
						x:that.width*.5,
						pivotX:19,
						frames:textures,
						loop:true,
						timeBased:true
					});
					that.addChild(that.display);
					that.display.play();
					setTimeout(function(){
						that.removeFromParent();
					}, 1000);
				}, 300);
			}
		},
		onUpdate: function () {
			var that = this;

			var left = that.x - that.width/2;
			var top = that.y - that.height/2;
			var right = that.x + that.width/2;
			var bottom = that.y + that.height/2;

			var bang = null;

//			if(left < _game.left){
//				this.x = _game.left + this.width/2;
//
//				if(that.lastVy * that.vy < 0){
//					that.vy = - that.vy;
//				}
//
//			}
//
//			if(top < _game.top){
//				this.y = _game.top + this.height/2;
//				that.vy = - that.vy;
//			}
//
//			if(right > _game.right){
//				this.x = _game.right - this.width/2;
//				that.vx = - that.vx;
//			}
//
//			if(bottom > _game.bottom){
//				this.y = _game.bottom - this.height/2;
//				that.vy = - that.vy;
//			}
//

			var qiang,sniffer = 5;
			for(var i = 0, len = _game.qiangs.length; i < len; i++){
				qiang = _game.qiangs[i];
				if(qiang.hitTestObject(that)){

					that.x += sniffer;

					if(!qiang.hitTestObject(that)){
						that.vx = Math.abs(that.vx);
						break;
					}
					else{
						that.x -= sniffer;
					}


					that.x -= sniffer;

					if(!qiang.hitTestObject(that)){
						that.vx = -Math.abs(that.vx);
						break;
					}
					else{
						that.x += sniffer;
					}

					that.y += sniffer;

					if(!qiang.hitTestObject(that)){
						that.vy = Math.abs(that.vy);
						break;
					}
					else{
						that.y -= sniffer;
					}

					that.y -= sniffer;

					if(!qiang.hitTestObject(that)){
						that.vy = -Math.abs(that.vy);
						break;
					}
					else{
						that.y += sniffer;
					}
				}
			}

			var bang;
			for(var i = 0, len = _game.bangArr.length; i < len; i++){
				bang = _game.bangArr[i];
				if(bang.hitTestObject(that)){

					that.x += sniffer;

					if(!bang.hitTestObject(that)){
						that.vx = Math.abs(that.vx);
						break;
					}
					else{
						that.x -= sniffer;
					}


					that.x -= sniffer;

					if(!bang.hitTestObject(that)){
						that.vx = -Math.abs(that.vx);
						break;
					}
					else{
						that.x += sniffer;
					}

					that.y += sniffer;

					if(!bang.hitTestObject(that)){
						that.vy = Math.abs(that.vy);
						break;
					}
					else{
						that.y -= sniffer;
					}

					that.y -= sniffer;

					if(!bang.hitTestObject(that)){
						that.vy = -Math.abs(that.vy);
						break;
					}
					else{
						that.y += sniffer;
					}
				}
			}


//			for(i = 0,len = _game.bangArr.length; i < len; i++){
//
//				bang = _game.bangArr[i];
//				if(bang.hitTestObject(that)){
//
//					var bangLeft = bang.x;
//					var bangRight = bang.x + bang.width;
//					var bangTop = bang.y;
//					var bangBottom = bang.y + bang.height;
//
//					//第一，二，三四象限
//					var A = (top < bangTop && left > bangLeft);
//					var B = (top >= bangTop && left <= bangLeft);
//					var C = (bottom > bangBottom && right < bangRight);
//					var D = (bottom <= bangBottom && right >= bangRight);
//
//
//					if(A){
//						that.vy = - that.vy;
//
//						that.y -=10;
//
//						while(bang.hitTestObject(that)){
//							that.y -=10;
//						}
//					}
//
//					if(B){
//						that.vx = - that.vx;
//
//						that.x -=10;
//
//						while(bang.hitTestObject(that)){
//							that.x -=10;
//						}
//					}
//
//					if(C){
//						that.vy = - that.vy;
//
//						that.y +=10;
//
//						while(bang.hitTestObject(that)){
//							that.y +=10;
//						}
//					}
//
//					if(D){
//						that.vx = - that.vx;
//
//						that.x +=10;
//
//						while(bang.hitTestObject(that)){
//							that.x +=10;
//						}
//					}
//
//
//					if(left < _game.left){
//						that.x = _game.left + that.width/2;
//						that.vx = 0;
//						//bang.x = that.x + that.width;
//
//						bang.vx = -bang.lastVx;
//
//						if(that.lastVy * that.vy < 0){
//							that.vy = - that.vy;
//						}
//					}
//
//					if(top < _game.top){
//						that.y = _game.top + that.height/2;
//
//						bang.y = that.y + that.height;
//						bang.vx = 0;
//						bang.vy = 0;
//						that.vy = - that.vy;
//					}
//
//					if(right > _game.right){
//						that.x = _game.right - that.width/2;
//
//						bang.vx = 0;
//						bang.vy = 0;
//
//						bang.x = _game.right - that.width;
//						that.vx = - that.vx;
//					}
//
//					if(bottom > _game.bottom){
//						that.y = _game.bottom - that.height/2;
//
//						bang.vx = 0;
//						bang.vy = 0;
//
//						bang.y = _game.bottom - that.height;
//						that.vy = - that.vy;
//					}
//
//					break;
//				}
//			}

			_game.playerArr.forEach(function(player){

				if(player.hitTestObject(that)){
//					Event.fire("playerDied",{
//						player:player
//					});
				}
			});


			this.x += this.vx;
			this.y += this.vy;

			that.lastVx = that.vx;
			that.lastVy = that.vy;
		}
	});

	return Monster;

},{
	requires:["kill/resource","kill/mediator","kill/config"]
});