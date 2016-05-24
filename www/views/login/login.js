angular.module('starter')
.controller('LoginCtrl', function($scope, $ionicLoading, $timeout, $state, $http, $ionicPopup, SNURL, $ionicHistory, $rootScope, EventService){
	$scope.token = null;

	$scope.checkIfLoggedIn = function(){
		// Check if Token is saved in local storage to see if user is logged in
		var isAutenticated = localStorage.getItem('token');
		if(isAutenticated){
			$ionicLoading.show();
			$timeout(function(){
				$ionicLoading.hide();
				$state.go('tab.home');
			}, 1000);
		}
	};

	$scope.login = function(email, password){
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
		$ionicLoading.show();
		$timeout(function(){
			$http.post(SNURL+'authenticate', {
				email: email,
				password: password
			})
			.success(function(response){
				$rootScope.notificationsCount = response.log_count;
				$rootScope.notifications = response.event_logs;
				var token = response.token;
				localStorage.setItem('token', token);
				localStorage.setItem('user.email', email);
				localStorage.setItem('user.password', password);
				localStorage.setItem('user.name', response.user_name);
				localStorage.setItem('user.avatar', response.user_avatar);
				$state.go('tab.home');
				$ionicLoading.hide();
			})
			.error(function(err){
				$ionicPopup.alert({
					title: 'Nah',
					template: 'What a moron.. you don know your password haha'
				});
				$ionicLoading.hide();
			});
		}, $timeout || 3000);		
	};
	$scope.checkIfLoggedIn();
});