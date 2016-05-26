angular.module('starter')
.controller('LoginCtrl', function(
	$scope, 
	$ionicLoading, 
	$timeout, 
	$state, 
	$http, 
	$ionicPopup, 
	SNURL, 
	$ionicHistory, 
	$rootScope,
	$cordovaOauth,
	$ionicModal
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
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
		$ionicLoading.show();
		$timeout(function(){
			$http.post(SNURL+'authenticate', {
				email: email,
				password: password
			})
			.success(function(response){
				if(response.log_count == 0)
				{
					$rootScope.notificationsCount = 0;
					$rootScope.notifications = [];
				} else {
					$rootScope.notificationsCount = response.log_count;
					$rootScope.notifications = response.event_logs;
				}
				$scope.getCredentials(response, email, password);
				$state.go('tab.home');
				$ionicLoading.hide();
			})
			.error(function(err){
				$ionicPopup.alert({
					title: 'Error',
					cssClass: 'color: red',
					template: 'Could not retrieve your profile',
					okType: 'button-assertive'
				});
				$ionicLoading.hide();
			});
		}, $timeout || 3000);		
	};

	$scope.getCredentials = function(response, email, password){
		if(email == '')
		{
			email = response.email;
		}

		localStorage.setItem('token', response.token);
		localStorage.setItem('user.email', email);
		localStorage.setItem('user.password', password);
		localStorage.setItem('user.name', response.user_name);
		localStorage.setItem('user.avatar', response.user_avatar);
	};

	
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
		});
		$scope.modal.hide();
		$scope.modal.remove();
	}

	$scope.checkIfLoggedIn();
});