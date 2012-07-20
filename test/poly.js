goog.provide('test.event');

goog.require('Stefan.Timer');
goog.require('Stefan.Layer');
goog.require('Stefan.Polygon');
goog.require('Stefan.fill.Border');

T.dom.ready(function() {
	var layer = new Stefan.Layer(document.body, {
		width: 600,
		height: 450,
		left: 100,
		top: 100
	});
	
	T.dom.setStyle(layer.canvas, 'border', "3px solid rgba(0, 0, 0, .5)");
	
	var poly = new Stefan.Polygon().setPoints([{
		x: -50,
		y: -20
	},{
		x: -20,
		y: -20
	},{
		x: 180,
		y: 60
	},{
		x: -20,
		y: 150
	}]).setPosition({
		x: 200,
		y: 150
	}).setFill('rgba(255,0,0,.5)').setBorder(new Stefan.fill.Border({
		color: '#00ff00',
		width: 5
	}));
	
	var i = 1;
	poly.on('click', function() {
		poly.setRotation(10 * i++);
	});
	
	layer.appendChild(poly);
	
	Stefan.Timer.active();
});

