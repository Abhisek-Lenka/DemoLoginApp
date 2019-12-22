var app = angular.module('mainApp',['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: './components/home.html',
		controller: 'homeCtrl'
	})

	.when('/register',{
		templateUrl : './components/register.html',
		controller : 'registerCtrl'
	})

	.when('/login',{
		templateUrl : './components/login.html',
		controller : 'loginCtrl'
	})

	.when('/logout',{
		resolve : {
			deadResolve : function($location, user) {
				user.clearData();
				$location.path('/');
			}
		}
	})

	.when('/dashboard',{
		resolve : {
			check: function($location, user) {
				if(!user.isUserLoggedIn()) {
				$location.path('/login');
			}
		}
		},
		templateUrl : './components/dashboard.html',
		controller : 'dashboardCtrl'
	})

	.otherwise({
		template: '404'
	});

	$locationProvider.html5Mode({
		enabled: true,
        requireBase: false
	});
});

app.service('user',function() {
	var username;
	var id;
	var loggedin = false;
	
	this.getName = function() {
		return username;
	};

	this.setID = function(userID) {
		id = userID;
	};

	this.getID = function() {
		return id;
	};

	this.isUserLoggedIn = function() {
		if(!!localStorage.getItem('login')) {
			loggedin = true;
			var data = JSON.parse(localStorage.getItem('login'));
			username = data.username;
			id = data.id;
		}
		return loggedin;
	};

	this.saveData = function(data) {
		username = data.user;
		id = data.id;
		loggedin = true;
		localStorage.setItem('login',JSON.stringify({
			id : id,
			username : username
		}))
	};

	this.clearData = function() {
		localStorage.removeItem('login');
		username="";
		id="";
		loggedin = false;
	}
});

app.controller('homeCtrl',function($scope,$location) {
	$scope.goToLogin = function() {
		$location.path('/login');
	};

	$scope.register = function() {
		$location.path('/register');
	}
});

app.controller('loginCtrl',function($scope, $http, $location, user) {
	$scope.login = function() {
		var username = $scope.username;
		var password = $scope.password;

		$http({
			url : 'http://localhost/LoginAPP/php server/login.php',
			method : 'POST',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			data : 'username=' +username+ '&password=' +password
		}).then(function(response) {
			if(response.data.status == 'loggedin') {
				user.saveData(response.data);
				$location.path('/dashboard');				
			} else {
				alert('invalid login credentials!');
			}
		})
	}
});

app.controller('registerCtrl',function($scope, $http, $location, user) {
	$scope.registerUser = function() {
		var username = $scope.username;
		var password = $scope.password;
		var email = $scope.email;
		var gender = $scope.gender;

		$http({
			url : 'http://localhost/LoginAPP/php server/register.php',
			method : 'POST',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			data : 'username=' +username+ '&password=' +password+ '&email=' +email+ '&gender=' +gender
		 }).then(function(response) {
		 	if(response.data.status == 'loggedin') {
		 		user.saveData(response.data);
		 		$location.path('/dashboard');				
		 	} else {
		 		alert('Error in Register!');
		 	}
		 })
	}
});

app.controller('dashboardCtrl',function($scope, user, $http ,$location) {
	$scope.user = user.getName();

	$scope.logOut = function() {
		$location.path('/logout');
	}

});