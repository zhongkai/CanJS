/**
 * @author stefan
 * @version 1.0
 */
goog.provide('Stefan.Event');

goog.require('Stefan');

Stefan.Event = T.lang.createClass(function() {
	this.elementPool = [];
	this.callbackPool = {};
}).extend({
	/**
	 * 排序原则：小兄弟 - > 儿子 - > 爸爸
	 */
	__resetSubQueen: function(queen, element) {
		if(!queen.length) {
			queen.push(element);
			return queen;
		}
		for(var i = 0; i < queen.length; i++) {
			//暂时去掉stopAfter，提高性能
			// if(queen[i].isSibbling(element)) {
				// var parent = element.getParent();
				// //排行靠后的兄弟节点
				// var children = parent.getChildren();
				// if(children.indexOf(element) > children.indexOf(queen[i])) {
					// queen.splice(i, 0, element);
					// return queen;
				// }
				// else {
					// continue;
				// }
			// }
			//后代
			if(element.isAncestor(queen[i])) {
				queen.splice(i, 0, element);
				return queen;
			}
		}
		queen.push(element);
		return queen;
	},
	/**
	 * 按照冒泡关系重新排序
	 */
	__resetQueen: function(elements) {
		var queen = [[]];
		for(var i = 0; i < elements.length; i++) {
			var element = elements[i];
			for(var j = 0; j < queen.length; j++) {
				queen[j] = this.__resetSubQueen(queen[j], element);
			}
		}
		return queen;
	},
	
	__kickOutSetElements: function(event) {
		var result = [];
		for(var i = 0; i < this.elementPool.length; i++) {
			var element = this.elementPool[i];
			var position = element.eventTest(event) ;
			if(position !== false) {
				//添加position
				this.position = position;
				result.push(element); 
			}
		}
		return result;
	},
	
	register: function(element, callback) {
		if(this.elementPool.indexOf(element) == -1) this.elementPool.push(element);
		if(!this.callbackPool[element.id]) this.callbackPool[element.id] = [];
		if(this.callbackPool[element.id].indexOf(callback) == -1) this.callbackPool[element.id].push(callback);
	},
	
	destroy: function(element, callback) {
		if(!this.callbackPool[element.id]) return;
		T.array.remove(this.callbackPool[element.id], callback);
		if(!this.callbackPool[element.id].length) T.array.remove(this.elementPool, element);
	},
	
	/**
	 * 阻止比自己先添加的兄弟节点的同类事件触发，同时阻止事件冒泡
	 * @deprecated
	 */
	stopAfter: function() {
		this.__stopAfter = true;
	},
	
	/**
	 * 阻止事件冒泡
	 */
	stopPropagation: function() {
		this.__stopPropagation = true;
	},
	
	/**
	 * 阻止事件默认行为
	 */
	preventDefault: function() {
		if(this.nativeEvent) this.nativeEvent.preventDefault();
	},
	
	fire: function(event, debug) {
		var elements = this.__kickOutSetElements(event);
		if(!elements || !elements.length) return;
		var queen = this.__resetQueen(elements);
		if(!queen || !queen.length) return;
		for(var i = 0; i < queen.length; i++) {
			var subQueen = queen[i];
			for(var j = 0; j < subQueen.length; j++) {
				var callbacks = this.callbackPool[subQueen[j].id];
				for(var k = 0; k < callbacks.length; k++) {
					callbacks[k].call(subQueen[j], this);
				}
				//暂时去掉stopAfter，提高效率
				// if(this.__stopAfter) break;
				if(this.__stopPropagation) {
					if(subQueen[j + 1] && subQueen[j].isAncestor(subQueen[j + 1])) break;
				}
			}
		}
		this.__stopAfter = false;
		this.__stopPropagation = false;
	}
});
