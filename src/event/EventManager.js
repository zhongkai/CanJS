/**
 * @author stefan
 * @version 1.0
 */
goog.provide('Stefan.EventManager');

goog.require('Stefan');
goog.require('Stefan.Event');

//TODO: 增加自定义事件
Stefan.EventManager = (function() {
	var eventCache = {};
	
	var eventsArr = ['mousedown', 'mouseup', 'mousemove', 'click', 'dblclick'];
	
	
	var Manager = T.lang.createClass(function() {
	}).extend({
		reRegister: function(layer, element) {
			if(!layer.id) return;
			var layerEvents = eventCache[layer.id];
		},
		register: function(layer, element, type, callback) {
			if(!layer) return;
			var id = layer.id;
			if(!eventCache[id]) {
				eventCache[id] = {};
				T.each(eventsArr, function(eType) {
					T.on(layer.canvas, eType, function(event) {
						var eventObj = eventCache[id][event.type];
						if(eventObj) {
							eventObj.nativeEvent = event;
							eventObj.fire(event);
						}
					});
				});
			}
			
			if(!eventCache[id][type]) eventCache[id][type] = new Stefan.Event(type);
			eventCache[id][type].register(element, callback);
		},
		
		destroy: function(layer, element, type, callback) {
			if(!layer) return;
			if(eventCache[layer.id] && eventCache[layer.id][type])
				eventCache[layer.id][type].destroy(element, callback);
		}
	});
	
	var manager = new Manager();
	
	return manager;
})();
