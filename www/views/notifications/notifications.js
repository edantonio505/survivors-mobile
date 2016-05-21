angular.module('starter')
.controller('NotificationsCtrl', function($scope, $http, socket, $rootScope){
	
	$scope.notifications = $rootScope.notifications
	
});