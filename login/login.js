'use strict';

angular.module("billAdmApp.login", [])

.config(["$stateProvider", function($stateProvider) {
	
	$stateProvider
		.state("login", {
			url: "/login",
			views: {
				"loginform": {
					templateUrl: "login/login.html",
					controller: "LoginCtrl",
				},
			},
			
		});

}])

.factory("UserService", function($http, $q, $cookies) {

	var obj;

	var initObj = function() {
		obj = {};
		obj.isAuthed = false;
		obj.roles = [];
		$cookies.putObject("userservice", obj);
	};
	
	if ( angular.isUndefined( $cookies.getObject("userservice") ) ) {
		initObj();
	} else {
		obj = $cookies.getObject("userservice")
	}

	// console.log($sessionStorage);

	obj.login = function (credentials) {
		
		var deferred = $q.defer();

		$http.post('/api/v1/login',
			credentials
		).then(
			function(res) {
				console.log(res);

				obj.isAuthed = true;
				obj.roles = res.data.roles;
				$cookies.putObject("userservice", obj);

				// return true;
				deferred.resolve();
			},
			function(err) {
				console.log(err);

				initObj();

				// return false;
				deferred.reject();
			}
		);

		return deferred.promise;

	}; 


	return obj;

})

.controller("LoginCtrl", function($scope, $state, UserService, $timeout) {
	
	console.log("LoginCtrl");

	$scope.SignIn = function() {
		
		UserService.login($scope.credentials).then(
			
			function(res) {
				console.log(res);

				// Баг какой то... без $timeout не работает
				// https://github.com/angular-ui/ui-router/issues/1583
				$timeout(function() {
					$state.go("about");
				}, 0);
			}

		);
		
	};

})