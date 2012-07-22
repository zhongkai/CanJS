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
		this.type = Math.floor(Math.random()*2);
		this.world = world;
		this.layer = layer;
		this.cbody = this.can(layer);
		this.cbody.setPosition(x, y);
		this.count = 1;
		this.dead = false;
	};

	Toy.prototype.drop = function() {
		var p = this.cbody.getPosition();
		this.pbody = this.physic(p.x, p.y);
		this.bind();
	}

	Toy.prototype.can = function(layer) {
		var circle = new Circle().setSize(100, 100).setAnchor(.5, .5).setFill('images/bubble.png');
		layer.appendChild(circle);
		this.inner = new Circle().setSize(64, 64).setAnchor(.5, .5).setFill(this.type ? 'images/redBall/redBall0001.png' : 'images/purpleBall/purpleBall0001.png');
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
			if(me.dead) return;
			var pos = me.pbody.GetPosition(),
				rot = me.pbody.GetAngle();

			me.cbody.setPosition(pos);
			me.inner.setRotation(-rot/Math.PI*180);
			if(me.count == 36) me.count = 1;
			me.inner.setFill((me.type ? 'images/redBall/redBall00' : 'images/purpleBall/purpleBall00') + (((me.count % 36) + '').length > 1 ? '' : '0') + me.count ++ % 36 + '.png');
			
			var pt = me.positionTest();

			if(pt > 0) {
				var scoreBody = $('<div></div>');
				scoreBody.css({
					'-webkit-transition': 'all 1s ease-out',
					'position': 'absolute',
					'left': parseInt($(me.layer.canvas).css('left')) + pos.x,
					'top': parseInt($(me.layer.canvas).css('top')) + pos.y - 100,
					'opacity': .5,
					'z-index': 2,
					'background': 'url(images/plusOne.png) no-repeat 0 0',
					'width': 180,
					'height': 180,
					'-webkit-transform': 'scale(.8)'
				});
				$('body').append(scoreBody);
				setTimeout(function() {
					scoreBody.css({
						'position': 'absolute',
						'left': parseInt($(me.layer.canvas).css('left')) + 400,
						'top': parseInt($(me.layer.canvas).css('top')) + 50,
						'opacity': 1,
						'-webkit-transform': 'scale(.2)'
					});
					setTimeout(function() {
						scoreBody.remove();
						Global.setScore(++Global.score);
					}, 1050);
				});
			}

			if(pt < 0) {
				var score = Global.score - 2;
				if(score <= 0) alert('你失败了！');
				Global.score = score;
				Global.setScore(score);
			}

			if(pt !== 0) {
				me.layer.removeChild(me.cbody);
				me.world.DestroyBody(me.pbody);
				me.dead = true;
			}
		});
	};

	Toy.prototype.positionTest = function() {
		var pp = this.pbody.GetPosition();
		var cp = this.cbody.getPosition();

		var penp = Global.pen.getPosition();

		if(Math.sqrt((cp.x - penp.x) * (cp.x - penp.x) + (cp.y - penp.y) * (cp.y - penp.y)) < 60){
			Global.pen.remove();
			Global.setTotalWater(Math.min(Global.WATEROFFSET + Global.currentWater, Global.totalWater));
		}

		if(pp.x < 0 || pp.x > Global.width * Global.scale) {
			return -1;
		}
		if(pp.y > 960) {
			if((pp.x < 320 && this.type) || (pp.x > 320 && !this.type))
				return 1;
			else
				return -1;
		}
		return 0;
	};

	return Toy;
});