require.config({
	baseUrl: "../src/",
    urlArgs: "v=" + (new Date()).getTime()
});
require(['Timer', 'Layer', 'element/Circle', 'element/Rect', 'element/RoundedRect', 'element/Text', 'fill/Border', 'ui/Button'], 
function(timer, Layer, Circle, Rect, RoundedRect, Text, Border, Button) {
	var layer = new Layer(document.body, {
		width: 600,
		height: 450,
		left: 100,
		top: 100
	});
	
	$(layer.canvas).css('border', "3px solid rgba(0, 0, 0, .5)");
	
	var level1 = new RoundedRect().setPosition(200, 200).
	setSize(200, 200).setAnchor(0, 0).setFill('rgba(255,0,0,0.5)');
	
	var level2 = new Rect().setSize(300, 300).setPosition(0, 0).
	setAnchor(0.5, 0.5).setFill('rgba(0,0,255,0.5)');
	
	var level3 = new Circle().setSize(150, 150).setPosition(0, 0).
	setAnchor(0.5, 0).setFill('rgba(0,255,0,0.5)');
	
	level2.appendChild(level3);
	
	level1.appendChild(level2);
	
	layer.appendChild(level1);
	
	timer.active();
});

