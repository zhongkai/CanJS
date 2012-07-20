require.config({
	baseUrl: "../src/",
    urlArgs: "v=" + (new Date()).getTime()
});
require(['audio/Audio'], function(Audio) {

	var audio = new Audio('audio.mp3').play();
	
	setTimeout(function() {
		audio.pause();
	}, 10000);
});

