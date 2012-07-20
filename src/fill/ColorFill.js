define(['Can', 'fill/Fill'], function(can, Fill) {
	var ColorFill = can.inherit(Fill, {
		constructor: function(config) {
			config = config || {};
			
			Fill.call(this, config);
			
			this.__red = 0;
			
			this.__green = 0;
			
			this.__blue = 0;
			
			this.__alpha = 1;
			
			this.__content = "rgba(0,0,0,1)";
			
			config.color && this.setColor(config.color);
			
			config.opacity && this.setOpacity(config.opacity);
		},

		render: function(context) {
			context.fillStyle = this.__content;
		},
		
		setOpacity: function(opacity) {
			if(!can.isNumber(opacity)) return this;
			
			this.setColor(this.__red, this.__green, this.__blue, opacity);
		},
		
		getContent: function() {
			return this.__content;
		},
		
		setColor: function(color) {
		    if (can.isString(color)) {
		    	if(color.substr(0, 1) == "#") {
		    		if(color.length == 4) {
						var red = parseInt(color.substr(1, 1) + color.substr(1, 1), 16),
							green = parseInt(color.substr(2, 1) + color.substr(2, 1), 16),
							blue = parseInt(color.substr(3, 1) + color.substr(3, 1), 16);
							return this.setColor(red, green, blue);
					}
					else if(color.length == 7) {
						var red = parseInt(color.substr(1, 2), 16),
							green = parseInt(color.substr(3, 2), 16),
							blue = parseInt(color.substr(5, 2), 16);
							return this.setColor(red, green, blue);
					}
		    	}
		    	else if(color.substr(0, 3) == "rgb") {
		    		var centerStr = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')'));
		    		var rgbaArr = centerStr.split(',');
		    		this.__red = parseInt(rgbaArr[0]);
		    		this.__green = parseInt(rgbaArr[1]);
		    		this.__blue = parseInt(rgbaArr[2]);
		    		if(rgbaArr[3]) this.__alpha = parseFloat(rgbaArr[3]);
		    	}
				
		    }
		    
		    if (arguments.length >= 3) {
		        this.__red = arguments[0];
		        this.__green = arguments[1];
		        this.__blue = arguments[2];
		    }
		    else if (arguments.length == 4) {
		        this.__alpha = arguments[3];
		    }
			
		    this.__content = 'rgba(' + this.__red + ',' + this.__green + ',' + this.__blue + ',' + this.__alpha + ')';
			return this;
		}
	});

	return ColorFill;
	
});

