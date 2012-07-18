/**
 * @author stefan
 * @fileOverview 基础方块类
 */
goog.provide('Stefan.Rect');

goog.require('Stefan');
goog.require('Stefan.Element');
goog.require('Stefan.fill.ImageFill');
goog.require('Stefan.fill.ColorFill');

/**
 * 方块类
 * @constructor
 * @augments Stefan.Element
 */
Stefan.Rect = T.lang.createClass(function(config) {
	Stefan.Element.call(this, config);
	this.setFill("#000000");
}, {
	superClass: Stefan.Element
}).extend(
/** @lends Stefan.Rect.prototype */
{
	/**
	 * 返回border对象
	 * @returns {Stefan.fill.Border} border对象
	 */
	getBorder: function() {
		return this.__border;
	},
	
	/**
	 * 设置border对象
	 * @param {Stefan.fill.Border} border对象
	 */
	setBorder: function(border) {
		if(border instanceof Stefan.fill.Border) {
			this.__border = border;
		}
		return this;
	},
	
	/**
	 * 返回fill填充对象
	 * @returns {Stefan.fill.Fill} 填充对象
	 */
	getFill: function() {
		return this.__fill;
	},
	
	/**
	 * 设置填充类型
	 * @param {mixed} 字符串/对象/fill填充对象/枚举
	 */
	setFill: function(fill) {
		if (fill instanceof Stefan.fill.Fill) 
			this.__fill = fill;
	    else if (arguments.length > 2)
	        this.__fill = new Stefan.fill.ColorFill({
				color: Array.prototype.slice.call(arguments)
			});
		else if (T.lang.isString(fill) && (fill.substring(0, 4) == 'rgb(' ||
	        fill.substring(0, 5) == 'rgba(' || fill.substring(0, 1) == '#')) 
	        this.__fill = new Stefan.fill.ColorFill({
				color: fill
			});
		else	
	    	this.__fill = new Stefan.fill.ImageFill(fill);
	    	
	    this.__fill.element = this;
			
		if(this.getStage()) Stefan.Updater.register(this.getStage());
		
		return this;
	},
	
	render: function(context) {
		var stage = this.getStage();
		if(!stage) return;
		var size = this.getSize(),
			fill = this.getFill(),
			border = this.getBorder(),
			bounds = this.getSelfBounds();
			
		if(fill){
			fill.render(context, this);
			if(!(fill instanceof Stefan.fill.ImageFill))
	     	   context.fillRect(bounds.left, bounds.top, size.width, size.height);
	    }
	    if(border){
	        border.render(context, this);
	        var w = border.getWidth();
	        context.strokeRect(bounds.left + w / 2, bounds.top + w / 2, size.width - w, size.height - w);
	    }
	}
});
