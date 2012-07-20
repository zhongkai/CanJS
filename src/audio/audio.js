define(function() {
	var Audio = function(path, attr) {
		attr = attr || {};
	
		this.__path = path;
		
	    this.__loaded = false;

	    this.__playing = false;

	    this.__audioEl = document.createElement('audio');
	    this.__audioEl.preload = attr.preload || false;
	    this.__audioEl.loop = attr.loop || false;

	    this.__audioEl.src = path;
	    this.__audioEl.load();
		
		var __this = this;
	    this.__loadInterval = setInterval(function() {
	    	__this.__loading();
	    }, 25);

	    this.loaded_ = false;
	};

	$.extend(Audio.prototype, {
		__loading: function() {
		    if (this.__audioEl.readyState > 2) {
		        this.__loaded = true;
		        clearTimeout(this.__loadInterval);
		        this.__loadInterval = null;
		    }
		    if (this.__audioEl.error) {
		    	clearTimeout(this.__loadInterval);
		    	this.__loadInterval = null;
		    }
		},
		
		isLoaded: function() {
		    return this.__loaded;
		},
		
		isPlaying: function() {
		    return this.__playing;
		},
		
		play: function() {
			if(this.__loadInterval) {
				var catchLoadingFun = this.__loading;
				this.__loading = function() {
					catchLoadingFun.call(this);
					this.play();
				};
				return this;
			}
			
		    if (this.__loaded && !this.__playing) {
		        this.__audioEl.play();
		        this.__playing = true;
		    }
		    
		    return this;
		},
		
		pause: function() {
		    if (this.__playing) {
		        this.__audioEl.pause();
		        this.__playing = false;
		    }
		    
		    return this;
		}
	});

	return Audio;
});
