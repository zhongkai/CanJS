/**
 * @author stefan
 * @fileOverview 基础圆角矩形类
 */

goog.provide('Stefan.RoundedRect');

goog.require('Stefan');
goog.require('Stefan.Rect');

/**
 * 圆角矩形类
 * @constructor
 * @augments Stefan.Rect
 */
Stefan.RoundedRect = T.lang.createClass(function(config) {
	Stefan.Rect.call(this, config);
	this.__radius = 5;
}, {
	superClass: Stefan.Rect
}).extend(
/** @lends Stefan.RoundedRect.prototype */
{
	
	/**
	 * 设置圆角矩形的border-radius
	 * @param {number} 半径像素值
	 */
	setRadius: function(value) {
	    this.__radius = value;
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 返回圆角矩形的border-radius
	 * @returns {number} 半径像素值
	 */
	getRadius: function() {
	    return this.__radius;
	},
	
	render: function(context) {
	    var size = this.getSize(), 
	    	fill = this.getFill;
		var bounds = this.getSelfBounds();
	
	    var radius = this.getRadius(),
	        x = bounds.left,
	        y = bounds.top,
	        width = bounds.right - bounds.left,
	        height = bounds.bottom - bounds.top;
	
	    context.save();
	    //绘制圆角矩形的剪切路径
	    context.beginPath();
	    context.moveTo(x + radius, y);
	    context.lineTo(x + width - radius, y);
	    context.quadraticCurveTo(x + width, y, x + width, y + radius);
	    context.lineTo(x + width, y + height - radius);
	    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	    context.lineTo(x + radius, y + height);
	    context.quadraticCurveTo(x, y + height, x, y + height - radius);
	    context.lineTo(x, y + radius);
	    context.quadraticCurveTo(x, y, x + radius, y);
	    context.closePath();
		
		//剪切路径，只填充圆角矩形以内的部分
	    context.clip();
	
	    Stefan.Rect.prototype.render.call(this, context);
	    
	    if(this.getBorder()){
	        context.lineWidth *= 2;
	        context.stroke();
	    }
	    
	    context.restore();
	}
});