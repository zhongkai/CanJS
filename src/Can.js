define(function() {
	//compatible
	if(!Array.prototype.indexOf)
		Array.prototype.indexOf = function(item) {
			for(var i = 0, maxi = this.length; i < maxi; i++) {
				if(this[i] == item) return i;
			}
			return -1;
		};

	return {
		isEmptyObject: function(obj) {
		    for (var key in obj) {
		        return false;
		    }
		    
		    return true;
		},
		getByteLength: function (source) {
		    return String(source).replace(/[^\x00-\xff]/g, "ci").length;
		},
		//函数绑定
		bind: function(fn, context, args) {
            return function() {
                var args = (args || []).concat($.slice(arguments));
                fn.apply(context, args);
            }
        },

		//判断是否为数字
		isNumber: function(source) {
    		return '[object Number]' == Object.prototype.toString.call(source) && isFinite(source);
		},

		//判断是否是字符串
		isString: function(source) {
			return '[object String]' == Object.prototype.toString.call(source);
		},

		//删除数组项
		remove: function (source, match) {
		    var len = source.length;
		        
		    while (len--) {
		        if (len in source && source[len] === match) {
		            source.splice(len, 1);
		        }
		    }
		    return source;
		},

		id: function() {
			var t = new Date().getTime();
			return 'stefan-' + t + Math.floor(Math.random() * t);
		},

		inherit: function() {
			var oc = Object.prototype.constructor;

			return function(sb, sp, overrides){

				if(arguments.length < 3){
					overrides = sp;
					sp = sb;
					sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
				}

				var F = function(){},
					sbp, spp = sp.prototype;

				F.prototype = spp;

				sbp = sb.prototype = new F();

				sbp.constructor=sb;

				sb.superclass=spp;

				if(spp.constructor == oc){
					spp.constructor=sp;
				}

				sbp.superclass = sbp.supr = (function(){
					return spp;
				});

				$.extend(sbp, overrides);

				return sb;
			};
		}(),

		getPosition: function(element) {
			var parent = element, pos = {
					'left': 0,
					'top': 0
				};

			do {
	            pos.left += parent.offsetLeft;
	            pos.top  += parent.offsetTop;
	            parent = parent.offsetParent;
	        } while (parent && parent != element);

	        parent = element.offsetParent;
	        while (parent && parent != document.body) {
	            pos.left -= parent.scrollLeft;
	            parent = parent.offsetParent;
	        }

	        return pos;
		},

		//用于缓存IMAGE对象
		images: {
			
		}
	};
});

