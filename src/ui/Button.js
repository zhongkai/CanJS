goog.provide('Stefan.ui.Button');

goog.require('Stefan.RoundedRect');
goog.require('Stefan.fill.Border');
goog.require('Stefan.Text');

Stefan.ui.Button = T.lang.createClass(function(config) {
	config = config || {};
	
    Stefan.RoundedRect.call(this, config);

    if(config.text) this.setText(config.text);
    
    this.init();
    
    this.__state = Stefan.ui.Button.State.UP;
    
}, {
	superClass: Stefan.RoundedRect
});

Stefan.ui.Button.State = {
	UP: 0,
	DOWN: 1
};

Stefan.ui.Button.Event = {
    UP: 'up',
    DOWN: 'down',
    CLICK: 'click'
};

Stefan.ui.Button.extend({
	init: function() {
		this.upstate = new Stefan.RoundedRect().setFill('rgb(0,0,0,.3)').setSize(this.getSize());
	    this.upstate.text = new Stefan.Text().setAlign('center').setFontFamily('宋体').setFontColor('#FFFFFF').setFontSize(13).setSize(this.getSize());;
	    this.upstate.appendChild(this.upstate.text);
	    this.downstate = new Stefan.RoundedRect().setFill('rgb(255,0,0,.5)').setSize(this.getSize());;
	    this.downstate.text = new Stefan.Text().setAlign('center').setFontFamily('宋体').setFontColor('#FFFFFF').setFontSize(13).setSize(this.getSize());;
	    this.downstate.appendChild(this.downstate.text);
	    this.appendChild(this.upstate);
	    this.appendChild(this.downstate);
	    
	    this.setBorder(new Stefan.fill.Border({
	    	color: 'rgb(0,0,0,.8)',
	    	width: 2
	    }));
	    
	    this.on('mousedown', function(event) {
	    	this.setState(Stefan.ui.Button.State.DOWN);
	    });
	    
	    this.on('mouseup', function(event) {
	    	this.setState(Stefan.ui.Button.State.UP);
	    });
	    
	    this.on('mousemove', function(event) {
	    	this.getStage().canvas.style.cursor = 'pointer';
	    	//阻止冒泡
	    	event.stopPropagation();
	    });
	    
	    this.on('mouseout', function(event) {
	    	this.getStage().canvas.style.cursor = 'normal';
	    });
	    
	    this.setState(Stefan.ui.Button.State.UP);
	},
	
	getState: function() {
	    return this.__state;
	},

	setState: function(value) {
	    if (value == this.__state) return;
	
	    if (Stefan.ui.Button.State.DOWN == value) {
	    	this.upstate.hide(true);
	    	this.downstate.hide(false);
	    }
	    else {
	    	this.downstate.hide(true);
	    	this.upstate.hide(false);
	    }
	    this.__state = value;
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	setSize: function() {
		var text = this.upstate.text;
		var lhpx = text.getLineHeight() * text.getFontSize();
		Stefan.RoundedRect.prototype.setSize.apply(this, arguments);
		this.upstate.setSize(this.getSize());
		this.downstate.setSize(this.getSize());
		this.upstate.text.setSize(this.getSize().width, lhpx);
		this.downstate.text.setSize(this.getSize().width, lhpx);
		
		this.upstate.text.setPosition(0, (this.__size.height - text.getFontSize()) / 2);
		this.downstate.text.setPosition(0, (this.__size.height - text.getFontSize()) / 2);
		
		return this;
	},
	
	setText: function(txt) {
	    this.downstate.text.setText(txt);
	    this.upstate.text.setText(txt);
	    return this;
	}
});