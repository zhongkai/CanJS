goog.provide('test.event');

goog.require('Stefan.Timer');
goog.require('Stefan.Layer');
goog.require('Stefan.Circle');
goog.require('Stefan.RoundedRect');
goog.require('Stefan.Text');
goog.require('Stefan.fill.Border');
goog.require('Stefan.ui.Button');

T.dom.ready(function() {
	var layer = new Stefan.Layer(document.body, {
		width: 600,
		height: 450,
		left: 100,
		top: 100
	});
	
	T.dom.setStyle(layer.canvas, 'border', "3px solid rgba(0, 0, 0, .5)");
	
	var level1 = new Stefan.RoundedRect().setSize(500,400).setFill('rgba(255,0,0,0.5)');
	
	var level2 = new Stefan.Rect().setSize(300, 300).setFill('rgba(0,0,255,0.5)');
	
	var level31 = new Stefan.Circle().setSize(200, 200).setFill('rgba(0,255,0,0.5)');
	var level32 = new Stefan.Circle().setSize(150, 150).setFill('rgba(255,255,0,0.5)');
	
	level2.appendChild(level31);
	level2.appendChild(level32);
	
	level1.appendChild(level2);
	
	layer.appendChild(level1);
	
	level32.on('mousedown', function(e) {
		console.info('level32-mousedown');
		e.preventDefault();
	});
	level32.on('click', function(e){
		console.info('level32-click'); 
		// e.stopAfter();
		// e.stopPropagation();
	});
	level31.on('click', function(){console.info('level31-click');});
	level2.on('click', function(){console.info('level2-click');});
	level1.on('click', function(){console.info('level1-click');});
	
	Stefan.Timer.active();
});

