require.config({
	baseUrl: "../src/",
    urlArgs: "v=" + (new Date()).getTime()
});


require(['Timer', 'Layer', 'element/Rect', 'element/Circle', 'element/Polygon', 'element/RoundedRect', 'element/Text', 'fill/Fill', 'fill/Border', 'ui/Button'], 
function(timer, Layer, Rect, Circle, Polygon, RoundedRect, Text, Fill, Border, Button) {
	var   b2Vec2 = Box2D.Common.Math.b2Vec2
		, b2AABB = Box2D.Collision.b2AABB
		, b2BodyDef = Box2D.Dynamics.b2BodyDef
		, b2Body = Box2D.Dynamics.b2Body
		, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
		, b2Fixture = Box2D.Dynamics.b2Fixture
		, b2World = Box2D.Dynamics.b2World
		, b2MassData = Box2D.Collision.Shapes.b2MassData
		, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
		, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
		, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
		, b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
		, b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

	$(function() {
		var layer = new Layer(document.body, {
			width: 600,
			height: 450,
			left: 100,
			top: 100
		});
		
		$(layer.canvas).css('border', "3px solid rgba(0, 0, 0, .5)");
		
		//向下的重力
		var gravity = new Box2D.Common.Math.b2Vec2(0, 100);
		//设置世界范围
		var bounds = new Box2D.Collision.b2AABB();
		bounds.lowerBound.Set(-1000, -1000);
		bounds.upperBound.Set(2000, 2000);
		var world = new Box2D.Dynamics.b2World(bounds, gravity, false);
		
		var gradientFill = new Fill();
		
		gradientFill.render = function(context, element) {
			var grad = context.createLinearGradient(-15, -15, 15, 15);
			grad.addColorStop(0, 'rgba(255,0,0,1)');
			grad.addColorStop(1, 'rgba(0,255,0,1)');
			context.fillStyle = grad;
		};
		
		var circle = new Circle().setSize(30, 30).setAnchor(.5, .5);
		var circle1 = new Circle().setFill(gradientFill).setSize(30, 30).setAnchor(.5, .5);
		
		layer.appendChild(circle);   
		layer.appendChild(circle1);
		
		
		var cbodyDef = new b2BodyDef();
		cbodyDef.position.Set(200, 100);
		cbodyDef.angularDamping = .001;

		var circleShape = new b2CircleShape();
		circleShape.radius = 15;

		var circleFix = new b2FixtureDef;
		circleFix.density = 1;
		circleFix.restitution =.8;
		circleFix.friction = 1;
		circleFix.shape = circleShape;
		
		var cbodyDef1 = new b2BodyDef();
		cbodyDef1.position.Set(400, 100);
		cbodyDef1.angularDamping = .001;


		var circleDef1 = new Box2D.Collision.Shapes.b2CircleShape();
		circleDef1.radius = 15;
		
		var circleFix1 = new b2FixtureDef;
		circleFix1.density = 1;
		circleFix1.restitution =.8;
		circleFix1.friction = 1;
		circleFix1.shape = circleDef1;
		
		var cicleBody = world.CreateBody(cbodyDef);
		cicleBody.CreateFixture(circleFix);
		var cicleBody1 = world.CreateBody(cbodyDef1);
		cicleBody1.CreateFixture(circleFix1);

		var ground = new b2BodyDef;

		var groundFix = new b2FixtureDef();
		groundFix.restitution = .9
		groundFix.density = 0;
		groundFix.friction = 1;

		var groundShape = new b2PolygonShape;
		groundFix.shape = groundShape;
		// groundFix.shape.SetAsVector([[-100,-10],[100,-10],[100,10],[-100,10]]); 
		groundFix.shape.SetAsBox(1, 1);
		

		var ground1 = new b2BodyDef;
		
		var groundFix1 = new b2FixtureDef();
		groundFix1.restitution = .9
		groundFix1.density = 0;
		groundFix1.friction = 1;

		var groundShape1 = new b2PolygonShape;
		// groundShape1.SetAsVector([[100,-10],[300,-36],[300,10],[300,10]]);
		groundShape1.SetAsBox(1, 1); 

		groundFix1.shape = groundShape1;



		var groundBody = world.CreateBody(ground);
		groundBody.CreateFixture(groundFix);
		var groundBody1 = world.CreateBody(ground1);
		groundBody1.CreateFixture(groundFix1);
		
		var box = new Rect().setFill('rgba(100,0,0)').setSize(200, 20).setAnchor(.5, .5);
		var box1 = new Polygon().setFill('rgba(100,0,0)').setPoints(
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
		timer.register(function() {
			world.Step((new Date().valueOf() - time) / 1000, 3);
			time = new Date().valueOf();
			var pos = cicleBody.GetPosition();
			var pos1 = cicleBody1.GetPosition();
			var rot = cicleBody1.GetAngle();
			circle.setPosition(pos);
			circle1.setPosition(pos1);
			circle1.setRotation(-rot/Math.PI*180);
			var pos = groundBody.GetPosition();
			box.setPosition(pos);
			box1.setPosition({
				x: pos.x + 200,
				y: pos.y
			});
		});
		
		time = new Date().valueOf();
		timer.active();
	});
});
