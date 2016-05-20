angular.module('starter')
.factory('videoService', function(){
	return video = {
		play: function(video, thumbnail){
			$thumbnail = document.getElementById(thumbnail);
			$video = document.getElementById(video);
			$thumbnail.style.display = 'none';
			$video.style.display = 'block';
			$video.requestFullscreen;
			if ($video.requestFullscreen) {
			  $video.requestFullscreen();
			} else if ($video.mozRequestFullScreen) {
			  $video.mozRequestFullScreen();
			} else if ($video.webkitRequestFullscreen) {
			  $video.webkitRequestFullscreen();
			} 
			$video.play();
			this.checkVideoStatus($video, $thumbnail);
		},
		checkVideoStatus: function(video, thumbnail){
			video.addEventListener("ended", function(){
				thumbnail.style.display = 'block';
				video.style.display = 'none';
			}, true);
		}
	};

	return video;
});