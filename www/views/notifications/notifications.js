angular.module('starter')
.controller('NotificationsCtrl', function($scope, $http, socket){
	var username = localStorage.getItem('user.name');
	$scope.notifications = [];


	socket.on('user.'+username+':App\\Events\\UserCommented', function(data){
		$scope.notifications.unshift(data);
	});

	socket.on('user.'+username+':App\\Events\\UserIsInspired', function(data){
		$scope.notifications.unshift(data);
	});
});