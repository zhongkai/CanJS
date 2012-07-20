/**
 * @author stefan
 * @fileOverview 基础圆形类
 */

/**
 * 圆形类
 * @constructor
 * @augments Rect
 */
define(['Can', 'element/Rect'], function(can, Rect) {
	var Circle = can.inherit(Rect, {
		constructor: function(config) {
			Rect.call(this, config);
		},
		render: function(context) {
			var size = this.getSize(), 
				fill = this.getFill(), 
				a = this.getAnchor();
		    var deltaX = size.width / 2;
		    var deltaY = size.height / 2;
			context.save();
		    context.save();
		    context.scale(deltaX, deltaY);
		    context.translate(1 - 2 * a[0], 1 - 2 * a[1]);
		    context.beginPath();
		    context.arc(0, 0, 1, 0, 2 * Math.PI, false);
		    context.closePath();
		    context.restore();
		    context.clip();
		
		    Rect.prototype.render.call(this, context);
		    
		    if(this.getBorder()){
		        context.lineWidth *= 2;
		        context.stroke();
		    }
		    
		    context.restore();
		},
		
		eventTest: function(e) {
		    var position = this.screenToSelf({
				//不能用x和y，否则会丢失scroll的距离
				x: e.pageX,
				y: e.pageY
			});
		    var s = this.__size, a = this.__anchor,
		        w = s.width/2, h = s.height/2,
		        x = position.x - s.width * (.5 - a[0]),
		        y = position.y - s.height * (.5 - a[1]);
		
		    if ((x * x) / (w * w) + (y * y) / (h * h) < 1) {
		        return position;
		    }
		    return false;
		}
	});

	return Circle;
});
