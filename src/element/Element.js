/**
 * @author stefan
 * @fileOverview 基础元素类
 */
define(['Can', 'Updater', 'event/EventManager'], function(can, updater, eventManager) {
	var Element = function(config) {
	    var config = config || {};
		
		this.id = can.id();
		
	    this.__parent = null;
		
		this.__children = [];
		
		this.__anchor = [0, 0];
		
		this.__size = {
			width: 0,
			height: 0
		};
		
		this.__position = {
	        x: 0,
	        y: 0
	    };
	    
	    this.__scale = [1, 1];
		
		this.__rotation = 0;
		
		this.__eventsHandler = {};
		
		this.__stage = null;
		
	};
	
	$.extend(Element.prototype, {
		/** @lends can.Element.prototype */
		/**
		 * 返回父元素
		 * @returns {can.Element} 父元素
		 */
		getParent: function() {
		    return this.__parent;
		},
		
		/**
		 * 返回子元素数组
		 * @returns {array} 子元素数组
		 */
		getChildren: function() {
			return this.__children;
		},
		
		/**
		 * 添加子元素
		 * @param {can.Element} child 子元素
		 */
		appendChild: function(child) {
			if(!child instanceof Element) return;
			var oldParent = child.getParent();
			
		    if (oldParent && oldParent !== this) {
		        oldParent.removeChild(child);
		    }
		    
		    child.__parent = this;
		    child.__stage = this.__stage;
		    
			if(this.__children.indexOf(child) == -1) {
				this.__children.push(child);
				child.reRegisterEvents(oldParent, this);
			}
			
			if((!oldParent || oldParent !== this) && this.getStage())
				updater.register(this.getStage());
			
			return this;
		},
		
		registerUpdater: function() {
			var stage = this.getStage();
			if(stage) updater.register(stage);
		},
		
		/**
		 * 删除子元素
		 * @param {can.Element} child 子元素
		 */
		removeChild: function(child) {
			can.remove(this.__children, child);
			child.__parent = null;
			this.registerUpdater();
		},
		
		/**
		 * 返回旋转值（度数）
		 * @returns {number} 度数
		 */
		getRotation: function() {
		    return this.__rotation;
		},
		
		/**
		 * 设置旋转值（度数）
		 * @param {number} value 度数
		 */
		setRotation: function(value) {
			if(!can.isNumber(value)) return this;
		
		    this.__rotation = value % 360;
			
			this.registerUpdater();
			
			return this;
		},
	    
	    /**
		 * 返回元素大小
		 * @returns {object} 元素大小size(object):size.width为宽度，size.height为高度
		 */
	    getSize: function(){
	        return this.__size;
	    },
	    
	    /**
		 * 设置元素大小
		 * @param {mixed} size 元素大小（可以是对象或者枚举参数）
		 */
	    setSize: function(size){
	        if (arguments.length == 2) 
	            this.__size = {
	                width: size,
	                height: arguments[1]
	            };
	        else 
	            this.__size = size;
				
			this.registerUpdater();
	        
	        return this;
	    },
	    
	    /**
		 * 返回元素大小
		 * @returns {array} 元素锚点anchor(array):anchor[0]为很坐标，anchor[1]为纵坐标
		 */
	    getAnchor: function(){
	        return this.__anchor;
	    },
	    
	    /**
		 * 设置元素大小
		 * @returns {mixed} anchor 元素锚点（可以是数组或者枚举参数）
		 */
	    setAnchor: function(anchor){
	        if (arguments.length == 2) 
	            this.__anchor = [arguments[0], arguments[1]];
	        else 
	            this.__anchor = anchor;
				
			this.registerUpdater();
	        
	        return this;
	    },
	    
	    /**
		 * 返回元素位置(相对于父元素)
		 * @returns {object} 元素锚点opsition(object):position.x为很坐标，position.y为纵坐标
		 */
	    getPosition: function(){
	        return this.__position;
	    },
	    
	    /**
		 * 设置元素位置(相对于父元素)
		 * @returns {mixed} value 元素位置（可以是对象或者枚举参数）
		 */
	    setPosition: function(value){
	        if (arguments.length == 2) {
	            this.__position = {
	                x: value,
	                y: arguments[1]
	            };
	        }
	        else {
	            this.__position = value;
	        }
			
			this.registerUpdater();
			
	        return this;
	    },
		
		/**
		 * 返回缩放值
		 * @returns {array} 元素缩放值scale(array):scale[0]横向缩放值，scale[1]纵向缩放值
		 */
		getScale: function() {
		    return this.__scale;
		},
		
		/**
		 * 设置缩放值
		 * @returns {mixed} value 元素缩放值（可以是数组或者枚举参数）
		 */
		setScale: function(value) {
		    if (arguments.length == 1 && can.isNumber(value)) {
		        this.__scale = [value, value];
		    }
		    else if (arguments.length == 2) {
		        this.__scale = [value, arguments[1]];
		    }
		    else {
		        this.__scale = value;
		    }
			
			this.registerUpdater();
			
		    return this;
		},
	    
		/**
		 * 返回以anchor点为中心的上右下左的距离
		 * @returns {object} 包含top/right/bottom/left四属性的对象
		 */
	    getSelfBounds: function(){
			var s = this.getSize(), 
				a = this.getAnchor();
	        return {
	            top: -s.height * a[1],
	            right: s.width * (1 - a[0]),
	            bottom: s.height * (1 - a[1]),
	            left: -s.width * a[0]
	        };
	    },
		
		/**
		 * 是否隐藏（不渲染）这个元素
		 * @param {boolean} value true/false
		 * @returns {can.Element} 元素自身
		 */
		hide: function(value) {
			this.__hidden = value;
			this.registerUpdater();
			return this;
		},
		
		/**
		 * 返回是否隐藏（不渲染）这个元素
		 * @returns {boolean} true/false
		 */
		isHidden: function() {
			return this.__hidden;
		},
		
		/**
		 * 返回真正的渲染范围（考虑子元素超出父元素的情况）
		 * @returns {object} 包含top/right/bottom/left四属性的对象
		 */
		getRealBounds: function() {
		    var b = this.getSelfBounds(),
		    	__this = this;
		    
			$.each(this.__children, function(index, child) {
				var childB = child.getRealBounds();
				
				var tl = {
					x: childB.left, 
					y: childB.top
				};
			    var tr = {
					x: childB.right,
					y: childB.top
				};
			    var bl = {
					x: childB.left,
					y: childB.bottom
				};
			    var br = {
					x: childB.right,
					y: childB.bottom
				};
			
			    tl = __this.selfToParent(tl);
			    tr = __this.selfToParent(tr);
			    bl = __this.selfToParent(bl);
			    br = __this.selfToParent(br);
			
			    b.top = Math.floor(Math.min(tl.y, tr.y, bl.y, br.y, b.top));
			    b.right = Math.ceil(Math.max(tl.x, tr.x, bl.x, br.x, b.right));
			    b.bottom = Math.ceil(Math.max(tl.y, tr.y, bl.y, br.y, b.bottom));
			    b.left = Math.floor(Math.min(tl.x, tr.x, bl.x, br.x, b.left));
			});
			
			
		    return b;
		},
		
		/**
		 * 返回针对于Layer(canvas)的坐标转化
		 * @returns {object} 包含x/y两个属性的对象
		 */
		selfToLayer: function() {
			var stage = this.getStage();
			if(!stage) return false;
			var pos = this.selfToScreen();
			var spos = stage.getPosition();
			return {
				x: pos.x - spos.x,
				y: pos.y - spos.y
			};
		},
		
		/**
		 * 返回针对于窗口的坐标转化
		 * @returns {object} 包含x/y两个属性的对象
		 */
		selfToScreen: function() {
			var stage = this.getStage();
			if(!stage) return false;
			var pos = this.getPosition();
			var x = pos.x;
			var y = pos.y;
			var target = this;
			while(target.__parent && target !== stage) {
				var b = target.__parent.getSelfBounds();
				var ppos = target.__parent.getPosition();
				x += b.left + ppos.x;
				y += b.top + ppos.y;
				target = target.__parent;
			}
			return {
				x: x,
				y: y
			};
		},
	    
	    /**
	     * 更新调用接口
	     */
	    update: function(){
			var stage = this.getStage();
			if(!stage) return;
			
			var context = stage.canvas.getContext("2d");
			
			var realBounds = this.getRealBounds();
			
			var size = this.getSize();
			
			var clearPos = this.selfToLayer();
			
	        context.clearRect(clearPos.x, clearPos.y, realBounds.right - realBounds.left, realBounds.bottom - realBounds.top);
	        context.save();
	        
			var	anchor = this.getAnchor();
	        
	        context.translate(size.width * anchor[0], size.height * anchor[1]);
	        
	        this.renderAll(context);
	        
	        context.restore();
	    },
		
		/**
		 * 渲染自身（填充描边）
		 * @param {Object} context
		 */
		render: function(context){},
		
		/**
		 * 渲染自身和所有子节点
		 * @param {Object} context
		 */
		renderAll: function(context) {
		    if (this.__hidden) {
		        return;
		    }
			
			this.render(context);
			
			for(var i = 0, maxi = this.__children.length; i < maxi; i++) {
				var child = this.__children[i];
				var pos = child.selfToParent({x: 0, y: 0}), 
					rot = child.getRotation(), 
					scale = child.getScale();
					
		        context.save();
		        context.translate(pos.x, pos.y);
		        context.scale(scale[0], scale[1]);
		        
		        if (rot != 0) {
		            context.rotate(-rot * Math.PI / 180);
		        }
		        child.renderAll(context);
		        context.restore();
			}
		},
		
		/**
		 * 返回layer舞台
		 * @returns {can.Layer} layer
		 */
		getStage: function() {
			if(this.__stage) return this.__stage;
			if(!this.__parent) return false;
			var parent = this.__parent;
			//必须完全等于，Layer的__stage属性是undefiend
			while(!parent.getStage()) {
				parent = parent.__parent;
				if(!parent) return false;
			}
			this.__stage = parent.getStage();
			return this.__stage;
		},
		
		/**
		 * 返回从窗口到自身的坐标转化后的位置
		 * @returns {object} 包含x/y两个属性的对象
		 */
		screenToSelf: function(position) {
			//没有append进来
		    if (!this.getStage()) return position;
		    position = this.getParent().screenToSelf(position);
		
		    return this.parentToSelf(position);
		},
		
		/**
		 * 返回从父元素到自身的坐标转化后的位置
		 * @returns {object} 包含x/y两个属性的对象
		 */
		parentToSelf: function(position) {
		    if (!this.getParent()) return;
		
		    position.x -= this.__position.x;
		    position.y -= this.__position.y;
		
		    position.x /= this.__scale[0];
		    position.y /= this.__scale[1];
		
		    if (this.rotation_ != 0) {
		        var c2 = $.clone(position),
		            rot = this.__rotation * Math.PI / 180,
		            cos = Math.cos(rot),
		            sin = Math.sin(rot);
		        position.x = cos * c2.x - sin * c2.y;
		        position.y = cos * c2.y + sin * c2.x;
		    }
		
		    return position;
		},
		
		/**
		 * 返回从自身到父元素的坐标转化后的位置
		 * @returns {object} 包含x/y两个属性的对象
		 */
		selfToParent: function(position) {
		    if (!this.getParent()) return position;
		    if (this.__rotation != 0) {
		        var rot = -this.__rotation * Math.PI / 180,
		            cos = Math.cos(rot),
		            sin = Math.sin(rot);
		        position.x = cos * position.x - sin * position.y;
		        position.y = cos * position.y + sin * position.x;
		    }
		
		    position.x *= this.__scale[0];
		    position.y *= this.__scale[1];
		
		    position.x += this.__position.x;
		    position.y += this.__position.y;
		
		    return position;
		},
		
		/**
		 * 事件检测
		 * @param {object} e Event对象
		 */
		eventTest: function(e) {
			var position = this.screenToSelf({
				//不能用x和y，否则会丢失scroll的距离
				//兼容移动的touchend
				x: e.pageX || e.changedTouches[0].pageX,
				y: e.pageY || e.changedTouches[0].pageY
			});
			var bounds = this.getSelfBounds();
		    if (bounds.left <= position.x && bounds.right >= position.x &&
		    	bounds.top <= position.y && bounds.bottom >= position.y) {
		        return position;
		    }
		    return false;
		},
		
		/**
		 * 返回传入节点是否为兄弟节点
		 * @param {can.Element} element
		 * @returns {boolean} true/false
		 */
		isSibbling: function(element) {
			var parent = this.getParent();
			if(!parent) return;
			for(var i = 0; i < parent.__children.length; i++) {
				if(parent.__children[i] == element && element.id !== this.id) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 * 返回传入节点是否为祖先节点
		 * @param {can.Element} element
		 * @returns {object} true/false
		 */
		isAncestor: function(element) {
			var parent = this.getParent();
			while(parent) {
				if(parent == element) return true;
				parent = parent.getParent();
			}
			return false;
		},
		
		/**
		 * 设置事件监听
		 * @param {string} type 事件类型
		 * @param {Function} callback 监听方法
		 */
		on: function(type, callback) {
			if(!this.__eventsHandler[type]) this.__eventsHandler[type] = [];
			if(this.__eventsHandler[type].indexOf(callback) == -1) this.__eventsHandler[type].push(callback); 
			if(!this.getStage()) return;
			eventManager.register(this.getStage(), this, type, callback);
		},
		
		/**
		 * 取消事件监听
		 * @param {string} type 事件类型
		 * @param {Function} callback 监听方法
		 */
		un: function(type, callback) {
			if(!this.__eventsHandler[type]) return;
			can.remove(this.__eventsHandler[type], callback);
			if(!this.getStage()) return;
			eventManager.destroy(this.getStage(), this, type, callback);
		},
		
		/**
		 * 重新设置监听事件（一般发生在appendChild之后）
		 * @param {can.Element} oldP 原来的父节点
		 * @param {can.Element} newP 新的父节点
		 */
		reRegisterEvents: function(oldP, newP) {
			if(can.isEmptyObject(this.__eventsHandler)) return;
			if(oldP && oldP.getStage() == newP.getStage()) return;
			if(oldP)
				for(var i in this.__eventsHandler) {
					for(var j = 0; j < this.__eventsHandler[i].length; j++) {
						this.un(i, this.__eventsHandler[i][j]);
					}
				}
			for(var i in this.__eventsHandler) {
				for(var j = 0; j < this.__eventsHandler[i].length; j++) {
					this.on(i, this.__eventsHandler[i][j]);
				}
			}
		}
	});

	return Element;
});

