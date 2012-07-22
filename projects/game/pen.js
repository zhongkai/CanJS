define(['element/Rect'], function(Rect) {
	var Pen = function(layer) {
		this.cbody = new Rect().setSize(80, 80).setAnchor(.5, .5);

		var me = this;

		me.cbody.setPosition(10000, 10000);

		layer.appendChild(me.cbody);

		var fun = function() {
			me.init();
			var p = me.getPosition();
			me.cbody.setPosition(p.x, p.y);
			setTimeout(function() {
				me.remove();
			}, 10000);
		};

		setInterval(fun, 15000);
		fun();
	};

	Pen.prototype.init = function() {
		this.cbody.setFill('images/pen/pen' + Math.ceil(Math.random() * 5) + '.png');
		this.x = parseInt(Math.random() * 500 + 70);
		this.y = parseInt(Math.random() * 700 + 100);
	};

	Pen.prototype.getPosition = function() {
		return {
			x: this.x,
			y: this.y
		};
	};

	Pen.prototype.remove = function() {
		this.cbody.setPosition(10000, 10000);
		this.x = -100;
		this.y = -100;
	};

	return Pen;
})