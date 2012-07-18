/**
 * @author stefan
 * @fileOverview Layer，Canvas层
 */
goog.provide('Stefan.Layer');

goog.require('Stefan');
goog.require('Stefan.Element');

/**
 * 层
 * @constructor
 * @augments Stefan.Element
 */
Stefan.Layer = T.lang.createClass(function(dom, config) {
	Stefan.Element.call(this, config);
	if(!dom) return;
	var layerCanvas = this.canvas = document.createElement("CANVAS");
	layerCanvas.setAttribute("id", this.id);
	if(T.lang.isString(dom)) dom = T.g(dom);
	dom.appendChild(layerCanvas);
	
	this.parentDom = dom;
	
	//未指定大小，填充父容器
	this.setSize(config.width || dom.clientWidth, config.height || dom.clientHeight);
	
	if(config.left !== undefined && config.top !== undefined)this.setPosition(config.left, config.top);
	
	Stefan.Updater.registerLayer(this.id);
}, {
	superClass: Stefan.Element
}).extend({
	screenToSelf: function(position) {
		var canvasPosition = T.dom.getPosition(this.canvas);
		return {
			x: position.x - canvasPosition.left,
			y: position.y - canvasPosition.top
		};
	},
	
	setSize: function(w, h) {
		Stefan.Element.prototype.setSize.apply(this, arguments);
		this.canvas.width = w;
		this.canvas.height = h;
		return this;
	},
	
	setPosition: function(l, t) {
		Stefan.Element.prototype.setPosition.apply(this, arguments);
		T.dom.setStyles(this.canvas, {
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
