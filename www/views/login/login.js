angular.module('starter')
.controller('LoginCtrl', function(
	$scope, 
	$ionicLoading, 
	$timeout, 
	$state, 
	$http, 
	$ionicPopup, 
	SNURL, 
	$rootScope,
	$cordovaOauth,
	$ionicModal,
	AuthService
){
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
		AuthService.login(email, password);
	}
	
	$scope.googleLogin = function(){
		$cordovaOauth.google("875167662896-f637cn01j1i4qb6cqjkhfi4q2722321e.apps.googleusercontent.com", ["email", "https://www.googleapis.com/auth/userinfo.profile"]).then(function(result){
		 	$scope.access_token = result.access_token;
		 	$ionicModal.fromTemplateUrl('views/login/create_password.html', {
			    scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}, function(error) {
		    console.log("Error -> " + error);
		});
	}

	$scope.closeModal = function(){
		$scope.modal.hide();
		$scope.modal.remove();
	};

	$scope.getNewPassword = function(newPassword){
		$ionicLoading.show();
		$http.post(SNURL+'authenticate/signup_oauth', {
			access_token: $scope.access_token,
			password: newPassword		
		}).success(function(response){
			$scope.getCredentials(response, '', newPassword);
			$state.go('tab.home');
			$ionicLoading.hide();
			$scope.modal.hide();
			$scope.modal.remove();
		})
		.error(function(err){
			$ionicLoading.hide();
			$scope.modal.hide();
			$scope.modal.remove();
			$ionicPopup.alert({
				title: 'Error',
				template: 'You are already registered, please try login in',
				okType: 'button-assertive'
			});
		});
		
	}

	$scope.checkIfLoggedIn();
})

.controller('ReloginCtrl', function(
	$scope, 
	$http,  
	$ionicLoading, 
	$timeout, 
	$state,
	AuthService
){
	$scope.avatar = localStorage.getItem('user.avatar');
	$scope.email = localStorage.getItem('user.email');
	$scope.username = localStorage.getItem('user.name');
	$scope.password = localStorage.getItem('user.password');

	$scope.relogin = function(email, password){
		AuthService.login(email, password);
	}


	$scope.login = function(){
		AuthService.logout_no_loading();
	};
});