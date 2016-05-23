angular.module('starter')
.controller('TabsCtrl', function(
	$scope, 
	AuthService, 
	$ionicModal, 
	SNURL, 
	$http, 
	$ionicLoading, 
	$timeout, 
	$state, 
	socket, 
	EventService,
	$rootScope
){
	var token = localStorage.getItem('token');
	var username = localStorage.getItem('user.name');
	$scope.searchBy = 'tag';
	$scope.newPosts = 0;

	$rootScope.$watch('newPost', function(newValue, oldValue) {
	  $scope.newPosts = newValue;
	});

	$scope.logout = function(){
		AuthService.logout();
	};

	$scope.byName = function(){
		$scope.searchBy = 'name';
		$scope.requestSearch();
	};

	$scope.byTag = function(){
		$scope.searchBy = 'tag';
		$scope.requestSearch();
	};

	$scope.search = function(){
		$ionicModal.fromTemplateUrl('views/tabs/modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(modal) {
		    $scope.modal = modal;
		    $scope.modal.show();
		});
		$scope.requestSearch();
	};

	$scope.requestSearch = function(){
		$ionicLoading.show();
		$timeout(function(){
			$http.get(SNURL+'search_by/'+$scope.searchBy+'?token='+token)
			.success(function(response){
				$ionicLoading.hide();
				$scope.rs = response;
			});
		}, $timeout);	
	};

	$scope.closeModal = function() {
    	$scope.modal.hide();
    	$scope.modal.remove();
  	};

  	$scope.goToCategories = function(name, type){
  		$scope.closeModal();
  		if(type === 'name'){
  			$state.go('tab.comments_user', {name: name});
  		} else {
  			$state.go('tab.tag_category', {name: name});
  		}
  	};

  	socket.on('user.'+username+':App\\Events\\UserCommented', function(data){
		$scope.notificationsCount = EventService.handleEvents(data);
	});

	socket.on('user.'+username+':App\\Events\\UserIsInspired', function(data){
		if(data.inspiredUser != username){
			$scope.notificationsCount = EventService.handleEvents(data);
		} else {
			$rootScope.inspired_count += 1;
		}
	});

	socket.on('user.'+username+':App\\Events\\UserConnectionAdded', function(data){
		$scope.notificationsCount = EventService.handleEvents(data);
	});

	socket.on('user.'+username+':App\\Events\\UserAcceptedConnection', function(data){
		$scope.notificationsCount = EventService.handleEvents(data);
	});

	socket.on('user.'+username+':App\\Events\\ConnectionCreatedPost', function(data){
		$scope.notificationsCount = EventService.handleEvents(data);
	});

	socket.on('all.users:App\\Events\\NewPost', function(data){
		if(data.userCreator != username){
			EventService.handleNewPost();
			$scope.newPosts = $rootScope.newPost;
		} else {
			$rootScope.topics_count += 1;
		}
	});

	socket.on('user.'+username+':App\\Events\\YouAcceptedConnection', function(data){
		EventService.handleEvents(data);
	});

	socket.on('user.'+username+':App\\Events\\UserUninspired', function(data){
		EventService.handleEvents(data);
	});
})








.controller('CategoriesCtrl', function(SNURL, $http, $scope, $stateParams, $state){
	var token = localStorage.getItem('token');
	$scope.tag_title = $stateParams.name;
	$http.get(SNURL+'get_categories/'+$stateParams.name+'?token='+token)
	.success(function(response){
		$scope.topics = response;
	});

	$scope.checkTopic = function(id){
		$state.go('tab.tag_category_topic', {id: id});
	};
});