/**
 * @author stefan
 * @fileOverview 基础方块类
 */

define(['Can', 'Updater', 'fill/Fill', 'element/Element', 'fill/ImageFill', 'fill/ColorFill', 'fill/Border'], function(can, updater, Fill, Element, ImageFill, ColorFill, Border) {
	/**
	 * 方块类
	 * @constructor
	 * @augments Element
	 */
	var Rect = can.inherit(Element, {
		constructor: function(config) {
			Element.call(this, config);
			this.setFill("#000000");
		},
		/** @lends Rect.prototype */
		/**
		 * 返回border对象
		 * @returns {Border} border对象
		 */
		getBorder: function() {
			return this.__border;
		},
		
		/**
		 * 设置border对象
		 * @param {Border} border对象
		 */
		setBorder: function(border) {
			if(border instanceof Border) {
				this.__border = border;
			}
			return this;
		},
		
		/**
		 * 返回fill填充对象
		 * @returns {Fill} 填充对象
		 */
		getFill: function() {
			return this.__fill;
		},
		
		/**
		 * 设置填充类型
		 * @param {mixed} 字符串/对象/fill填充对象/枚举
		 */
		setFill: function(fill) {
			if (fill instanceof Fill) 
				this.__fill = fill;
		    else if (arguments.length > 2 && !/repeat/.test(arguments[1]))
		        this.__fill = new ColorFill({
					color: Array.prototype.slice.call(arguments)
				});
			else if (can.isString(fill) && (fill.substring(0, 4) == 'rgb(' ||
		        fill.substring(0, 5) == 'rgba(' || fill.substring(0, 1) == '#')) 
		        this.__fill = new ColorFill({
					color: fill
				});
			else {
				// if(arguments[1]) debugger;
				this.__fill = new ImageFill(fill, arguments[1]);
			}
		    	
		    this.__fill.element = this;
				
			if(this.getStage()) updater.register(this.getStage());
			
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
				if(!(fill instanceof ImageFill))
		     	   context.fillRect(bounds.left, bounds.top, size.width, size.height);
		    }
		    if(border){
		        border.render(context, this);
		        var w = border.getWidth();
		        context.strokeRect(bounds.left + w / 2, bounds.top + w / 2, size.width - w, size.height - w);
		    }
		}
	});

	return Rect;
});
