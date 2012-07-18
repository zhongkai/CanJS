goog.provide('Stefan.Polygon');
goog.require('Stefan.Rect');

/**
 * 多边形类
 * Note：不用为多边形设置Anchor和Size
 * @param {Object} config
 * @example
 * {
 * 	points: [p1, p2, p3...]
 * }
 * @constructor
 * @augments Stefan.Rect
 */
Stefan.Polygon = T.lang.createClass(function(config) {
	config = config || {};
	Stefan.Rect.call(this, config);
    if(config.points) this.setPoints(config.points);
}, {
	superClass: Stefan.Rect
}).extend({
	
	/**
	 * 获得多边形的所有顶点
	 * @return {array} 顶点数组
	 */
	getPoints: function() {
	    return this.__points;
	},
	
	/**
	 * 设置多边形的所有顶点
	 * @param {array} points 所有顶点
	 * @return {Stefan.Polygon} 多边形实例本身
	 */
	setPoints: function(points) {
		var points = baidu.lang.toArray(points);
		this.__points = [];
	    for(var i = 0, maxi = points.length; i < maxi; i++) {
	    	this.addPoint(points[i]);
	    }
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 添加顶点
	 * @param {array|object} points 顶点或者顶点数组
	 * @return {Stefan.Polygon} 多边形实例本身
	 */
	addPoint: function(points) {
	    var points = baidu.lang.toArray(points);
	    if (!points.length) return;
	
		for (var i = 0; i < points.length; i++) {
			if (!this.__points.length) {
				this.__minX = this.__maxX = points[i].x;
				this.__minY = this.__maxY = points[i].y;
			}
			else {
				this.__minX = Math.min(points[i].x, this.__minX);
				this.__maxX = Math.max(points[i].x, this.__maxX);
				this.__minY = Math.min(points[i].y, this.__minY);
				this.__maxY = Math.max(points[i].y, this.__maxY);
			}
			
			this.__points.push(points[i]);
		}
		if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	getSize: function() {
	    return {
	    	width: this.__maxX - this.__minX, 
	    	height: this.__maxY - this.__minY
	    };
	},
	
	getAnchor: function() {
	    var size = this.getSize();
	    return [-this.__minX / size.width, -this.__minY / size.height];
	},
	
	eventTest: function(e) {
	    var position = this.screenToSelf({
			x: e.pageX,
			y: e.pageY
		});
		var pointsLength = this.__points.length;
		var inPoly = false;
		
	    if (pointsLength > 2) {
	    	//算法，判断该点和多边形边的交点的个数是否为奇数，如果是，则在多边形内，否则在多边形外
	        for (i = 0, j = pointsLength - 1; i < pointsLength; j = i++) {
	            if (((this.__points[i].y > position.y) != (this.__points[j].y > position.y)) &&
	                (position.x < (this.__points[j].x - this.__points[i].x) * (position.y - this.__points[i].y) /
	                    (this.__points[j].y - this.__points[i].y) + this.__points[i].x)) {
	                    inPoly = !inPoly;
	                }
	        }
	    }
	
	    return inPoly;
	},

	render: function(context) {
	    var size = this.getSize(), fill = this.getFill(), border = this.getBorder();
	    if(this.__points.length <= 2) return;
	    
		context.save();
		context.beginPath();
		context.moveTo(this.__points[0].x, this.__points[0].y);
		for (var i = 1, maxi = this.__points.length; i < maxi; i++) {
				context.lineTo(this.__points[i].x, this.__points[i].y);
		}
		context.closePath();
		context.clip();
		
		Stefan.Rect.prototype.render.call(this, context);
		
		var border = this.getBorder();
		
		//clip砍掉一半stoke
		if(border){
			context.lineWidth = border.getWidth() * 2;
		    context.stroke();
		}
		
		context.restore();
	}
});


