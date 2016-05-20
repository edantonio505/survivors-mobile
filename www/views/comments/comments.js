angular.module('starter')
.controller('CommentsCtrl', function($http, $scope, $stateParams, SNURL){
	var token = localStorage.getItem('token');
	var AuthUserName = localStorage.getItem('user.name');
	var AuthUserAvatar = localStorage.getItem('user.avatar');
	$scope.comments = [];
	$scope.topic = $stateParams;

	$scope.init = function(){
		$http.get(SNURL+'comments/'+$stateParams.id+'?token='+token)
		.success(function(response){
			$scope.body = response.body;
			$scope.user = response.post_user;
			$scope.user_avatar = response.post_user_avatar;
			$scope.comments = response.comments;
			$scope.created_time = response.created_time;
			$scope.tags = response.tags;
		});
	};

	$scope.submitComment = function(newComment){
		var addComment = {
			body: newComment,
			user_name: AuthUserName,
			user_avatar: AuthUserAvatar
		};
		$http.post(SNURL+'post_comment/'+$stateParams.id+'/'+AuthUserName+'?token='+token, {
			body: newComment
		})
		.error(function(response){
			alert('There was an error');
		});
		$scope.comments.push(addComment);
		var textarea = document.getElementsByClassName('newComment');
		angular.forEach(textarea, function(key){
			key.value = '';
		});
	};

	$scope.init();
})
.controller('CommentsUserCtrl', function($scope, $http, $stateParams, SNURL, UsersConnectionService, $state){
	var token = localStorage.getItem('token');
	$scope.AuthUserEmail = localStorage.getItem('user.email');

	$http.get(SNURL+'get_user_by/'+$stateParams.name+'/'+$scope.AuthUserEmail+'?token='+token).
	success(function(response){
		$scope.user = response.user;
		$scope.status = response.user.status;
		$avatarContainer = document.getElementById('avatarContainer');
		$avatarContainer.addEventListener("load", function(){
			this.style.visibility = 'visible';
		}, true);
	});
	
	$scope.connect = function(username){
		$scope.status = UsersConnectionService.connect(username);
	};

	$scope.accept = function(username){
		$scope.status = UsersConnectionService.accept(username);
	};

	$scope.addConnection = function(username){
		if($scope.status == 'Accept')
		{
			$scope.accept(username);
		} else {
			$scope.connect(username);
		}
	};

	$scope.checkTopic = function(id){
		$state.go('tab.home_topic', {id: id});
	};
});