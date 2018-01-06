var app = angular.module('angularScripts', ['ngRoute', 'ngResource']).run(function($rootScope, $http, $location) {
	
	$http.get('/auth/check')
		.success(function(res){
			console.log(res);
			if(res.status == '200'){
				$rootScope.authenticated = true;
				$rootScope.current_user = res.data;
    	}else{
				$rootScope.authenticated = false;
				$rootScope.current_user = '';
			}
		});	

	

	$rootScope.signout = function(){
    	$http.get('auth/signout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
	};

	$rootScope.$watch(function() { return $location.path(); }, function(newValue, oldValue){  
		if ($rootScope.authenticated == false && 
			newValue != '/login' && 
			newValue != '/register' && 
			newValue != '/#' && 
			newValue != '/' && 
			newValue != '' && 
			newValue != '/user' && 
			newValue != '/main'){  
            $location.path('/login');  
    }  
	});
});

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
		//the user display
		.when('/user', {
			templateUrl: 'user.html',
			controller: 'userController'
		});
});

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

app.controller('mainController', function(postService, $scope, $rootScope){
	postService.get().$promise.then(function(response){$scope.posts =  response.data;});
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	
	$scope.post = function() {
	  $scope.newPost.created_by = $rootScope.current_user;
	  $scope.newPost.created_at = Date.now();
	  postService.save($scope.newPost, function(){
	    postService.get().$promise.then(function(response){$scope.posts =  response.data;});
	    $scope.newPost = {created_by: '', text: '', created_at: ''};
	  });
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
		$http.post('/auth/login', $scope.user)
		.success(function(res){
			console.log(res);
			switch(res.status){
				case '200':
					$rootScope.authenticated = true;
					$rootScope.current_user = res.data.username;
					$location.path('/');
					break;
				default:
					$scope.error_message = res.msg || "Error";
					break;
			}
    });
	};

  $scope.register = function(){
		$http.post('/auth/signup', $scope.user)
		.success(function(res){
			console.log(res);
			switch(res.status){
				case '200':
					$rootScope.authenticated = true;
					$rootScope.current_user = res.data.username;
					$location.path('/');
					break;
				default:
					$scope.error_message = res.msg || "Error";
					break;
			}
    	});
	};
});

app.controller("userController", function ($scope, $http) {

	$scope.InsertUser = function () {
		$http.post('/api/users', JSON.stringify($scope.CurrentUser))
		.success(function(res){
			console.log(res);
			switch(res.status){
				case '200':
					$scope.FindUser();
					$scope.ListUsers();
					$scope.error_message = res.msg || "";
					break;
				default:
					$scope.error_message = res.msg || "Error";
					break;
    		}
    	});	
	};

	$scope.ListUsers = function () {
		$http.get('/api/users')
		.success(function(res){
			console.log(res);
			switch(res.status){
				case '200':
					$scope.users = res.data;
					break;
				default:
					break;
			}
		});	
	};

	$scope.FindUser = function () {
		$http.get('/api/users/' + $scope.CurrentUser.username)
		.success(function(res){
			console.log(res);
			switch(res.status){
				case '200':
					$scope.CurrentUser = res.data;
					$scope.ListUsers();
					$scope.error_message = res.msg || "";
					break;
				default:
					$scope.error_message = res.msg || "Error";
					break;
			}
		});	
	};
		
	$scope.UpdateUser = function () {
		$http.put('/api/users/'+ $scope.CurrentUser.username, JSON.stringify($scope.CurrentUser))
		.success(function(res){
			console.log(res);
			switch(res.status){
				case '200':
					$scope.ListUsers();
					$scope.error_message = res.msg || "";
					break;
				default:
					$scope.error_message = res.msg || "Error";
					break;
			}
		});	
	};

	$scope.DeleteUser = function () {
		$http.delete('/api/users/'+ $scope.CurrentUser.username)
		.success(function(res){
			console.log(res);
			switch(res.status){
				case '200':
					$scope.CleanUser();
					$scope.ListUsers();
					$scope.error_message = res.msg || "";
					break;
				default:
					$scope.error_message = res.msg || "Error";
					break;
			}
		});	
	};

	$scope.CleanUser = function () {
		$scope.CurrentUser = {}
		$scope.error_message = "";
	}

	$scope.ListUsers();
	
});