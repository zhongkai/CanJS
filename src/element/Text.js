/**
 * @author stefan
 * @fileOverview 基础文字类
 */

goog.provide('Stefan.Text');

goog.require('Stefan');
goog.require('Stefan.Rect');

/**
 * 文字类
 * @constructor
 * @augments Stefan.Rect
 */
Stefan.Text = T.lang.createClass(function(config) {
	Stefan.Rect.call(this, config);
	this.__ext = '';
	this.__padding = [0, 0 ,0 ,0];
	//字高的倍数
	this.__lineHeight = 1.2;
	this.__fontColor = '#000000';
	this.__fontWeight = 300;
	this.__fontSize = 14;
	this.__align = 'left';
}, {
	superClass: Stefan.Rect
}).extend({
	
	/**
	 * 返回文字内容
	 * @returns {string} 文字内容
	 */
	getText: function() {
	    return this.__text;
	},
	
	/**
	 * 设置文字内容
	 * @param {string} 文字内容
	 * @returns {Stefan.Text} 返回自身
	 */
	setText: function(text) {
	    this.__text = '' + text;
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 返回文字字体
	 * @returns {string} 字体
	 */
	getFontFamily: function() {
	    return this.__fontFamily;
	},
	
	/**
	 * 设置文字字体
	 * @param {string} 字体
	 * @returns {Stefan.Text} 返回自身
	 * 
	 */
	setFontFamily: function(value) {
	    this.__fontFamily = value;
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 设置文字加粗程度
	 * @param {number} 数字
	 * @returns {Stefan.Text} 返回自身
	 */
	setFontWeight: function(value) {
	    this.__fontWeight = value;
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 返回文字加粗程度
	 * @returns {number} 数字
	 */
	getFontWeight: function() {
	    return this.__fontWeight;
	},
	
	/**
	 * 返回字体大小
	 * @returns {number} 数字
	 */
	getFontSize: function() {
	    return this.__fontSize;
	},
	
	/**
	 * 设置字体大小
	 * @param {number} 数字
	 * @returns {Stefan.Text} 返回自身
	 */
	setFontSize: function(value) {
	    this.__fontSize = value;
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 返回字体颜色
	 * @returns {string} 字体颜色
	 */
	getFontColor: function() {
	    return this.__fontColor;
	},
	
	/**
	 * 设置字体颜色
	 * @param {string} value 字体颜色
	 * @returns {Stefan.Text} 返回自身
	 */
	setFontColor: function(value) {
	    this.__fontColor = value;
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 返回文字Padding
	 * @returns {array} top/right/bottom/left数组
	 */
	getPadding: function() {
	    return this.__padding;
	},
	
	/**
	 * 设置文字Padding
	 * @param {number} top
	 * @param {number} [right]
	 * @param {number} [bottom]
	 * @param {number} [left]
	 * @returns {Stefan.Text} 返回自身
	 */
	setPadding: function(top, right, bottom, left) {
	    var tmp = [top, top, top, top];
	    if (right !== undefined) {
	        tmp[1] = tmp[3] = right;
	    }
	    if (bottom !== undefined) {
	        tmp[2] = bottom;
	    }
	    if (left !== undefined) {
	        tmp[3] = left;
	    }
	    this.__padding = tmp;
	
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 返回文字行高（倍数）
	 * @returns {number} 倍数
	 */
	getLineHeight: function() {
	    return this.__lineHeight;
	},
	
	/**
	 * 设置文字行高（倍数）
	 * @param {number} 倍数
	 * @returns {Stefan.Text} 返回自身
	 */
	setLineHeight: function(value) {
	    this.__lineHeight = value;
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 返回文字排列方式
	 * @returns {string} left/right/center
	 */
	getAlign: function() {
	    return this.__align;
	},
	
	/**
	 * 设置文字排列方式
	 * @param {string} left/right/center
	 * @returns {Stefan.Text} 返回自身
	 */
	setAlign: function(value) {
	    this.__align = value;
	    if(this.getStage()) Stefan.Updater.register(this.getStage());
	    return this;
	},
	
	/**
	 * 返回文字宽度
	 * @returns {number} 文字宽度
	 */
	getTextWidth: function(text) {
		return T.string.getByteLength(text) * this.__fontSize / 2;
	},
	
	/**
	 * 获得文字对应的行
	 * @private
	 * @param {string} text 字符串
	 * @param {number} width 字符显示区域的宽度
	 * @returns {array} 切割后的行
	 */
	__getLines: function(text, width) {
		var textWidth = this.getTextWidth(text);
		var lines = [];
		if(textWidth <= width) {
			lines.push(text);
		}
		else {
			var startLen = 0;
			for(var i = 0; i < text.length; i++) {
				var curLen = this.getTextWidth(text.substring(startLen, i));
				if(curLen && curLen > width) {
					lines.push(text.substring(startLen, i));
					startLen = i;
				}
			}
			lines.push(text.substr(startLen));
		}
		return lines;
	},
	
	render: function(context) {
	    // Stefan.Rect.prototype.render.call(this, context);
	
	    var bounds = this.getSelfBounds(),
	        width = bounds.right - bounds.left - this.__padding[1] - this.__padding[3];
	    
	    var borderWidth = this.getBorder() ? this.getBorder().getWidth() : 0;
	
	    context.save();
	    
	    var align = this.getAlign();
	    if (align == 'left') {
	        context.translate(bounds.left + this.__padding[3] + borderWidth,
	            bounds.top + this.__padding[0] + borderWidth);
	    }
	    else if (align == 'right') {
	        context.translate(bounds.right - this.__padding[1] - borderWidth,
	            bounds.top + this.__padding[0] + borderWidth);
	    }
	    else if (align == 'center') {
	        context.translate((bounds.left + this.__padding[3] + bounds.right - this.__padding[1]) * .5,
	            bounds.top + this.__padding[0] + borderWidth);
	    }
	
	    var lineHeight = this.getLineHeight();
	
	    context.fillStyle = this.getFontColor();
	    context.font = this.getFontWeight() + ' ' + this.getFontSize() + 'px/' + lineHeight + ' ' + this.getFontFamily();
	    context.textAlign = align;
	    context.textBaseline = 'top';
		
		var subText = this.__text.split('\n');
		
		var lines = [];
		
	 	for (var i = 0; i < subText.length; i++) {
	 		lines = lines.concat(this.__getLines(subText[i], width));
	 	}	
	 	
        var lhpx = lineHeight * this.getFontSize();
        for (var i = 0; i < lines.length; i++) {
        	// lhpx = T.browser.isWebkit ? Math.floor(lhpx) : Math.round(lhpx);
            context.fillText(lines[i], 0, lhpx * i);
        }
	
	
	    context.restore();
	}
});