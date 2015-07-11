/**
 * Created by admin on 15/7/11.
 */
/**
 * Created by admin on 15-5-12.
 */


(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame =
			window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	var blacklisted = /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent);

	if (!window.requestAnimationFrame || blacklisted) {
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}


	if (!window.cancelAnimationFrame || blacklisted) {
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	}

}());

window.onload = function () {

	this.canvas = document.querySelector("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	this.ctx = canvas.getContext("2d");

	var m = new Monster(100,100);
	var n = new Monster(400,400);
	var o = new Monster(500,500);

	var s = new Stick();

	var frame = 0;
	function loop() {

		ctx.clearRect(-1000, -1000, 3000, 3000);

		frame++;

		m.update();
		m.draw();

		n.update();
		n.draw();

		o.update();
		o.draw();

		s.update();
		s.draw();

		requestAnimationFrame(loop);
	}

	loop();


	function mousedown(e) {
		e.preventDefault();
		e.stopPropagation();

		Manager.pepole.x = e.pageX;
		Manager.pepole.y = e.pageY;

		m.state = MonsterState.BLOODTHIRSTY;
	}

	function mouseup(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	var $wrapper = document.querySelector("#wrapper");
	$wrapper.addEventListener("mousedown", mousedown, false);
	$wrapper.addEventListener("touchstart", mousedown, false);
}