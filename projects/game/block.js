define(['element/Rect', 'fill/Border'], function(Rect, Border) {
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

	var Block = function(world, layer) {
		this.cbodyPool = {};
		this.pbodyPool = {};
		this.handleDraw(layer, world);
	};

	Block.prototype.handleDraw = function(layer, world) {
		var __drawing = false,
			__startPos = null,
			me = this,
			cbody, pbody,
			timeStamp,
			cacheTotalWater;

		layer.on('mousedown', function(e) {
			__drawing = true;
			__startPos = e.position;

			cbody = me.can(layer);

			cbody.setSize(2, 2);

			cbody.setPosition(__startPos);

			timeStamp = new Date().valueOf();

			cacheTotalWater = Global.currentWater;

			me.cbodyPool[timeStamp] = cbody;
		});


		layer.on('mousemove', function(e) {
			if(!__drawing || !me.cbodyPool[timeStamp] || !__startPos) return;
			var x = e.position.x - __startPos.x;
			var y = e.position.y - __startPos.y;
			var dis = Math.sqrt(x * x + y * y);

			if(cacheTotalWater - dis >= 0) {
				Global.setTotalWater(cacheTotalWater - dis);
				console.info(cacheTotalWater - dis);
			}
			else {
				Global.setTotalWater(0);
				return;
			}
			

			cbody.setSize(4, dis);
			cbody.setRotation(-Math.acos(y / dis)/Math.PI*(x > 0 ? -180 : 180));
		});

		layer.on('mouseup', function(e) {
			if(!__drawing || !me.cbodyPool[timeStamp]  || !__startPos) return;
			var x = e.position.x - __startPos.x;
			var y = e.position.y - __startPos.y;
			var dis = Math.sqrt(x * x + y * y);
			var rdis = dis;

			if(cacheTotalWater - dis >= 0) { 
				Global.setTotalWater(cacheTotalWater - dis);
			}
			else {
				Global.setTotalWater(0);
				dis = cacheTotalWater;
			}

			cbody.setSize(4, dis);
			cbody.setRotation(-Math.acos(y / rdis)/Math.PI*(x > 0 ? -180 : 180));

			var endPosition = {};

			if(rdis == dis) {
				endPosition = e.position;
			}
			else {
				endPosition.x = (e.position.x - __startPos.x) * dis / rdis;
				endPosition.y = (e.position.y - __startPos.y) * dis / rdis;
			}

			pbody = me.physic(__startPos, endPosition, world);

			me.pbodyPool[timeStamp] = pbody;
			

			(function(timeStamp) {
				setTimeout(function() {
					layer.removeChild(me.cbodyPool[timeStamp] );
					world.DestroyBody(me.pbodyPool[timeStamp] );
					delete me.cbodyPool[timeStamp];
					delete me.pbodyPool[timeStamp];
				}, 3000);
			})(timeStamp);
			
			__startPos = null;
			__drawing = false;

		});
	};

	Block.prototype.physic = function(sp, ep, world) {

		var blockDef = new b2BodyDef;
		blockDef.type = b2Body.b2_staticBody;
		
		var blockFix = new b2FixtureDef();
		blockFix.density = 1.0;
		blockFix.restitution = .5;
		blockFix.friction = 0.5;

		var blockShape = new b2PolygonShape;

		blockFix.shape = blockShape;

		var ex = ep.x, ey = ep.y, sx = sp.x, sy = sp.y;

		if(ep.x < sp.x) {
			sx = ep.x;
			sy = ep.y;
			ex = sp.x;
			ey = sp.y;
		}

		blockFix.shape.SetAsArray([
			new b2Vec2(sx , sy),
			new b2Vec2(ex, ey),
			new b2Vec2(ex , ey + 1),
			new b2Vec2(sx, sy + 1)
		]);

		console.info([
			new b2Vec2(sx + 1 , sy - 1),
			new b2Vec2(ex + 1 , ey - 1),
			new b2Vec2(ex - 1 , ey + 1),
			new b2Vec2(sx - 1 , sy + 1)
		]);

		var blockBody = world.CreateBody(blockDef);
		blockBody.CreateFixture(blockFix);

		return blockBody;
	};

	Block.prototype.can = function(layer) {
		var rect = new Rect().setAnchor(0, 0);

		layer.appendChild(rect);

		return rect;
	};

	return Block;
});