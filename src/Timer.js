define(['Can', 'Updater'], function(can, updater) {
	var Timer = function() {
		
		this.__active = false;
		
		this.__interval = 0;

		this.__time = 0;
		
		this.__lastTime = 0;
		
		this.__timeInter = null;
		
		this.__active = false;
		
		this.__callbackQueen = [];
		
	};

	$.extend(Timer.prototype, {
		/**
		 * 注册时间步进回调函数任务
		 * @param {Function} callback 回调函数
		 * @param {object} scope 回调函数的作用域
		 */
		register: function(callback, scope) {
			this.__callbackQueen.push([callback, scope || this]);
		},
		
		/**
		 * 所有任务在这里执行（栈）
		 * @private
		 */
		__step: function() {
			var queen = this.__callbackQueen;
			var i = queen.length;
			while (--i >= 0) {
				queen[i][0].call(queen[i][1], this.__interval);
			}
		},
		
		/**
		 * Webkit内核的帧回调
		 * @private
		 * @param {boolean} once 是否只执行一次
		 */
		__webkitCallback: function(once) {
			if(!this.__time) this.__time = new Date().valueOf();
		    this.__interval = this.__time - this.__lastTime;
		    this.__step();
		    this.__lastTime = this.__time;
		    var __this = this;
		    if(once) return;
		    this.__webkitCallbackID = window.webkitRequestAnimationFrame(function() {
				__this.__webkitCallback.call(__this);
			});
		},
		
		/**
		 * Gecko内核的帧事件回调
		 * @private
		 * @param {object} event 帧渲染事件
		 * @param {boolean} once 是否只执行一次
		 */
		__mozCallback: function(event, once) {
			this.__time = event.timeStamp;
			this.__interval = this.__time - this.__lastTime;
			this.__step();
			this.__lastTime = this.__time;
			if(once) return;
			window.mozRequestAnimationFrame();
		},
		
		/**
		 * 激活
		 */
		active: function() {
			if(this.__active) return;
			
			if(window.webkitRequestAnimationFrame) {
				var __this = this;
				this.__webkitCallbackID = window.webkitRequestAnimationFrame(function() {
					__this.__webkitCallback.call(__this);
				});
			}
			else if(window.mozRequestAnimationFrame) {
				this.__mozBindCallback = can.bind(this.__mozCallback, this);
				window.addEventListener("MozBeforePaint", this.__mozBindCallback, false);
				window.mozRequestAnimationFrame();
			}
		    else {
		    	var __this = this;
		        this.__timeInter = setInterval(function() {
		        	__this.__step.call(__this);
		        }, 1000 / 30); //FPS = 30
		    }
		    this.__active = true;
		},
		
		/**
		 * 停止
		 * @param {boolean} rightNow 是否立即停止（否则在下一帧停止）
		 */
		disable: function(rightNow) {
		    if (!this.__active) return;
			if(window.webkitCancelRequestAnimationFrame) {
				window.webkitCancelRequestAnimationFrame(this.__webkitCallbackID);
				//一般情况下需要再跑一帧，做善后处理
				if(!rightNow) this.__webkitCallback(true);
			}
			else if(window.mozRequestAnimationFrame) {
				window.removeEventListener("MozBeforePaint", this.__mozBindCallback, false);
				//一般情况下需要再跑一帧，做善后处理
				this.__mozCallback({
					timeStamp: new Date().valueOf()
				}, true);
			}
		    else {
		        clearInterval(this.__timeInter);
		        this.__step();
		    }
		    this.__active = false;
		}
	});
	
	timer = new Timer(true);
	
	timer.register(updater.update, updater);

	return timer;
});
