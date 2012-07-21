define(['element/Rect'], function(Rect) {
	var XiGuan = function(layer) {
		this.cbody = new Rect().setFill('images/xiguan.png').setSize(48, 192).setPosition(0, 0).setScale(1).setAnchor(0, 0);
		
		this.water = new Rect().setFill('rgba(0,0,0,.8)').setPosition(17, 174).setAnchor(0, 1).setSize(16, 130);
		
		this.cbody.appendChild(this.water);

		layer.appendChild(this.cbody);

	};

	XiGuan.prototype.setLength = function(l) {
		this.water.setSize(18, Math.max(145 * l / Global.totalWater - 15, 0));
		if(this.water.getSize()['height'] <= 0) this.cbody.setFill('images/xiguan_empty.png');
		else this.cbody.setFill('images/xiguan.png');
	};

	return XiGuan;
});