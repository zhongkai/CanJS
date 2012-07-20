define(['fill/ColorFill'], function(ColorFill) {
	var Border = function(config) {
		var config = config || {};
		
		config.width && this.setWidth(config.width);
		
		config.color && this.setColor(config.color);
	};

	$.extend(Border.prototype, {
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
		    if(color instanceof ColorFill) {
				this.__color = color;
			}
		    else {
		        this.__color = new ColorFill();
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

	return Border;
});
