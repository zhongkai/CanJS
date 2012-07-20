require.config({
	baseUrl: "../src/",
    urlArgs: "v=" + (new Date()).getTime()
});
require(['Timer', 'Layer', 'element/Rect', 'element/Circle', 'element/RoundedRect', 'element/Text', 'fill/ImageFill', 'fill/Border', 'ui/Button'], 
	function(timer, Layer, Rect, Circle, RoundedRect, Text, ImageFill, Border, Button) {
	var Directions = {
		up: 0,
		right: 1,
		down: 2,
		left: 3,
		upLeft: 4,
		upRight:5,
		downLeft: 6,
		downRight: 7
	};
	
	var clipsRow = [Directions.down, Directions.left, Directions.right, Directions.up,
	Directions.downLeft, Directions.downRight, Directions.upLeft, Directions.upRight];
	
	var clipWidth = 70;
	var clipHeight = 124;
	var stageWidth = 600;
	var stageHeight = 450;
	
	var avatarX = 0;
	var avatarY = 0;
	var dir = Directions.down;
	var status = 0;
	var fill = null;
	
	var layer = new Layer(document.body, {
		width: stageWidth,
		height: stageHeight,
		left: 100,
		top: 100
	});
	
	$(layer.canvas).css('border', "3px solid rgba(0, 0, 0, .5)");
	
	var avatar = new Rect().setSize(clipWidth, clipHeight);
	
	layer.appendChild(avatar);
	
	var setClip = function() {
		if(!fill) {
			fill = new ImageFill('images/clips.png').setClip(status * clipWidth, clipHeight * clipsRow.indexOf(dir), clipWidth, clipHeight);
			avatar.setFill(fill);
		}
		else
			fill.setClip(status * clipWidth, clipHeight * clipsRow.indexOf(dir), clipWidth, clipHeight);
	};
	
	var setNextPosition = function() {
		if(dir == Directions.up || dir == Directions.upLeft || dir == Directions.upRight) {
			avatarY -= 4;
			if(avatarY < 0) avatarY += 4;
		}
		if(dir == Directions.down || dir == Directions.downLeft || dir == Directions.downRight) {
			avatarY += 4;
			if(avatarY > stageHeight - clipHeight) avatarY -= 4;
		}
		if(dir == Directions.left || dir == Directions.downLeft || dir == Directions.upLeft) {
			avatarX -= 4;
			if(avatarX < 0) avatarX += 4;
		}
		if(dir == Directions.right || dir == Directions.downRight || dir == Directions.upRight) {
			avatarX += 4;
			if(avatarX > stageWidth - clipWidth) avatarX -= 4;
		}
	};
	
	var setPosition = function(d) {
		if(dir !== d) {
			dir = d;
			status = 0;
		}
		else
			status = ++status % 4;
		setNextPosition();
		setClip();
		avatar.setPosition(avatarX, avatarY);
	};
	
	$(document).on('keydown', function(e) {
		var code = e.keyCode;
		
		if(code == 37) setPosition(Directions.left);
		if(code == 38) setPosition(Directions.up);
		if(code == 39) setPosition(Directions.right);
		if(code == 40) setPosition(Directions.down);
		
	});
	
	timer.active();
	
	setPosition(Directions.down);
});
