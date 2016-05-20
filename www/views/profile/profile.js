angular.module('starter')
.controller('ProfileCtrl', function($scope, $http, $ionicLoading, $timeout, SNURL, $ionicPopup, $state){
	$scope.user = [];
	var token = localStorage.getItem('token');

	$ionicLoading.show();
	$timeout(function(){
		$http.get(SNURL+'authenticate/user?token='+token)
		.success(function(response){
			$ionicLoading.hide();
			$scope.user = response.user;
			$scope.topics_count = response.user.topics_count;
			$scope.connections_count = response.user.connections_count;
			$scope.inspired_count = response.user.inspired_count;
		})
		.error(function(error){
			$ionicLoading.hide();
			$ionicPopup.alert({
		     title: 'Error',
		     template: 'Check your internet connection or try again later.'
		   });
		});
	}, $timeout || 2000);


	$scope.checkTopic = function(id){
		$state.go('tab.profile_topic', {id: id});
	};
});