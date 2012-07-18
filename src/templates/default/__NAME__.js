//项目命名空间
goog.provide('{__NAME__}');

//可以自己调整
goog.require('Stefan.Timer');
goog.require('Stefan.Circle');
goog.require('Stefan.RoundedRect');
goog.require('Stefan.Text');
goog.require('Stefan.fill.Border');
goog.require('Stefan.ui.Button');


//开始
{__NAME__}.start = function(){ 
	this.schedule();
	this.resume();
};

//设定帧计划
{__NAME__}.schedule = function(){
	Stefan.Timer.register(this.step);
};

//继续
{__NAME__}.resume = function(){
	Stefan.Timer.active();
};

//停止/暂停
{__NAME__}.stop = function() {
	Stefan.Timer.disable();
};

//自定义步进方法
{__NAME__}.step = function() {
	//添加逻辑
};