goog.provide('Stefan');

//浏览器兼容
if(!Array.prototype.indexOf)
	Array.prototype.indexOf = function(item) {
		for(var i = 0, maxi = this.length; i < maxi; i++) {
			if(this[i] == item) return i;
		}
		return -1;
	};

Stefan = {
	id: function() {
		var t = new Date().getTime();
		return 'stefan-' + t + Math.floor(Math.random() * t);
	},
	//用于缓存IMAGE对象
	images: {
		
	}
};
