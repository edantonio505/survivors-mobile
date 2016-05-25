angular.module('starter')
.controller('NotificationsCtrl', function($scope, $http, socket, $rootScope){
	
	$scope.notifications = $rootScope.notifications

	$rootScope.$watch('notifications', function(newValue, oldValue){
		$scope.notifications = $rootScope.notifications
	});
});