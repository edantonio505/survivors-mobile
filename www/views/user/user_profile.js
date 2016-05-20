angular.module('starter')
.controller('UserProfileCtrl', function($scope, $http, $stateParams, SNURL, $ionicLoading, $timeout, UsersConnectionService, $state){
	var token = localStorage.getItem('token');
	$scope.AuthUserEmail = localStorage.getItem('user.email');

	$ionicLoading.show();
	$timeout(function(){
		$http.get(SNURL+'get_user/'+$stateParams.topicId+'/'+$scope.AuthUserEmail+'?token='+token)
		.success(function(response){
			$scope.user = response.user;
			$scope.status = response.user.status;
			$avatarContainer = document.getElementById('avatarContainer');
			$avatarContainer.addEventListener("load", function(){
				this.style.visibility = 'visible';
			}, true);
			$ionicLoading.hide();
		});
	}, $timeout);

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