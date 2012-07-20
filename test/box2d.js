goog.provide('test.box2d');


goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');


goog.require('box2d.World');
goog.require('Stefan.Timer');
goog.require('Stefan.Layer');
goog.require('Stefan.Circle');
goog.require('Stefan.Polygon');
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
	
	//向下的重力
	var gravity = new box2d.Vec2(0, 100);
	//设置世界范围
	var bounds = new box2d.AABB();
	bounds.minVertex.Set(-1000, -1000);
	bounds.maxVertex.Set(2000, 2000);
	var world = new box2d.World(bounds, gravity, false);
	
	var gradientFill = new Stefan.fill.Fill();
	
	gradientFill.render = function(context, element) {
		var grad = context.createLinearGradient(-15, -15, 15, 15);
		grad.addColorStop(0, 'rgba(255,0,0,1)');
		grad.addColorStop(1, 'rgba(0,255,0,1)');
		context.fillStyle = grad;
	};
	
	var circle = new Stefan.Circle().setSize(30, 30).setAnchor(.5, .5);
	var circle1 = new Stefan.Circle().setFill(gradientFill).setSize(30, 30).setAnchor(.5, .5);
	
	layer.appendChild(circle);   
	layer.appendChild(circle1);
	
	
	var cbodyDef = new box2d.BodyDef();
	cbodyDef.position.Set(200, 0);
	cbodyDef.angularDamping = .001;
	
	var circleDef = new box2d.CircleDef();
	circleDef.radius = 15;
	circleDef.density = 1;
	circleDef.restitution =.8;
	circleDef.friction = 1;
	
	var cbodyDef1 = new box2d.BodyDef();
	cbodyDef1.position.Set(400, 0);
	cbodyDef1.angularDamping = .001;
	
	var circleDef1 = new box2d.CircleDef();
	circleDef1.radius = 15;
	circleDef1.density = 1;
	circleDef1.restitution =.8;
	circleDef1.friction = 1;
	
	cbodyDef.AddShape(circleDef);
	cbodyDef1.AddShape(circleDef1);
	
	
	var cicleBody = world.CreateBody(cbodyDef);
	var cicleBody1 = world.CreateBody(cbodyDef1);
	
	var ground = new box2d.PolyDef;
	ground.restitution = .9
	ground.density = 0;
	ground.friction = 1;
	ground.SetVertices([[-100,-10],[100,-10],[100,10],[-100,10]]); 
	
	
	var ground1 = new box2d.PolyDef;
	ground1.restitution = .9
	ground1.density = 0;
	ground1.friction = 1;
	ground1.SetVertices([[100,-10],[300,-36],[300,10],[300,10]]); 
	
	var gbodyDef = new box2d.BodyDef;
	gbodyDef.position.Set(220, 300);
	gbodyDef.AddShape(ground);
	gbodyDef.AddShape(ground1);
	var ground_body = world.CreateBody(gbodyDef);
	
	var box = new Stefan.Rect().setFill('rgba(100,0,0)').setSize(200, 20).setAnchor(.5, .5);
	var box1 = new Stefan.Polygon().setFill('rgba(100,0,0)').setPoints(
		[{
			x: -100,
			y: -10
		},
		{
			x: 100,
			y: -36
		},
		{
			x: 100,
			y: 10
		},
		{
			x: -100,
			y: 10
		}]
	);
	layer.appendChild(box);
	layer.appendChild(box1);
	
	var time = 0;
	Stefan.Timer.register(function() {
		world.Step((new Date().valueOf() - time) / 1000, 3);
		time = new Date().valueOf();
		var pos = cicleBody.GetCenterPosition().clone();
		var pos1 = cicleBody1.GetCenterPosition().clone();
		var rot = cicleBody1.GetRotation();
		circle.setPosition(pos);
		circle1.setPosition(pos1);
		circle1.setRotation(-rot/Math.PI*180);
		var pos = ground_body.GetCenterPosition().clone();
		box.setPosition(pos);
		box1.setPosition({
			x: pos.x + 200,
			y: pos.y
		});
	});
	
	time = new Date().valueOf();
	Stefan.Timer.active();

});
