define(['element/Rect', '../game/toy'], function(Rect, Toy) {
	var CM = function(world, layer) {
		this.cbody = new Rect().setSize(200, 200).setFill('images/catchMachine/machine0001.png').setAnchor(0, 0);
		this.world = world;
		this.layer = layer;
		this.init();
		layer.appendChild(this.cbody);
		this.dropFrameCount = 7;
		this.bind();
		this.offsetX = 100;
		this.offsetY = 40;
	};

	CM.prototype.init = function() {
		this.__drop = false;
		this.__droped = false;
		this.currentPosition = -200;
		this.cbody.setPosition(-200, 0).setFill('images/catchMachine/machine0001.png');
		this.dropPoint = parseInt(Math.random() * 440);
		this.toy = new Toy(this.world, this.layer, -200 + this.offsetX, 100 + this.offsetY);
	};

	CM.prototype.drop = function() {
		var me = this, count = 0;
		me.__drop = true;
		me.__droped = true;
		var interval = setInterval(function() {
			me.cbody.setFill('images/catchMachine/machine000' + ++count + '.png');
			if(count >= 7) {
				me.__drop = false;
				clearInterval(interval);
			}
		}, 40);
	};

	CM.prototype.step = function() {
		// console.info(1);
		if(this.__drop) return;
		this.currentPosition += 4;
		this.cbody.setPosition(this.currentPosition, 0);
		this.toy && this.toy.cbody.setPosition(this.currentPosition + this.offsetX, 100 + this.offsetY);
	};

	CM.prototype.bind = function() {
		var me = this;
		timer.register(function() {
			me.step();

			if(me.cbody.getPosition().x >= me.dropPoint  && !me.__droped) {
				me.drop();
				me.toy.drop();
				me.toy = null;
			}

			if(me.currentPosition > 640) me.init();
		});
	};

	return CM;
});