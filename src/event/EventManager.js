/**
 * @author stefan
 * @version 1.0
 */
//TODO: 增加自定义事件
define(['Can', 'event/Event'], function(can, Event) {
	var eventCache = {};
	
	var eventsArr = ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchmove', 'touchend', 'click', 'dblclick'];

	var EventManager = function() {};

	$.extend(EventManager.prototype, {
		reRegister: function(layer, element) {
			if(!layer.id) return;
			var layerEvents = eventCache[layer.id];
		},
		register: function(layer, element, type, callback) {
			if(!layer) return;
			if('ontouchstart' in window) {
				type = type == 'mouseup' ? 'touchend' : type;
				type = type == 'mousedown' ? 'touchstart' : type;
				type = type == 'mousemove' ? 'touchmove' : type;
			}
			var id = layer.id;
			if(!eventCache[id]) {
				eventCache[id] = {};
				$.each(eventsArr, function(index, eType) {
					$(layer.canvas).on(eType, function(event) {
						var eventObj = eventCache[id][event.type];
						if(eventObj) {
							eventObj.nativeEvent = event;
							eventObj.fire(event);
						}
					});
				});
			}
			
			if(!eventCache[id][type]) eventCache[id][type] = new Event(type);

			eventCache[id][type].register(element, callback);
		},
		
		destroy: function(layer, element, type, callback) {
			if(!layer) return;
			if(eventCache[layer.id] && eventCache[layer.id][type])
				eventCache[layer.id][type].destroy(element, callback);
		}
	});

	return new EventManager();
});
