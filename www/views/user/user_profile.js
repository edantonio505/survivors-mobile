angular.module('starter')
.controller('UserProfileCtrl', function(
	$scope, 
	$http, 
	$stateParams, 
	SNURL, 
	$ionicLoading, 
	$timeout, 
	UsersConnectionService, 
	$state,
	$rootScope,
	AuthService
){
	$scope.AuthUserEmail = localStorage.getItem('user.email');

	$ionicLoading.show();
	$timeout(function(){
		$http.get(SNURL+'get_user/'+$stateParams.topicId+'/'+$scope.AuthUserEmail)
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
		$rootScope.connections_count += 1;
		$rootScope.youAccepted_user = true;
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


	AuthService.status();
});