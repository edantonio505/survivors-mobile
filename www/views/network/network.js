angular.module('starter')
.controller('NetworkCtrl', function($scope, $http, SNURL, $state, $rootScope){
	var token = localStorage.getItem('token');
	var AuthEmail = localStorage.getItem('user.email');

	$rootScope.$watch('connections_count', function(newValue, oldValue){
		$scope.init();
	});
	

	$scope.init = function(){
		$http.get(SNURL+'get_connections?token='+token+'&AuthEmail='+AuthEmail)
		.success(function(response){
			$scope.connections = response;
		});
	};
	
	$scope.init();
})
.controller('ConnectionProfileCtrl', function($scope, $http, SNURL, $stateParams, $state){
	var token = localStorage.getItem('token');
	$http.get(SNURL+'get_user_byid/'+$stateParams.id+'?token='+token)
	.success(function(response){
		$avatarContainer = document.getElementById('avatarContainer');
		$avatarContainer.addEventListener("load", function(){
			this.style.visibility = 'visible';
		}, true);

		$scope.user = response.user;
		$scope.status = 'Connected';
	});

	$scope.checkTopic = function(id){
		$state.go('tab.network_topic', {id: id});
	};
});