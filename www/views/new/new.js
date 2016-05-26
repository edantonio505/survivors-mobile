angular.module('starter')
.controller('NewCtrl', function($scope, $http, SNURL, $cordovaFileTransfer, $ionicPopup, $ionicLoading, $timeout, $state, $cordovaCamera, $cordovaCapture, $ionicHistory){

	var email = localStorage.getItem('user.email');

	$http.get(SNURL+'create')
	.success(function(response){
		$scope.tags = response.tags;
		$scope.posts = response.topicTitle;
	});

	$scope.video = '';

	
	$scope.captureVideo = function() {
	    var options = { limit: 3, duration: 15 };

	    $scope.video = '';
	   	$cordovaCapture.captureVideo(options).then(function(videoData) {
	     	$scope.video = videoData[0].fullPath;
	    }, function(err) {
	      $scope.err = err;
	    });
	}
	


	$scope.takePicture = function(sourceType){
		var options = {
	      destinationType: Camera.DestinationType.FILE_URI,
	      sourceType: sourceType,
	      correctOrientation:true
	    };

	    $cordovaCamera.getPicture(options).then(function(imageURI) {
	      $scope.picture = imageURI;
	    }, function(err) {
	      $scope.err = err;
	    });
	};

	$scope.cancel = function(){
		$scope.cleanForm();
		$scope.data = undefined;
		$scope.err = undefined;
	};


	$scope.uploadFile = function(options, file){
		$cordovaFileTransfer.upload(SNURL+'store', file, options)
		.then(function(response) {
			return response;
		}, function(err) {
			$ionicLoading.hide();
			$ionicPopup.alert({
		     title: 'Error',
		     template: 'Check your internet conneciton or try again later.'
		   });

			// $scope.err = err;
		}, function (progress) {
			// constant progress updates
		});
	};


	$scope.uploadVideo = function(title, body, tags_name, topic_title, slug){
		var fileName = 'survivorsNetwork' + new Date().getTime() + ".mp4";
		var options = {
			fileKey: "video",
			fileName: fileName,
			httpMethod: "POST",
			chunkedMode: true,
			mimeType: "video/mp4",
			params: {
		    	title: title,
				body: body,
				slug: slug,
				tags: tags_name,
				topic_title: topic_title,
				email: email
		    }
		};

		$scope.uploadFile(options, $scope.video);
	};


// ---------------------------------------------------------------------------------
    $scope.upload = function(title, body, tags_name, topic_title, slug){
		var fileName = 'surivorsNetwork' + new Date().getTime() + ".jpg";

		var options = {
		    fileKey: "file",
		    fileName: fileName,
		    httpMethod: "POST",
		    chunkedMode: true,
		    mimeType: "image/jpeg",
		    params: {
		    	title: title,
				body: body,
				slug: slug,
				tags: tags_name,
				topic_title: topic_title,
				email: email
		    }
		};

		$scope.uploadFile(options, $scope.picture);
		
    };
	// -------------------------------------------------------------------------

	$scope.postNoFile = function(title, body, tags_name, topic_title, slug){
		$http.post(SNURL+'store', {
			title: title,
			body: body,
			slug: slug,
			tags: tags_name,
			topic_title: topic_title,
			email: email
		}).success(function(response){
			if(response == 'success'){
				$ionicLoading.show();
				$timeout(function(){
					$ionicHistory.clearCache();
					$state.go('tab.home');
					$ionicLoading.hide();
				}, 1000);
			}
			$scope.cleanForm();
		}).error(function(err){
			$scope.err = err;
		});
	};



	$scope.cleanForm = function(){
		document.getElementById('title').value = '';
		document.getElementById('body').value = '';
		document.getElementById('tags_name').value = '';
		document.getElementById('topic_title').value = '';
		$scope.picture = undefined;
		$scope.video = '';
	};


	$scope.submit = function(title, body, tags_name, topic_title){
		var slug = title.replace(/ /g,"-");
		$ionicHistory.clearHistory();
		if($scope.picture !=  undefined){
			$ionicLoading.show();
			$timeout(function(){
				$scope.upload(title, body, tags_name, topic_title, slug);
				$ionicHistory.clearCache();
				$state.go('tab.home');
				$scope.cleanForm();
				$ionicLoading.hide();
			}, 1000);

		} else if($scope.video != ''){
			$ionicLoading.show();
			$timeout(function(){
				$scope.uploadVideo(title, body, tags_name, topic_title, slug);
				$ionicHistory.clearCache();
				$state.go('tab.home');
				$scope.cleanForm();
				$ionicLoading.hide();
			}, 1000);
		} else {
			$scope.postNoFile(title, body, tags_name, topic_title, slug);
		}
	};
});


