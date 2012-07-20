define(['Can', 'Updater', 'element/RoundedRect', 'fill/Border', 'element/Text'], function(can, updater, RoundedRect, Border, Text) {
	var ToggleButton = can.inherit(RoundedRect, {
		constructor: function() {
			config = config || {};
	
		    RoundedRect.call(this, config);

		    if(config.text) this.setText(config.text);
		    
		    this.init();
		    
		    this.__state = ToggleButton.State.UP;
		},

		init: function() {
			this.upstate = new RoundedRect().setFill('rgb(0,0,0,.3)').setSize(this.getSize());
		    this.upstate.text = new Text().setAlign('center').setFontFamily('宋体').setFontColor('#FFFFFF').setFontSize(13).setSize(this.getSize());;
		    this.upstate.appendChild(this.upstate.text);
		    this.downstate = new RoundedRect().setFill('rgb(255,0,0,.5)').setSize(this.getSize());;
		    this.downstate.text = new Text().setAlign('center').setFontFamily('宋体').setFontColor('#FFFFFF').setFontSize(13).setSize(this.getSize());;
		    this.downstate.appendChild(this.downstate.text);
		    this.appendChild(this.upstate);
		    this.appendChild(this.downstate);
		    
		    this.setBorder(new SBorder({
		    	color: 'rgb(0,0,0,.8)',
		    	width: 2
		    }));
		    
		    this.on('mousedown', function(event) {
		    	this.setState(this.getState() == ToggleButton.State.UP? ToggleButton.State.DOWN : ToggleButton.State.UP);
		    });
		    
		    this.on('mousemove', function(event) {
		    	this.getStage().canvas.style.cursor = 'pointer';
		    	//阻止冒泡
		    	event.stopPropagation();
		    });
		    
		    this.on('mouseout', function(event) {
		    	this.getStage().canvas.style.cursor = 'normal';
		    });
		    
		    this.setState(ToggleButton.State.UP);
		},
		
		getState: function() {
		    return this.__state;
		},

		setState: function(value) {
		    if (value == this.__state) return;
		
		    if (ToggleButton.State.DOWN == value) {
		    	this.upstate.hide(true);
		    	this.downstate.hide(false);
		    }
		    else {
		    	this.downstate.hide(true);
		    	this.upstate.hide(false);
		    }
		    this.__state = value;
		    if(this.getStage()) updater.register(this.getStage());
		    return this;
		},
		
		setSize: function() {
			var text = this.upstate.text;
			var lhpx = text.getLineHeight() * text.getFontSize();
			RoundedRect.prototype.setSize.apply(this, arguments);
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

	ToggleButton.State = {
		UP: 0,
		DOWN: 1
	};

	ToggleButton.Event = {
	    UP: 'up',
	    DOWN: 'down',
	    CLICK: 'click'
	};

	return ToggleButton;
});