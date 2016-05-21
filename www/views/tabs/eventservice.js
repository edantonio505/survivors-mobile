angular.module('starter')
.factory('EventService', function($rootScope){
	$rootScope.notificationsCount = 0;
  	$rootScope.notifications = [];
	var eventFunctions = {
		handleEvents: function(data){
			$rootScope.notificationsCount += 1;
			$rootScope.notifications.unshift(data);
			return $rootScope.notificationsCount;
		}	
	};

	return eventFunctions;
});