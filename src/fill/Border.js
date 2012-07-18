goog.provide('Stefan.fill.Border');

goog.require('Stefan.fill.ColorFill');

Stefan.fill.Border = T.lang.createClass(function(config) {
	var config = config || {};
	
	config.width && this.setWidth(config.width);
	
	config.color && this.setColor(config.color);
}).extend({
	
	getWidth: function() {
		return this.__width;
	},
	
	setWidth: function(width) {
		this.__width = width;
	},
	
	getColor: function(){
	    return this.__color;
	},
	
	setColor: function(color){
	    if(color instanceof Stefan.fill.ColorFill) {
			this.__color = color;
		}
	    else {
	        this.__color = new Stefan.fill.ColorFill();
	        if(arguments.length) 
				this.__color.setColor.apply(this.__color, arguments);
	    }
	    return this;
	},
	
	render: function(context) {
		context.strokeStyle = this.getColor().getContent();
    	context.lineWidth = this.getWidth();
	}
});
