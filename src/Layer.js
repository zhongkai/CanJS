/**
 * @author stefan
 * @fileOverview Layer，Canvas层
 */
/**
 * 层
 * @constructor
 * @augments Element
 */
define(['Can', 'Updater', 'element/Element'], function(can, updater, Element) {
	Layer = can.inherit(Element, {
		constructor: function(dom, config) {
			Element.call(this, config);
			if(!dom) return;
			var layerCanvas = this.canvas = document.createElement("CANVAS");
			layerCanvas.setAttribute("id", this.id);
			if(can.isString(dom)) dom = $(dom);
			dom.appendChild(layerCanvas);
			
			this.parentDom = dom;
			
			//未指定大小，填充父容器
			this.setSize(config.width || dom.clientWidth, config.height || dom.clientHeight);
			
			if(config.left !== undefined && config.top !== undefined)this.setPosition(config.left, config.top);
			
			updater.registerLayer(this.id);
		},

		screenToSelf: function(position) {
			var canvasPosition = can.getPosition(this.canvas);
			return {
				x: position.x - canvasPosition.left,
				y: position.y - canvasPosition.top
			};
		},
		
		setSize: function(w, h) {
			Element.prototype.setSize.apply(this, arguments);
			this.canvas.width = w;
			this.canvas.height = h;
			return this;
		},
		
		setPosition: function(l, t) {
			Element.prototype.setPosition.apply(this, arguments);
			$(this.canvas).css({
				position: 'absolute',
				left: l,
				top: t
			});
			return this;
		},
		
		getStage: function() {
			return this;
		}
	});
	return Layer;
});
