define(['element/Circle'], function(Circle) {
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

	var Toy = function(world, layer, x, y) {
		this.world = world;
		this.cbody = this.can(layer);
		this.cbody.setPosition(x, y);
		this.count = 1;
	};

	Toy.prototype.drop = function() {
		var p = this.cbody.getPosition();
		this.pbody = this.physic(p.x, p.y);
		this.bind();
	}

	Toy.prototype.can = function(layer) {
		var circle = new Circle().setSize(100, 100).setAnchor(.5, .5).setFill('images/bubble.png');
		layer.appendChild(circle);
		this.inner = new Circle().setSize(64, 64).setAnchor(.5, .5).setFill('images/redBall/redBall0001.png');
		circle.appendChild(this.inner);
		return circle;
	};

	Toy.prototype.physic = function(x, y) {
		var cbodyDef = new b2BodyDef();
		cbodyDef.type = b2Body.b2_dynamicBody;
		cbodyDef.position.Set(x, y);

		var circleFix = new b2FixtureDef;
		circleFix.density = 8.0;
		circleFix.restitution = .5;
		circleFix.friction = 0.5;
		console.info(circleFix);
		circleFix.shape = new b2CircleShape(35); 

		var cicleBody = this.world.CreateBody(cbodyDef);
		cicleBody.CreateFixture(circleFix);

		return cicleBody;
	};

	Toy.prototype.bind = function() {
		var me = this;
		timer.register(function() {
			var pos = me.pbody.GetPosition(),
				rot = me.pbody.GetAngle();

			me.cbody.setPosition(pos);
			me.inner.setRotation(-rot/Math.PI*180);
			if(me.count == 36) me.count = 1;
			me.inner.setFill('images/redBall/redBall00' + (((me.count % 36) + '').length > 1 ? '' : '0') + me.count ++ % 36 + '.png');
		});
	};

	Toy.prototype.positionTest = function() {
		var pp = this.pbody.GetPostion();
		if(pp.x < 0 || pp.x > Global.width * Global.scale) {
			return false;
		}
	};

	return Toy;
});