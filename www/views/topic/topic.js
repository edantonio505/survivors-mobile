angular.module('starter')
.controller('TopicCtrl', function($scope, $http, SNURL, $stateParams, InspireService, videoService, $sce, AuthService){
	var authEmail = localStorage.getItem('user.email');
	$scope.topic = {
		pic_thumbnail: ''
	};
	$scope.video_visible = false;

	$http.get(SNURL+'get_topic/'+$stateParams.id+'/'+authEmail)
	.success(function(response){
		$scope.topic = response;
		$scope.video = response.video;
		if($scope.video != '')
		{
			$scope.video_visible = true;
		}
	});

	$scope.beInspiredBy = function(topic_id){
		InspireService.inspiredClass(topic_id);
	};

	$scope.playVideo = function(video, thumbnail){
		
		var thumbnail = document.getElementsByClassName(thumbnail);
		var $thumbnail = thumbnail[thumbnail.length - 1];
		$thumbnail.style.display = 'none';
		var video = document.getElementsByClassName(video);
		var $videoElement = video[video.length - 1];
		$videoElement.style.display = 'block';
		$video = $videoElement.childNodes[1].childNodes[0];
		$video.requestFullscreen;
		if ($video.requestFullscreen) {
		  $video.requestFullscreen();
		} else if ($video.mozRequestFullScreen) {
		  $video.mozRequestFullScreen();
		} else if ($video.webkitRequestFullscreen) {
		  $video.webkitRequestFullscreen();
		} 
		$video.play();
		$scope.checkVideoStatus($video, $thumbnail);
	};

	$scope.checkVideoStatus = function(video, thumbnail){
		video.addEventListener("ended", function(){
			thumbnail.style.display = 'block';
			video.style.display = 'none';
		}, true);
	};

	AuthService.status();

});