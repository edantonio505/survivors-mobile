angular.module('starter')
.factory('AuthService', function($ionicLoading, $timeout, $state, $ionicHistory, $rootScope){
	var token = {
		status: function(){
			var t = localStorage.getItem('token');
			if(!t){this.logout();}
		},
		logout: function(){
			$rootScope.notificationsCount = 0;
			$rootScope.notifications = [];
			$ionicHistory.clearHistory();
			$ionicHistory.clearCache();
			localStorage.removeItem('token');
			localStorage.removeItem('user.email');
			localStorage.removeItem('user.password');
			localStorage.removeItem('user.avatar');
			localStorage.removeItem('user.name');
			$rootScope.notificationsCount = 0;
			$rootScope.notifications = [];

			$ionicLoading.show();
			$timeout(function(){
				$state.go('login');
				$ionicLoading.hide();
			}, 2000);
		}
	};

	return token;
})
.factory('Popup', function($ionicPopup){
	Popup = {
		showAlert: function(message) {
			$ionicPopup.alert({
				title: 'Error',
				template: message
			});
		}
	};

	return Popup;
})
.factory('UsersConnectionService', function(SNURL, $http, Popup, $rootScope){
	var AuthUserEmail = localStorage.getItem('user.email');

	var usersfunctions = {
		connect: function(username){
			$http.post(SNURL+'add_connection', {
				authenticated: AuthUserEmail,
				newConnection: username
			}).
			error(function(response){
				Popup.showAlert('Please check your internet connection');
			});
			return 'Waiting';
		}, 
		accept: function(username){
			$http.post(SNURL+'accept_connection', {
				authenticated: AuthUserEmail,
				acceptConnectionFrom: username
			}).
			error(function(err){
				console.log(err);
			});
			return 'Connected';
			$rootScope.connections_count += 1;
		}
	};
	return usersfunctions;
})
.factory('InspireService', function($http, SNURL){
	var authEmail = localStorage.getItem('user.email');
	var Inspire  = {
		inspired: function(topic_id){
			$inspireIcon = document.getElementById(topic_id+'-inspire');
			$inspiredCount = document.getElementById(topic_id+'-inspiredCount');
			if(angular.element($inspireIcon).hasClass('inspired'))
			{	
				$inspiredCount.innerHTML = Number($inspiredCount.innerHTML) - 1;
				angular.element($inspireIcon).removeClass('inspired');
				$http.get(SNURL+'topic/'+topic_id+'/'+authEmail+'/uninspire').
				error(function(err){
					alert('There was an Error');
				})
			}else {
				angular.element($inspireIcon).addClass('inspired');
				$inspiredCount.innerHTML = Number($inspiredCount.innerHTML) + 1;
				$http.get(SNURL+'topic/'+topic_id+'/'+authEmail+'/inspires').
				error(function(err){
					alert('There was an error');
				});
			}
		},
		inspiredClass: function(topic_id){
			$inspireIcon = document.getElementsByClassName(topic_id+'-inspire');
			$inspiredCount = document.getElementsByClassName(topic_id+'-inspiredCount');	
			if(angular.element($inspireIcon[0]).hasClass('inspired'))
			{	
				$inspiredCount[0].innerHTML = Number($inspiredCount[0].innerHTML) - 1;
				angular.element($inspireIcon).removeClass('inspired');
				$http.get(SNURL+'topic/'+topic_id+'/'+authEmail+'/uninspire').
				error(function(err){
					alert(err);
					console.log(err);
				})
			}else {
				angular.element($inspireIcon[0]).addClass('inspired');
				$inspiredCount[0].innerHTML = Number($inspiredCount[0].innerHTML) + 1;
				$http.get(SNURL+'topic/'+topic_id+'/'+authEmail+'/inspires').
				error(function(err){
					alert('There was an error');
				});
			}
		}

	};
	return Inspire;
})
.factory('socket', function ($rootScope, SNSOCKET) {
  var socket = io.connect(SNSOCKET);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }.bind(this));
    }
  };
});